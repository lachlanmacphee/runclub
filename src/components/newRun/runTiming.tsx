import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStopwatch } from "react-timer-hook";
import { usePocket } from "@/contexts";
import { convertTimesToSeconds } from "@/lib/utils";
import { Participant } from "@/lib/types";

import { toast } from "@/components/ui/use-toast";
import { Stopwatch } from "@/components/stopwatch";
import { Button } from "@/components/ui/button";

export function RunTiming({ participants }: { participants: Participant[] }) {
  const { pb } = usePocket();
  const { start, pause, hours, minutes, seconds, isRunning } = useStopwatch();
  const navigate = useNavigate();

  const [completed, setCompleted] = useState<Record<number, boolean>>({});

  const isRunComplete =
    Object.keys(completed).length === participants.length &&
    Object.values(completed).every(Boolean);

  useEffect(() => {
    if (isRunComplete) {
      pause();
      toast({
        title: "Run Complete!",
        description:
          "All participants have crossed the finish line! Redirecting in 5 seconds...",
      });
      setTimeout(() => {
        navigate("/latestrun");
      }, 5000);
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
        isRunComplete={
          Object.keys(completed).length === participants.length &&
          Object.values(completed).every(Boolean)
        }
      />
      <div className="flex gap-4 justify-center">
        {participants.map((participant) => (
          <Button
            onClick={() => markParticipant(participant.bib)}
            key={participant.bib}
            size="lg"
            variant={completed[participant.bib] ? "secondary" : "default"}
            disabled={!isRunning}
          >
            {participant.bib}
          </Button>
        ))}
      </div>
    </div>
  );
}
