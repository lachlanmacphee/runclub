import { useEffect, useState } from "react";
import { usePocket } from "@/contexts";
import { GroupRun, Participant } from "@/lib/types";

// Components
import { RunSetup } from "@/components/newRun/runSetup";
import { RunTiming } from "@/components/newRun/runTiming";

export function NewRun() {
  const { pb } = usePocket();
  const [step, setStep] = useState(0);
  const [inProgressRuns, setInProgressRuns] = useState<GroupRun[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    async function fetchInProgressRuns() {
      const res = (await pb.collection("group_runs").getFullList({
        filter: "isComplete = false",
      })) as GroupRun[];

      setInProgressRuns(res);
    }
    fetchInProgressRuns();
  }, [pb]);

  if (inProgressRuns.length > 0) {
    return (
      <div>
        There are runs in progress. Would you like to continue one of them or
        start a new run?
      </div>
    );
  }

  switch (step) {
    case 0:
      return <RunSetup setStep={setStep} setParticipants={setParticipants} />;
    case 1:
      return <RunTiming participants={participants} />;
  }
}
