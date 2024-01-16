import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import { Checkbox } from "../ui/checkbox";

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
  );

const localStorageKey = "participants";
const initialDate = new Date();
initialDate.setHours(0, 0, 0, 0);

export function RunSetup({
  setStep,
  setParticipants,
}: {
  setStep: Dispatch<SetStateAction<number>>;
  setParticipants: Dispatch<SetStateAction<Participant[]>>;
}) {
  const { pb } = usePocket();
  const pastParticipants = usePastParticipants();

  const [order, setOrder] = useState<number>(-1);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const [partBib, setPartBib] = useState<string>("100");
  const [partName, setPartName] = useState<{
    value: string;
    label: string;
  } | null>();
  const [partDist, setPartDist] = useState<{
    value: string;
    label: string;
  } | null>(distanceOptions[1]);
  const [partIsNew, setPartIsNew] = useState<boolean>(false);
  const [partIsPaid, setPartIsPaid] = useState<boolean>(true);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
    defaultValues: {
      date: initialDate,
      location: "albertParkLake",
      participants: JSON.parse(localStorage.getItem(localStorageKey) ?? "[]"),
    },
  });

  const { fields, prepend, remove } = useFieldArray({
    control: form.control,
    name: "participants",
  });

  useEffect(() => {
    const subscription = form.watch((data) =>
      localStorage.setItem("participants", JSON.stringify(data.participants))
    );
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch]);

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
        is_new: participant.isNew,
        is_paid: participant.isPaid,
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
      description: "Moving to timing page...",
    });
  }

  const participants = form.getValues("participants");
  const participantNames: string[] = participants.map(
    (participant) => participant.name?.label
  );
  const participantsLength = participants.length;

  function addParticipant() {
    if (partBib && partName && partDist) {
      prepend(
        {
          bib: partBib,
          name: partName,
          distance: partDist,
          isNew: partIsNew,
          isPaid: partIsPaid,
        },
        {
          shouldFocus: false,
        }
      );
      setPartBib(
        order == 1
          ? String(parseInt(partBib) + 1)
          : String(parseInt(partBib) - 1)
      );
      setPartName(null);
      setPartDist(distanceOptions[1]);
      setPartIsNew(false);
      setPartIsPaid(true);
    }
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
          className="space-y-8"
        >
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <DatePicker date={field.value} setDate={field.onChange} />
                  </FormControl>
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <div>
              <Label>Bib</Label>
              <Input
                value={partBib}
                onChange={(e) => setPartBib(e.target.value)}
              />
            </div>
            <div>
              <Label>Name</Label>
              <CreatableSelect
                className="custom-react-select-container"
                classNamePrefix="custom-react-select"
                placeholder="Select..."
                value={partName}
                onChange={(newName) => setPartName(newName)}
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
                value={partDist}
                onChange={(newDistance) => setPartDist(newDistance)}
                options={distanceOptions}
              />
            </div>
            <div className="flex gap-x-4 py-2">
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
            <div className="flex justify-between">
              <div className="flex items-center space-x-2">
                <ArrowDown10 />
                <Switch
                  id="order"
                  onCheckedChange={(val) => setOrder(val ? 1 : -1)}
                />
                <ArrowUp10 />
              </div>
              <Button type="button" onClick={addParticipant}>
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
                <div className="flex justify-center">
                  <Button
                    onClick={() => remove(index)}
                    variant="destructive"
                    size="icon"
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
              Create Run
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
