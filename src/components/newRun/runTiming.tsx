import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStopwatch } from "react-timer-hook";
import { usePocket } from "@/contexts";
import { convertTimesToSeconds } from "@/lib/utils";
import { Participant } from "@/lib/types";

import { toast } from "@/components/ui/use-toast";
import { Stopwatch } from "@/components/newRun/stopwatch";
import { Button } from "@/components/ui/button";
import { LateComers } from "./lateComers";
import { Textarea } from "../ui/textarea";

export function RunTiming({
  participants,
  setParticipants,
}: {
  participants: Participant[];
  setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
}) {
  const { pb } = usePocket();
  const runId = participants[0].group_run_id;
  const { start, pause, hours, minutes, seconds, isRunning } = useStopwatch();
  const navigate = useNavigate();

  const [completed, setCompleted] = useState<Record<number, boolean>>({});

  const isRunComplete =
    Object.keys(completed).length === participants.length &&
    Object.values(completed).every(Boolean);

  const newParticipants = participants.filter(
    (participant) => participant.is_new
  );

  useEffect(() => {
    async function markRunComplete() {
      await pb.collection("group_runs").update(runId, { isComplete: true });
      pause();
      toast({
        title: "Run Complete!",
        description:
          "All participants have crossed the finish line! Please screenshot your notes if necessary. Redirecting to the results page in 15 seconds...",
      });
      setTimeout(() => {
        navigate("/runs");
      }, 15000);
    }
    if (isRunComplete) {
      markRunComplete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completed]);

  const markParticipant = async (bib: number) => {
    const participant = participants.find((p) => p.bib === bib);

    if (!participant || !participant.id) {
      toast({
        title: "Participant Not Found",
        description:
          "We couldn't find that participant or they do not have an id.",
        variant: "destructive",
      });
      return;
    }

    if (completed[bib]) {
      await pb
        .collection("participant_runs")
        .update(participant?.id, { time_seconds: 0 });
      setCompleted({ ...completed, [bib]: false });
      return;
    }

    const time = convertTimesToSeconds(hours, minutes, seconds);
    await pb
      .collection("participant_runs")
      .update(participant?.id, { time_seconds: time });

    setCompleted({ ...completed, [bib]: true });
  };

  return (
    <div className="flex flex-col gap-8">
      <Stopwatch
        start={start}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
        isRunning={isRunning}
        isRunComplete={isRunComplete}
      />
      {!isRunning && !isRunComplete && newParticipants.length > 0 && (
        <div className="text-center">
          <h2 className="font-bold text-xl">New Gunnies</h2>
          {newParticipants.map((participant) => (
            <p key={participant.name}>{participant.name}</p>
          ))}
        </div>
      )}
      {isRunning && (
        <div className="flex gap-4 justify-around flex-wrap">
          {participants.map((participant) => (
            <Button
              onClick={() => markParticipant(participant.bib)}
              key={participant.bib}
              className="md:w-24 md:h-16 font-bold text-xl"
              variant={completed[participant.bib] ? "secondary" : "default"}
              disabled={!isRunning}
            >
              {participant.bib}
            </Button>
          ))}
        </div>
      )}
      {!isRunning && !isRunComplete && (
        <div className="flex justify-center">
          <LateComers
            runId={runId}
            participants={participants}
            setParticipants={setParticipants}
          />
        </div>
      )}
      <div className="flex justify-center">
        <Textarea
          className="w-3/4 md:w-1/2 h-[192px]"
          placeholder="You can write notes for the run here, but they will disappear once the run finishes."
        />
      </div>
    </div>
  );
}
