import { useEffect, useState } from "react";
import { usePocket } from "@/contexts";
import { GroupRun, Participant } from "@/lib/types";

// Components
import { RunDetailsSetup } from "@/components/newRun/runDetailsSetup";
import { RunTiming } from "@/components/newRun/runTiming";
import { RunsInProgress } from "@/components/newRun/runsInProgress";

// Icons
import { Loader2 } from "lucide-react";
import { RunParticipantSetup } from "@/components/newRun/runParticipantSetup";

export function NewRun() {
  const { pb } = usePocket();
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState(-1);
  const [inProgressRuns, setInProgressRuns] = useState<GroupRun[]>([]);
  const [groupRun, setGroupRun] = useState<GroupRun>();
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
        setGroupRun={setGroupRun}
        setParticipants={setParticipants}
      />
    );
  }

  if (step == 0) {
    return <RunDetailsSetup setGroupRun={setGroupRun} setStep={setStep} />;
  }

  if (step == 1 && groupRun) {
    return (
      <RunParticipantSetup
        groupRun={groupRun}
        setStep={setStep}
        setParticipants={setParticipants}
      />
    );
  }

  if (step == 2 && groupRun) {
    return (
      <RunTiming
        participants={participants}
        setParticipants={setParticipants}
      />
    );
  }

  return <p>Something went wrong...</p>;
}
