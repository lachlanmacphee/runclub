import { useEffect, useState } from "react";
import { usePocket } from "@/contexts";
import { GroupRun, Participant } from "@/lib/types";

// Components
import { RunSetup } from "@/components/newRun/runSetup";
import { RunTiming } from "@/components/newRun/runTiming";
import { RunsInProgress } from "@/components/newRun/runsInProgress";

// Icons
import { Loader2 } from "lucide-react";

export function NewRun() {
  const { pb } = usePocket();
  const [isLoading, setIsLoading] = useState(true);
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
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setInProgressRuns(inProgressRuns);
    }
    fetchInProgressRuns();
  }, [pb]);

  if (isLoading)
    return (
      <div className="flex justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );

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
