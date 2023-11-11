import { RunTable } from "@/components/runTable";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { usePocket } from "@/contexts";
import { GroupRun, Participant } from "@/types";
import { convertLocationValueToLabel, formatDateWithSuffix } from "@/utils";
import { useEffect, useState } from "react";

const initialDate = new Date();
initialDate.setHours(0, 0, 0, 0);

export function PastRuns() {
  const { pb } = usePocket();
  const [date, setDate] = useState<Date>(initialDate);
  const [runner, setRunner] = useState<string>("");
  const [runDescription, setRunDescription] = useState<string>("");
  const [runLocation, setRunLocation] = useState<string>("");
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    async function fetchRunFromDate() {
      // Might be able to make this query more specific with filters
      const recentRuns: GroupRun[] = await pb
        .collection("group_runs")
        .getFullList();

      // From the recent runs, find the latest and get its id
      const runFromDate: GroupRun | undefined = recentRuns.find(
        (run) =>
          run.date.substring(0, 10) === date.toISOString().substring(0, 10)
      );

      if (!runFromDate) {
        setRunLocation("");
        setRunDescription("");
        setParticipants([]);
        return;
      }

      const runFromDateId = runFromDate.id;

      // Find all the participants that were part of that run and set the state
      const participants: Participant[] = await pb
        .collection("participant_runs")
        .getFullList({
          filter: pb.filter("group_run_id = {:runFromDateId}", {
            runFromDateId,
          }),
        });
      participants.sort(
        (a, b) => (a.time_seconds ?? 0) - (b.time_seconds ?? 0)
      );
      setParticipants(participants);

      // Generate and set the run description
      setRunDescription(
        `On ${new Date(runFromDate.date).toLocaleDateString()}, ${
          participants.length
        } Gunnies hit the track at ${convertLocationValueToLabel(
          runFromDate.location
        )}. Congratulations to ${
          participants[0].name
        } for the fastest time, and all other Gunnies who attended.`
      );
    }
    fetchRunFromDate();
  }, [pb, date]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:gap-0 md:grid-cols-[0.5fr_1fr_0.5fr]">
        <div className="row-start-2 md:row-start-1">
          <DatePicker date={date} setDate={setDate} />
        </div>
        <div className="flex flex-col items-center text-center">
          <h1 className="text-xl font-bold">
            {date && formatDateWithSuffix(date)}
          </h1>
          <h2>{runLocation}</h2>
        </div>
        <Input
          name="runner"
          type="text"
          value={runner}
          onChange={(e) => setRunner(e.target.value)}
          placeholder="Runner"
          className="justify-self-end"
        />
      </div>
      <p>{runDescription}</p>
      <RunTable participants={participants} runner={runner} />
    </div>
  );
}
