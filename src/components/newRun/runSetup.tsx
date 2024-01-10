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
import { Switch } from "@/components/ui/switch";
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
import { ArrowDown10, ArrowUp10, Plus, Trash } from "lucide-react";
import { usePastParticipants } from "@/hooks/usePastParticipants";
import { RunSetupConfirmationAlert } from "./runSetupConfirmationAlert";

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
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
    defaultValues: {
      date: initialDate,
      location: "albertParkLake",
      // @ts-ignore
      participants: [{ bib: "100", name: null, distance: distanceOptions[1] }],
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
  const newBibNumber = Number(participants[participantsLength - 1].bib) + order;

  function addParticipant() {
    append(
      {
        bib: String(newBibNumber),
        // @ts-ignore
        name: null,
        distance: distanceOptions[1],
      },
      {
        focusName: `participants.${participantsLength}.name`,
      }
    );
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
          <div></div>
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
            <div className="grid grid-cols-[1fr_2fr_40px] gap-x-2">
              <div className="flex items-center space-x-2">
                <ArrowDown10 />
                <Switch
                  id="order"
                  onCheckedChange={(val) => setOrder(val ? 1 : -1)}
                />
                <ArrowUp10 />
              </div>
              <span className="font-bold text-destructive">
                {form.formState.errors.participants?.root && (
                  <p>{form.formState.errors.participants.root.message}</p>
                )}
              </span>
              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={addParticipant}
                >
                  <Plus />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Button type="submit" className="w-48">
              Create Run
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
