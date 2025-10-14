import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

import { usePocket } from "@/contexts";
import { useMembers } from "@/hooks/useMembers";

import { COLLECTIONS, DISTANCE_OPTIONS } from "@/lib/constants";
import { Participant } from "@/lib/types";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import Select from "react-select";

const FormSchema = z.object({
  details: z.object({ value: z.string(), label: z.string() }),
  hours: z.string().min(1, { message: "Hours is required" }),
  minutes: z.string().min(1, { message: "Minutes is required" }),
  seconds: z.string().min(1, { message: "Seconds is required" }),
  distance: z.object({ value: z.string(), label: z.string() }),
});

function convertStrDistanceToNumber(distance: string) {
  if (distance === "3.5") return 3.5;
  if (distance === "5") return 5;
  return 5;
}

export function AddParticipant({
  runId,
  participants,
}: {
  runId: string;
  participants: Participant[] | undefined;
}) {
  const { members } = useMembers();
  const { pb } = usePocket();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
    defaultValues: {
      // @ts-ignore
      details: null,
      hours: "0",
      minutes: "0",
      seconds: "0",
      distance: DISTANCE_OPTIONS[1],
    },
  });

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.formState.isSubmitSuccessful]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const timeInSeconds =
        parseInt(data.hours) * 3600 +
        parseInt(data.minutes) * 60 +
        parseInt(data.seconds);

      const newParticipant: Participant = {
        group_run_id: runId,
        waiver_id: data.details.value,
        name: data.details.label,
        distance: convertStrDistanceToNumber(data.distance.value),
        bib: 0, // You may want to handle bib assignment differently
        is_new: false,
        is_paid: true,
        time_seconds: timeInSeconds,
      };

      await pb.collection(COLLECTIONS.PARTICIPANT_RUNS).create(newParticipant);

      toast({
        title: "Success!",
        description: `${data.details.label} has been added to the run.`,
      });

      // Redirect to runs page
      navigate("/runs");
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong while adding the participant.",
        variant: "destructive",
      });
    }
  }

  if (!participants) {
    return <p>Failed to get participants for this run...</p>;
  }

  const addedParticipants: string[] = participants.map(
    (participant) => participant.waiver_id
  );

  const selectedParticipant = form.watch("details");

  return (
    <div className="flex flex-col gap-4 grow max-w-3xl">
      <h1 className="text-5xl font-bold">Add Participant</h1>
      <h2>Choose a Gunnies member to add them to the group run</h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    {...field}
                    className="custom-react-select-container"
                    classNamePrefix="custom-react-select"
                    placeholder="Select a participant..."
                    options={members
                      .filter(
                        (member) =>
                          !addedParticipants.includes(member.waiver_id)
                      )
                      .map((member) => ({
                        label: member.name,
                        value: member.waiver_id,
                      }))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedParticipant && (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Hours</Label>
                  <FormField
                    control={form.control}
                    name="hours"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <Label>Minutes</Label>
                  <FormField
                    control={form.control}
                    name="minutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <Label>Seconds</Label>
                  <FormField
                    control={form.control}
                    name="seconds"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="distance"
                render={({ field }) => (
                  <Select
                    {...field}
                    className="custom-react-select-container"
                    classNamePrefix="custom-react-select"
                    placeholder="Select distance..."
                    isSearchable={false}
                    options={DISTANCE_OPTIONS}
                  />
                )}
              />

              <Button type="submit" className="w-full">
                Add Participant
              </Button>
            </>
          )}
        </form>
      </Form>
    </div>
  );
}
