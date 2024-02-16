import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { usePocket } from "@/contexts";
import { useMembers } from "@/hooks/useMembers";

import { Participant } from "@/lib/types";
import { DISTANCE_OPTIONS } from "@/lib/constants";

import Select from "react-select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "../../ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";

const FormSchema = z.object({
  bib: z.string(),
  details: z.object({ value: z.string(), label: z.string() }),
  distance: z.object({ value: z.string(), label: z.string() }),
  isNew: z.boolean(),
  isPaid: z.boolean(),
});

export function Latecomers({
  runId,
  participants,
  setParticipants,
}: {
  runId: string;
  participants: Participant[];
  setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
}) {
  const { members } = useMembers();
  const { pb } = usePocket();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
    defaultValues: {
      bib: "",
      // @ts-ignore
      details: null,
      distance: DISTANCE_OPTIONS[1],
      isNew: false,
      isPaid: true,
    },
  });

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.formState, form.reset]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const currentBibs: number[] = participants.map(
      (participant) => participant.bib
    );

    if (currentBibs.includes(Number(data.bib))) {
      form.setError("bib", {
        type: "custom",
        message: "This bib already exists.",
      });
      return;
    }

    const newParticipant: Participant = {
      group_run_id: runId,
      waiver_id: data.details.value,
      name: data.details.label,
      distance: Number(data.distance.value),
      bib: Number(data.bib),
      is_new: data.isNew,
      is_paid: data.isPaid,
    };

    const res = (await pb
      .collection("participant_runs")
      .create(newParticipant)) as Participant;
    setParticipants([...participants, res]);
  }

  const addedParticipants: string[] = participants.map(
    (participant) => participant.waiver_id
  );

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
      <div className="flex items-center justify-between space-x-4">
        <h4 className="text-sm font-semibold">Latecomers</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        <div className="flex flex-col">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 gap-4"
            >
              <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                  <Select
                    {...field}
                    className="custom-react-select-container"
                    classNamePrefix="custom-react-select"
                    placeholder="Name"
                    options={members
                      .filter(
                        (member) =>
                          !addedParticipants.includes(member.waiver_id)
                      )
                      .map((member) => {
                        return {
                          label: member.name,
                          value: member.waiver_id,
                        };
                      })}
                  />
                )}
              />
              <div className="flex gap-x-4">
                <FormField
                  control={form.control}
                  name="isNew"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>New to Gunnies</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isPaid"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Paid $5</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="bib"
                render={({ field }) => (
                  <FormItem>
                    <Input {...field} placeholder="Bib" />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="distance"
                render={({ field }) => (
                  <Select
                    {...field}
                    className="custom-react-select-container"
                    classNamePrefix="custom-react-select"
                    placeholder="Select..."
                    options={DISTANCE_OPTIONS}
                  />
                )}
              />
              <Button type="submit" className="sm:h-full">
                Add
              </Button>
            </form>
          </Form>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
