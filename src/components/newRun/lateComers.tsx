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
import * as uiForm from "@/components/ui/form";

const FormSchema = z.object({
  bib: z.string(),
  name: z.object({ value: z.string(), label: z.string() }),
  distance: z.object({ value: z.string(), label: z.string() }),
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
    },
  });

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.formState, form.reset]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const newParticipant: Participant = {
      group_run_id: runId,
      user_id: data.name.value == data.name.label ? undefined : data.name.value,
      name: data.name.label,
      distance: Number(data.distance.value),
      bib: Number(data.bib),
    };
    const res = (await pb
      .collection("participant_runs")
      .create(newParticipant)) as Participant;
    setParticipants([...participants, res]);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-bold">Latecomers</h2>
      <uiForm.Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col md:flex-row gap-4"
        >
          <Input placeholder="Bib" {...form.register(`bib`)} />
          <uiForm.FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <CreatableSelect
                {...field}
                className="custom-react-select-container"
                classNamePrefix="custom-react-select"
                placeholder="Name"
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
          <Button type="submit">Add</Button>
        </form>
      </uiForm.Form>
    </div>
  );
}
