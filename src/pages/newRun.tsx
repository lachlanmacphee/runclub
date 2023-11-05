import { useStopwatch } from "react-timer-hook";
import { Stopwatch } from "@/components/stopwatch";

export function NewRun() {
  const { start, hours, minutes, seconds } = useStopwatch();
  return (
    <Stopwatch
      start={start}
      hours={hours}
      minutes={minutes}
      seconds={seconds}
    />
  );
}
