import { Dispatch, SetStateAction, useEffect, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { usePocket } from "@/contexts";
import { hasDuplicates } from "@/lib/utils";
import { GroupRun, Participant } from "@/lib/types";
import { DISTANCE_OPTIONS } from "@/lib/constants";

// Components
import Select from "react-select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Icons
import { Trash } from "lucide-react";
import { useMembers } from "@/hooks/useMembers";
import { RunSetupConfirmationAlert } from "./runSetupConfirmationAlert";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";

const FormSchema = z
  .object({
    participants: z.array(
      z.object({
        id: z.string().optional(),
        bib: z.string(),
        details: z.object(
          { value: z.string(), label: z.string() },
          {
            invalid_type_error: "A name is required here.",
          }
        ),
        distance: z.object({ value: z.string(), label: z.string() }),
        isNew: z.boolean(),
        isPaid: z.boolean(),
      })
    ),
  })
  .refine(
    (schema) => {
      const bibArr = schema.participants.map((elem) => elem.bib);
      return !hasDuplicates(bibArr);
    },
    {
      path: ["participants"],
      message: "You cannot have duplicate bib numbers.",
    }
  )
  .refine(
    (schema) => {
      const waiverIdArr = schema.participants.map((elem) => elem.details.value);
      return !hasDuplicates(waiverIdArr);
    },
    {
      path: ["participants"],
      message: "You cannot have duplicate participants.",
    }
  );

export function RunParticipantSetup({
  groupRun,
  setStep,
  setParticipants,
}: {
  groupRun: GroupRun;
  setStep: Dispatch<SetStateAction<number>>;
  setParticipants: Dispatch<SetStateAction<Participant[]>>;
}) {
  const { pb } = usePocket();
  const { members } = useMembers();

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const [partDetails, setPartDetails] = useState<{
    label: string;
    value: string;
  } | null>();
  const [partDist, setPartDist] = useState<{
    value: string;
    label: string;
  } | null>(DISTANCE_OPTIONS[1]);
  const [partIsNew, setPartIsNew] = useState<boolean>(false);
  const [partIsPaid, setPartIsPaid] = useState<boolean>(true);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
    defaultValues: {
      participants: [],
    },
  });

  const { fields, prepend, remove, replace } = useFieldArray({
    control: form.control,
    name: "participants",
  });

  // Load existing participants from database
  useEffect(() => {
    const loadExistingParticipants = async () => {
      try {
        const existingParticipants = await pb.collection("participant_runs").getFullList({
          filter: pb.filter("group_run_id = {:runId}", { runId: groupRun.id }),
          sort: "-bib",
        }) as Participant[];

        if (existingParticipants.length > 0) {
          const formattedParticipants = existingParticipants.map(participant => ({
            id: participant.id,
            bib: participant.bib.toString(),
            details: {
              value: participant.waiver_id,
              label: participant.name,
            },
            distance: DISTANCE_OPTIONS.find(opt => opt.value === participant.distance.toString()) || DISTANCE_OPTIONS[1],
            isNew: participant.is_new,
            isPaid: participant.is_paid,
          }));
          replace(formattedParticipants);
        }
      } catch (error) {
        console.error("Failed to load existing participants:", error);
      }
    };

    loadExistingParticipants();
  }, [groupRun.id, pb, replace]);

  const handleSubmitConfirmation = () => {
    setIsConfirmationModalOpen(true);
  };

  const handleSubmitConfirmationConfirm = () => {
    form.handleSubmit(onSubmit)();
    setIsConfirmationModalOpen(false);
  };

  const handleSubmitConfirmationCancel = () => {
    setIsConfirmationModalOpen(false);
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const participants = data.participants.map((participant) => {
      return {
        id: participant.id,
        waiver_id: participant.details.value,
        name: participant.details.label,
        group_run_id: groupRun.id,
        distance: Number(participant.distance.value),
        bib: Number(participant.bib),
        is_new: participant.isNew,
        is_paid: participant.isPaid,
        time_seconds: 0,
      };
    });

    setStep(2);
    setParticipants(participants);
  }

  const participants = form.getValues("participants");
  const participantsLength = participants.length;

  async function addParticipant() {
    const latestParticipant = participants[0];
    const nextBibNumber = latestParticipant
      ? String(parseInt(latestParticipant.bib) - 1)
      : "100";
    
    if (partDetails && partDist) {
      try {
        // Create participant in database immediately
        const participantData = {
          waiver_id: partDetails.value,
          name: partDetails.label,
          group_run_id: groupRun.id,
          distance: Number(partDist.value),
          bib: Number(nextBibNumber),
          is_new: partIsNew,
          is_paid: partIsPaid,
          time_seconds: 0,
        };

        const createdParticipant = await pb
          .collection("participant_runs")
          .create(participantData, { requestKey: null });

        // Add to form
        prepend(
          {
            id: createdParticipant.id,
            bib: nextBibNumber,
            details: { label: partDetails.label, value: partDetails.value },
            distance: partDist,
            isNew: partIsNew,
            isPaid: partIsPaid,
          },
          {
            shouldFocus: false,
          }
        );

        // Reset form inputs
        setPartDetails(null);
        setPartDist(DISTANCE_OPTIONS[1]);
        setPartIsNew(false);
        setPartIsPaid(true);
      } catch (error) {
        console.error("Failed to add participant:", error);
        // You might want to show a toast or error message here
      }
    }
  }

  async function removeParticipant(index: number) {
    const participant = participants[index];
    if (participant.id) {
      try {
        // Delete from database
        await pb.collection("participant_runs").delete(participant.id);
        // Remove from form
        remove(index);
      } catch (error) {
        console.error("Failed to remove participant:", error);
        // You might want to show a toast or error message here
      }
    } else {
      // If no ID, just remove from form (shouldn't happen with new logic)
      remove(index);
    }
  }

  // Function to update participant in database when form fields change
  async function updateParticipant(index: number, field: string, value: string | { value: string; label: string } | null) {
    const participant = participants[index];
    if (participant.id && value !== null) {
      try {
        const updateData: Record<string, string | number> = {};
        
        switch (field) {
          case 'bib':
            if (typeof value === 'string') {
              updateData.bib = Number(value);
            }
            break;
          case 'details':
            if (typeof value === 'object' && value !== null) {
              updateData.waiver_id = value.value;
              updateData.name = value.label;
            }
            break;
          case 'distance':
            if (typeof value === 'object' && value !== null) {
              updateData.distance = Number(value.value);
            }
            break;
          default:
            return;
        }

        await pb.collection("participant_runs").update(participant.id, updateData);
      } catch (error) {
        console.error("Failed to update participant:", error);
        // You might want to show a toast or error message here
      }
    }
  }

  const addedParticipants: string[] = participants.map(
    (participant) => participant.details.value
  );

  return (
    <>
      <RunSetupConfirmationAlert
        isConfirmationModalOpen={isConfirmationModalOpen}
        setIsConfirmationModalOpen={setIsConfirmationModalOpen}
        handleSubmitConfirmationConfirm={handleSubmitConfirmationConfirm}
        handleSubmitConfirmationCancel={handleSubmitConfirmationCancel}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmitConfirmation)}
          className="flex flex-col gap-8 md:gap-12"
        >
          <h1 className="text-3xl md:text-5xl text-center md:text-left font-bold">
            Run Participants
          </h1>
          <div className="space-y-4 md:space-y-6">
            <div>
              <Label>Name</Label>
              <Select
                className="custom-react-select-container"
                classNamePrefix="custom-react-select"
                placeholder="Select..."
                isSearchable={true}
                value={partDetails}
                onChange={(details) => setPartDetails(details)}
                options={members
                  .filter(
                    (member) => !addedParticipants.includes(member.waiver_id)
                  )
                  .map((member) => {
                    return {
                      label: member.name,
                      value: member.waiver_id,
                    };
                  })}
              />
            </div>
            <div className="flex justify-between">
              <div className="flex gap-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_new"
                    checked={partIsNew}
                    onCheckedChange={(e) => setPartIsNew(!!e.valueOf())}
                  />
                  <label
                    htmlFor="is_new"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    New to Gunnies
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_paid"
                    checked={partIsPaid}
                    onCheckedChange={(e) => setPartIsPaid(!!e.valueOf())}
                  />
                  <label
                    htmlFor="is_paid"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Paid $5
                  </label>
                </div>
              </div>
            </div>
            <div>
              <Label>Distance</Label>
              <Select
                className="custom-react-select-container"
                classNamePrefix="custom-react-select"
                placeholder="Select..."
                isSearchable={false}
                value={partDist}
                onChange={(newDistance) => setPartDist(newDistance)}
                options={DISTANCE_OPTIONS}
              />
            </div>
            <Button type="button" onClick={addParticipant}>
              Add Participant
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-[65px_2fr_1fr_40px] gap-x-2">
              <p>Bib</p>
              <p>Name</p>
              <p>Distance</p>
            </div>
            {fields.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-[65px_1.75fr_1.25fr_40px] gap-x-2"
              >
                <FormField
                  control={form.control}
                  name={`participants.${index}.bib`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          placeholder="#" 
                          {...field} 
                          onBlur={() => {
                            field.onBlur();
                            updateParticipant(index, 'bib', field.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`participants.${index}.details`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          {...field}
                          className="custom-react-select-container"
                          classNamePrefix="custom-react-select"
                          placeholder="Select..."
                          onChange={(value) => {
                            field.onChange(value);
                            updateParticipant(index, 'details', value);
                          }}
                          options={members.map((member) => {
                            return {
                              label: member.name,
                              value: member.waiver_id,
                            };
                          })}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`participants.${index}.distance`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          {...field}
                          className="custom-react-select-container"
                          classNamePrefix="custom-react-select"
                          placeholder="Select..."
                          onChange={(value) => {
                            field.onChange(value);
                            updateParticipant(index, 'distance', value);
                          }}
                          options={DISTANCE_OPTIONS}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-center">
                  <Button
                    onClick={() => removeParticipant(index)}
                    variant="destructive"
                    size="icon"
                    type="button"
                  >
                    <Trash />
                  </Button>
                </div>
              </div>
            ))}
            {participantsLength == 0 && (
              <span className="text-center mt-4">
                No participants have been added yet.
              </span>
            )}
            {form.formState.errors.participants?.root && (
              <span className="font-bold text-destructive">
                {form.formState.errors.participants.root.message}
              </span>
            )}
          </div>
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={participantsLength == 0}
              className="w-48"
            >
              Next Step
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
