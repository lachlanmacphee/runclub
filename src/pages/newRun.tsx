import { useEffect, useState } from "react";
import { usePocket } from "@/contexts";
import { GroupRun, Participant } from "@/lib/types";

// Components
import { RunSetup } from "@/components/newRun/runSetup";
import { RunTiming } from "@/components/newRun/runTiming";
import { RunsInProgress } from "@/components/newRun/runsInProgress";

export function NewRun() {
  const { pb } = usePocket();
  const [step, setStep] = useState(-1);
  const [inProgressRuns, setInProgressRuns] = useState<GroupRun[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    async function fetchInProgressRuns() {
      const inProgressRuns = (await pb.collection("group_runs").getFullList({
        filter: "isComplete = false",
      })) as GroupRun[];

      if (inProgressRuns.length == 0) {
        setStep(0);
        return;
      }

      setInProgressRuns(inProgressRuns);
    }
    fetchInProgressRuns();
  }, [pb]);

  if (inProgressRuns.length > 0 && step == -1) {
    return (
      <RunsInProgress
        inProgressRuns={inProgressRuns}
        setStep={setStep}
        setParticipants={setParticipants}
      />
    );
  }

  switch (step) {
    case 0:
      return <RunSetup setStep={setStep} setParticipants={setParticipants} />;
    case 1:
      return (
        <RunTiming
          participants={participants}
          setParticipants={setParticipants}
        />
      );
  }
}
