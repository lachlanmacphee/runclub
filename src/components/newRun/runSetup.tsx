import { Dispatch, SetStateAction, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { hasDuplicates } from "@/lib/utils";
import { usePocket } from "@/contexts";
import { Participant } from "@/lib/types";

// Components
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { DatePicker } from "@/components/ui/date-picker";
import * as uiForm from "@/components/ui/form";
import * as uiSelect from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Icons
import { ArrowDown10, ArrowUp10, Plus, Trash } from "lucide-react";
import { usePastParticipants } from "@/hooks/usePastParticipants";

const FormSchema = z
  .object({
    date: z.date(),
    location: z.enum(["albertParkLake"]),
    participants: z.array(
      z.object({
        bib: z.string(),
        name: z.object({ value: z.string(), label: z.string() }),
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

const distanceOptions = [
  { label: "3.5km", value: "3.5" },
  { label: "5km", value: "5" },
];

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
  const { pb } = usePocket();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
    defaultValues: {
      date: initialDate,
      location: "albertParkLake",
      // @ts-ignore
      participants: [{ bib: "1", name: null, distance: distanceOptions[1] }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "participants",
  });

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
    <div className="flex flex-col">
      <uiForm.Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <uiForm.FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <uiForm.FormItem>
                <uiForm.FormLabel>Date</uiForm.FormLabel>
                <uiForm.FormControl>
                  <DatePicker date={field.value} setDate={field.onChange} />
                </uiForm.FormControl>
                <uiForm.FormDescription>
                  Select the date for the run. If you are creating it for today,
                  leave it as is.
                </uiForm.FormDescription>
                <uiForm.FormMessage />
              </uiForm.FormItem>
            )}
          />
          <uiForm.FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <uiForm.FormItem>
                <uiForm.FormLabel>Location</uiForm.FormLabel>
                <uiSelect.Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <uiForm.FormControl>
                    <uiSelect.SelectTrigger>
                      <uiSelect.SelectValue />
                    </uiSelect.SelectTrigger>
                  </uiForm.FormControl>
                  <uiSelect.SelectContent>
                    <uiSelect.SelectItem value="albertParkLake">
                      Albert Park Lake
                    </uiSelect.SelectItem>
                  </uiSelect.SelectContent>
                </uiSelect.Select>
                <uiForm.FormDescription>
                  Select the location for the run from the available options.
                </uiForm.FormDescription>
                <uiForm.FormMessage />
              </uiForm.FormItem>
            )}
          />
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
                <Input
                  type="number"
                  {...form.register(`participants.${index}.bib`)}
                />
                <uiForm.FormField
                  control={form.control}
                  name={`participants.${index}.name`}
                  render={({ field }) => (
                    <CreatableSelect
                      {...field}
                      className="custom-react-select-container"
                      classNamePrefix="custom-react-select"
                      placeholder="Select..."
                      menuPosition="fixed"
                      options={pastParticipants.map((participant) => {
                        return {
                          label: participant.name,
                          value: participant.user_id
                            ? participant.user_id
                            : participant.name,
                        };
                      })}
                    />
                  )}
                />
                <uiForm.FormField
                  control={form.control}
                  name={`participants.${index}.distance`}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className="custom-react-select-container"
                      classNamePrefix="custom-react-select"
                      placeholder="Select..."
                      menuPosition="fixed"
                      options={distanceOptions}
                    />
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
              Submit
            </Button>
          </div>
        </form>
      </uiForm.Form>
    </div>
  );
}
