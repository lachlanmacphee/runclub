import { useStopwatch } from "react-timer-hook";
import { Stopwatch } from "../stopwatch";
import { Button } from "../ui/button";
import { Participant } from "@/types";

export function RunTiming({ participants }: { participants: Participant[] }) {
  const { start, hours, minutes, seconds, isRunning } = useStopwatch();

  console.log("participants :>> ", participants);

  return (
    <div className="flex flex-col gap-8">
      <Stopwatch
        start={start}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
        isRunning={isRunning}
      />
      <div className="flex gap-4">
        {participants.map((participant) => (
          <Button key={participant.bib} size="lg">
            {participant.bib}
          </Button>
        ))}
      </div>
    </div>
  );
}
