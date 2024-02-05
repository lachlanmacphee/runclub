import { convertLocationValueToLabel } from "@/lib/utils";

import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { GroupRun, Participant } from "@/lib/types";
import { usePocket } from "@/contexts";
import { Dispatch, SetStateAction } from "react";

export function RunsInProgress({
  inProgressRuns,
  setStep,
  setGroupRun,
  setParticipants,
}: {
  inProgressRuns: GroupRun[];
  setStep: Dispatch<SetStateAction<number>>;
  setGroupRun: Dispatch<SetStateAction<GroupRun | undefined>>;
  setParticipants: Dispatch<SetStateAction<Participant[]>>;
}) {
  const { pb } = usePocket();

  const continueHandler = async (run: GroupRun) => {
    const participants = (await pb.collection("participant_runs").getFullList({
      filter: pb.filter("group_run_id = {:runId}", { runId: run.id }),
      sort: "bib",
    })) as Participant[];

    setParticipants(participants);
    setGroupRun(run);
    setStep(1);
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-5xl font-bold">In Progress Runs</h1>
      <p>Would you like to continue a current run or create a new one?</p>
      {inProgressRuns.map((run) => (
        <Card className="w-[350px]" key={run.id}>
          <CardHeader>
            <CardTitle>{convertLocationValueToLabel(run.location)}</CardTitle>
            <CardDescription>
              {new Date(run.created).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <img
              className="rounded-xl aspect-video"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Albert_park_aerial.jpg/640px-Albert_park_aerial.jpg"
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={() => continueHandler(run)}>Continue</Button>
          </CardFooter>
        </Card>
      ))}
      <Button onClick={() => setStep(0)}>Create New Run</Button>
    </div>
  );
}
