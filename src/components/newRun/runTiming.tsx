import { useStopwatch } from "react-timer-hook";
import { Stopwatch } from "../stopwatch";
import { Button } from "@/components/ui/button";
import { Participant } from "@/types";
import { useEffect, useState } from "react";
import { usePocket } from "@/contexts";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

function convertTimesToSeconds(
  hours: number,
  minutes: number,
  seconds: number
) {
  return seconds + minutes * 60 + hours * 3600;
}

export function RunTiming({ participants }: { participants: Participant[] }) {
  const { start, pause, hours, minutes, seconds, isRunning } = useStopwatch();
  const navigate = useNavigate();
  const [completed, setCompleted] = useState<Record<number, boolean>>({});
  const { pb } = usePocket();

  useEffect(() => {
    if (Object.keys(completed).length === participants.length) {
      if (Object.values(completed).every(Boolean)) {
        pause();
        navigate("/latestrun");
      }
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
