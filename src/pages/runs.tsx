import { useEffect, useState } from "react";

import { usePocket } from "@/contexts";

import { convertLocationValueToLabel, formatDateWithSuffix } from "@/lib/utils";
import { GroupRun, Participant } from "@/lib/types";

import { RunTable } from "@/components/runTable";
import { DatePicker } from "@/components/ui/date-picker";

import { Loader2 } from "lucide-react";

export function Runs() {
  const { pb } = usePocket();
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<Date | null>(null);
  const [runDescription, setRunDescription] = useState<string>("");
  const [runLocation, setRunLocation] = useState<string>("");
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    async function fetchRunFromDate() {
      setIsLoading(true);
      setRunLocation("");
      setRunDescription("");
      setParticipants([]);

      // Might be able to make this query more specific with filters
      const recentRuns: GroupRun[] = await pb
        .collection("group_runs")
        .getFullList();

      if (recentRuns.length == 0) {
        setIsLoading(false);
        return;
      }

      let runFromDate: GroupRun | undefined;

      if (!date) {
        // If the page is just opening, set to the most recent run
        runFromDate = recentRuns.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];
        setDate(new Date(runFromDate.date));
      } else {
        // Otherwise grab the run from the chosen date
        runFromDate = recentRuns.find(
          (run) =>
            run.date.substring(0, 10) === date.toISOString().substring(0, 10)
        );
      }

      if (!runFromDate) {
        setIsLoading(false);
        return;
      }

      const runLocation = convertLocationValueToLabel(runFromDate.location);
      setRunLocation(runLocation ?? "Location Unknown");
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
      participants.forEach(
        (participant, index) => (participant.position = index + 1)
      );
      setParticipants(participants);

      // Generate and set the run description
      setRunDescription(
        `This week we had ${
          participants.length
        } Gunnies hit the track at ${convertLocationValueToLabel(
          runFromDate.location
        )}. Congratulations to all participants, including ${
          participants.find((participant) => participant.distance == 5)?.name
        } for the fastest time in the 5km, and ${
          participants.find((participant) => participant.distance == 3.5)?.name
        } for the fastest time in the 3.5km.`
      );

      setIsLoading(false);
    }
    fetchRunFromDate();
  }, [pb, date]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:gap-0 md:grid-cols-[0.5fr_1fr]">
        <div className="row-start-2 md:row-start-1">
          <DatePicker date={date} setDate={setDate} />
        </div>
        <div className="flex flex-col items-center md:items-end justify-center ">
          <h1 className="text-xl font-bold">
            {date && formatDateWithSuffix(date)}
          </h1>
          <h2>{runLocation}</h2>
        </div>
      </div>
      <p>{runDescription}</p>
      {isLoading ? (
        <div className="flex justify-center">
          <Loader2 className="h-12 w-12 animate-spin" />
        </div>
      ) : (
        <RunTable participants={participants} />
      )}
    </div>
  );
}
