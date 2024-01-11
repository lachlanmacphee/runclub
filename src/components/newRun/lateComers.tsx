import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { usePocket } from "@/contexts";
import { usePastParticipants } from "@/hooks/usePastParticipants";

import { Participant } from "@/lib/types";
import { distanceOptions } from "@/lib/constants";

import Select from "react-select";
import CreatableSelect from "react-select/creatable";
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
import { Checkbox } from "../ui/checkbox";

const FormSchema = z.object({
  bib: z.string(),
  name: z.object({ value: z.string(), label: z.string() }),
  distance: z.object({ value: z.string(), label: z.string() }),
  isNew: z.boolean(),
  isPaid: z.boolean(),
});

export function LateComers({
  runId,
  participants,
  setParticipants,
}: {
  runId: string;
  participants: Participant[];
  setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
}) {
  const pastParticipants = usePastParticipants();
  const { pb } = usePocket();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
    defaultValues: {
      bib: "",
      // @ts-ignore
      name: null,
      distance: distanceOptions[1],
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
      user_id: data.name.value == data.name.label ? undefined : data.name.value,
      name: data.name.label,
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

  const participantNames: string[] = participants.map(
    (participant) => participant.name
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-xl font-bold">Latecomers</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        >
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
            name="name"
            render={({ field }) => (
              <CreatableSelect
                {...field}
                className="custom-react-select-container"
                classNamePrefix="custom-react-select"
                placeholder="Name"
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
                options={distanceOptions}
              />
            )}
          />

          <FormField
            control={form.control}
            name="isNew"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>New to Gunnies</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isPaid"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Paid $5</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" className="sm:h-full">
            Add
          </Button>
        </form>
      </Form>
    </div>
  );
}
