import { Button } from "./ui/button";

type StopwatchProps = {
  start: VoidFunction;
  hours: number;
  minutes: number;
  seconds: number;
};

// Example Usage
// const { start, hours, minutes, seconds } = useStopwatch();

// return (
//   <Stopwatch
//     start={start}
//     hours={hours}
//     minutes={minutes}
//     seconds={seconds}
//   />
// );

export function Stopwatch({ start, hours, minutes, seconds }: StopwatchProps) {
  const fHours = hours.toString().padStart(2, "0");
  const fMins = minutes.toString().padStart(2, "0");
  const fSecs = seconds.toString().padStart(2, "0");

  return (
    <div>
      <span>{`${fHours}:${fMins}:${fSecs}`}</span>
      <div>
        <Button onClick={start}>Start</Button>
      </div>
    </div>
  );
}
