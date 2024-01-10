import { useEffect, useState } from "react";

import { usePocket } from "@/contexts";

import { Participant } from "@/lib/types";

import { RunTable } from "@/components/runs/runTable";

import { Loader2 } from "lucide-react";

export function Leaderboard() {
  const { pb } = usePocket();
  const [isLoading, setIsLoading] = useState(true);
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    async function fetchLeaderboard() {
      setIsLoading(true);
      setParticipants([]);

      const { items: fiveKmParticipants } = await pb
        .collection("participant_runs")
        .getList<Participant>(1, 10, {
          sort: "time_seconds",
          filter: pb.filter("distance = {:distance}", { distance: 5 }),
        });

      const { items: threePointFiveKmParticipants } = await pb
        .collection("participant_runs")
        .getList<Participant>(1, 10, {
          sort: "time_seconds",
          filter: pb.filter("distance = {:distance}", { distance: 3.5 }),
        });

      const participants: Participant[] = [
        ...threePointFiveKmParticipants,
        ...fiveKmParticipants,
      ];

      participants
        .sort((a, b) => b.distance - a.distance)
        .forEach((participant, index) => (participant.position = index + 1));

      setParticipants(participants);
      setIsLoading(false);
    }
    fetchLeaderboard();
  }, [pb]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-5xl font-bold">Leaderboard</h1>
      <h2>Top 10 3.5km and Top 10 5km Runs since 21st November 2023</h2>
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
