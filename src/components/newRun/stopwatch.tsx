import { Button } from "../ui/button";

type StopwatchProps = {
  start: VoidFunction;
  hours: number;
  minutes: number;
  seconds: number;
  isRunning: boolean;
  isRunComplete: boolean;
};

export function Stopwatch({
  start,
  hours,
  minutes,
  seconds,
  isRunning,
  isRunComplete,
}: StopwatchProps) {
  const fHours = hours.toString().padStart(2, "0");
  const fMins = minutes.toString().padStart(2, "0");
  const fSecs = seconds.toString().padStart(2, "0");

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="font-extrabold text-5xl">{`${fHours}:${fMins}:${fSecs}`}</h1>
      {!isRunning && !isRunComplete && (
        <div className="text-center space-y-2">
          <Button onClick={start}>Start The Run</Button>
          <p>
            Once you click this button, you wont be able to add any more
            latecomers.
          </p>
        </div>
      )}
    </div>
  );
}
