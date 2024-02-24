import { useEffect, useState } from "react";

import { usePocket } from "@/contexts";

import { Participant } from "@/lib/types";

import { RunTable } from "@/components/runs/runTable";

import { Loader2 } from "lucide-react";

export function ClubStats() {
  const { pb } = usePocket();
  const [isLoading, setIsLoading] = useState(true);
  const [threeKmParticipants, setThreeKmParticipants] = useState<Participant[]>(
    []
  );
  const [fiveKmParticipants, setFiveKmParticipants] = useState<Participant[]>(
    []
  );

  useEffect(() => {
    async function fetchLeaderboard() {
      setIsLoading(true);
      setThreeKmParticipants([]);
      setFiveKmParticipants([]);

      const { items: fiveKmParticipants } = await pb
        .collection("participant_runs")
        .getList<Participant>(1, 10, {
          sort: "time_seconds",
          filter: pb.filter("distance = 5"),
        });

      const { items: threeKmParticipants } = await pb
        .collection("participant_runs")
        .getList<Participant>(1, 10, {
          sort: "time_seconds",
          filter: pb.filter("distance = 3.5"),
        });

      threeKmParticipants.forEach(
        (participant, index) => (participant.position = index + 1)
      );

      fiveKmParticipants.forEach(
        (participant, index) => (participant.position = index + 1)
      );

      setThreeKmParticipants(threeKmParticipants);
      setFiveKmParticipants(fiveKmParticipants);
      setIsLoading(false);
    }
    fetchLeaderboard();
  }, [pb]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-5xl font-bold">Club Stats</h1>
      {isLoading ? (
        <div className="flex justify-center">
          <Loader2 className="h-12 w-12 animate-spin" />
        </div>
      ) : (
        <>
          <h2 className="text-xl font-bold">Top 10 5km</h2>
          <RunTable participants={fiveKmParticipants} />
          <h2 className="text-xl font-bold">Top 10 3.5km</h2>
          <RunTable participants={threeKmParticipants} />
        </>
      )}
    </div>
  );
}
