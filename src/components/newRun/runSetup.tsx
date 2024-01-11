import { Dispatch, SetStateAction, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { usePocket } from "@/contexts";
import { hasDuplicates } from "@/lib/utils";
import { Participant } from "@/lib/types";
import { distanceOptions } from "@/lib/constants";

// Components
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select as ShadSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Icons
import { ArrowDown10, ArrowUp10, Trash } from "lucide-react";
import { usePastParticipants } from "@/hooks/usePastParticipants";
import { RunSetupConfirmationAlert } from "./runSetupConfirmationAlert";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

const FormSchema = z
  .object({
    date: z.date(),
    location: z.enum(["albertParkLake"]),
    participants: z.array(
      z.object({
        bib: z.string(),
        name: z.object(
          { value: z.string(), label: z.string() },
          {
            invalid_type_error: "A name is required here.",
          }
        ),
        distance: z.object({ value: z.string(), label: z.string() }),
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
  );

const initialDate = new Date();
initialDate.setHours(0, 0, 0, 0);

export function RunSetup({
  setStep,
  setParticipants,
}: {
  setStep: Dispatch<SetStateAction<number>>;
  setParticipants: Dispatch<SetStateAction<Participant[]>>;
}) {
  const pastParticipants = usePastParticipants();
  const [order, setOrder] = useState<number>(-1);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const { pb } = usePocket();
  const [newParticipantBib, setNewParticipantBib] = useState<string>("100");
  const [newParticipantName, setNewParticipantName] = useState<{
    value: string;
    label: string;
  } | null>();
  const [newParticipantDistance, setNewParticipantDistance] = useState<{
    value: string;
    label: string;
  } | null>(distanceOptions[1]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
    defaultValues: {
      date: initialDate,
      location: "albertParkLake",
      // @ts-ignore
      participants: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "participants",
  });

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
    const { id: groupRunId } = await pb
      .collection("group_runs")
      .create({ date: data.date, location: data.location, isComplete: false });

    const participants = data.participants.map((participant) => {
      return {
        group_run_id: groupRunId,
        user_id:
          participant.name.value == participant.name.label
            ? undefined
            : participant.name.value,
        name: participant.name.label,
        distance: Number(participant.distance.value),
        bib: Number(participant.bib),
      };
    });

    Promise.all(
      participants.map(async (pdata: Participant) => {
        const res = await pb
          .collection("participant_runs")
          .create(pdata, { requestKey: null });
        pdata.id = res.id;
      })
    );

    setStep(1);
    setParticipants(participants);
    toast({
      title: "Run Created",
      description: "The run was successfully created.",
    });
  }

  const participants = form.getValues("participants");
  const participantNames: string[] = participants.map(
    (participant) => participant.name?.label
  );
  const participantsLength = participants.length;

  function addParticipant(
    bib: string,
    name: { value: string; label: string },
    distance: { value: string; label: string }
  ) {
    append(
      {
        bib,
        name,
        distance,
      },
      {
        focusName: `participants.${participantsLength}.name`,
      }
    );
    setNewParticipantBib(
      order == 1
        ? String(parseInt(newParticipantBib) + 1)
        : String(parseInt(newParticipantBib) - 1)
    );
    setNewParticipantName(null);
    setNewParticipantDistance(distanceOptions[1]);
  }

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
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <DatePicker date={field.value} setDate={field.onChange} />
                </FormControl>
                <FormDescription>
                  Select the date for the run. If you are creating it for today,
                  leave it as is.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <ShadSelect
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="albertParkLake">
                      Albert Park Lake
                    </SelectItem>
                  </SelectContent>
                </ShadSelect>
                <FormDescription>
                  Select the location for the run from the available options.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-2">
            <div>
              <Label>Bib</Label>
              <Input
                value={newParticipantBib}
                onChange={(e) => setNewParticipantBib(e.target.value)}
              />
            </div>
            <div>
              <Label>Name</Label>
              <CreatableSelect
                className="custom-react-select-container"
                classNamePrefix="custom-react-select"
                placeholder="Select..."
                value={newParticipantName}
                onChange={(newName) => setNewParticipantName(newName)}
                options={pastParticipants
                  .filter(
                    (participant) =>
                      !participantNames.includes(participant.name)
                  )
                  .map((participant) => {
                    return {
                      label: participant.name,
                      value: participant.user_id
                        ? participant.user_id
                        : participant.name,
                    };
                  })}
              />
            </div>
            <div>
              <Label>Distance</Label>
              <Select
                className="custom-react-select-container"
                classNamePrefix="custom-react-select"
                placeholder="Select..."
                value={newParticipantDistance}
                onChange={(newDistance) =>
                  setNewParticipantDistance(newDistance)
                }
                options={distanceOptions}
              />
            </div>
            <div className="flex justify-between">
              <div className="flex items-center space-x-2">
                <ArrowDown10 />
                <Switch
                  id="order"
                  onCheckedChange={(val) => setOrder(val ? 1 : -1)}
                />
                <ArrowUp10 />
              </div>
              <Button
                type="button"
                onClick={() => {
                  if (
                    newParticipantBib &&
                    newParticipantName &&
                    newParticipantDistance
                  ) {
                    addParticipant(
                      newParticipantBib,
                      newParticipantName,
                      newParticipantDistance
                    );
                  }
                }}
              >
                Add Participant
              </Button>
            </div>
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
                className="grid grid-cols-[65px_2fr_1fr_40px] gap-x-2"
              >
                <FormField
                  control={form.control}
                  name={`participants.${index}.bib`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="#" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`participants.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <CreatableSelect
                          {...field}
                          className="custom-react-select-container"
                          classNamePrefix="custom-react-select"
                          placeholder="Select..."
                          options={pastParticipants
                            .filter(
                              (participant) =>
                                !participantNames.includes(participant.name)
                            )
                            .map((participant) => {
                              return {
                                label: participant.name,
                                value: participant.user_id
                                  ? participant.user_id
                                  : participant.name,
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
                          options={distanceOptions}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {index !== 0 && (
                  <div className="flex justify-center">
                    <Button
                      onClick={() => remove(index)}
                      variant="destructive"
                      size="icon"
                    >
                      <Trash />
                    </Button>
                  </div>
                )}
              </div>
            ))}
            {participantsLength == 0 && (
              <span className="text-center">No participants added yet.</span>
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
              Create Run
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
