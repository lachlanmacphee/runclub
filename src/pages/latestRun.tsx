import { RunTable } from "@/components/runTable";
import { usePocket } from "@/contexts";
import { GroupRun, Participant } from "@/lib/types";
import { convertLocationValueToLabel } from "@/lib/utils";
import { useEffect, useState } from "react";

export function LatestRun() {
  const { pb } = usePocket();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [runDescription, setRunDescription] = useState<string>("");

  useEffect(() => {
    async function fetchLatestRun() {
      // Might be able to make this query more specific with filters
      const recentRuns: GroupRun[] = await pb
        .collection("group_runs")
        .getFullList();

      // From the recent runs, find the latest and get its id
      const latestRun: GroupRun = recentRuns.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0];
      const latestRunId = latestRun.id;

      // Find all the participants that were part of that run and set the state
      const participants: Participant[] = await pb
        .collection("participant_runs")
        .getFullList({
          filter: pb.filter("group_run_id = {:latestRunId}", { latestRunId }),
        });
      participants.sort(
        (a, b) => (a.time_seconds ?? 0) - (b.time_seconds ?? 0)
      );
      setParticipants(participants);

      // Generate and set the run description
      setRunDescription(
        `On ${new Date(latestRun.date).toLocaleDateString()}, ${
          participants.length
        } Gunnies hit the track at ${convertLocationValueToLabel(
          latestRun.location
        )}. Congratulations to ${
          participants[0].name
        } for the fastest time, and all other Gunnies who attended.`
      );
    }
    fetchLatestRun();
  }, [pb]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-5xl font-bold">Latest Run</h1>
        <p className="py-6">{runDescription}</p>
      </div>
      <RunTable participants={participants} />
    </div>
  );
}
