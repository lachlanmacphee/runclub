import { useEffect, useState } from "react";

import { usePocket } from "@/contexts";

import { Participant } from "@/lib/types";

import { RunTable } from "@/components/runs/runTable";

import { Loader2 } from "lucide-react";

export function ClubStats() {
  const { pb } = usePocket();
  const [isLoading, setIsLoading] = useState(true);
  const [clubStats, setClubStats] = useState<{
    male5k: Participant[];
    female5k: Participant[];
    male3k: Participant[];
    female3k: Participant[];
  } | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      setIsLoading(true);

      const male5k = await pb
        .collection("top_10_male_5k")
        .getFullList<Participant>();

      const female5k = await pb
        .collection("top_10_female_5k")
        .getFullList<Participant>();

      const male3k = await pb
        .collection("top_10_male_3k")
        .getFullList<Participant>();

      const female3k = await pb
        .collection("top_10_female_3k")
        .getFullList<Participant>();

      male5k.forEach(
        (participant, index) => (participant.position = index + 1)
      );

      female5k.forEach(
        (participant, index) => (participant.position = index + 1)
      );

      male3k.forEach(
        (participant, index) => (participant.position = index + 1)
      );

      female3k.forEach(
        (participant, index) => (participant.position = index + 1)
      );

      setClubStats({ male5k, female5k, male3k, female3k });
      setIsLoading(false);
    }
    fetchLeaderboard();
  }, [pb]);

  if (isLoading)
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-5xl font-bold">Club Stats</h1>
        <div className="flex justify-center">
          <Loader2 className="h-12 w-12 animate-spin" />
        </div>
      </div>
    );

  if (!clubStats)
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-5xl font-bold">Club Stats</h1>
        <h2 className="text-xl font-bold">Top 10 Male 5km</h2>
        <RunTable participants={[]} />
        <h2 className="text-xl font-bold">Top 10 Female 5km</h2>
        <RunTable participants={[]} />
        <h2 className="text-xl font-bold">Top 10 Male 3.5km</h2>
        <RunTable participants={[]} />
        <h2 className="text-xl font-bold">Top 10 Female 3.5km</h2>
        <RunTable participants={[]} />
      </div>
    );

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-5xl font-bold">Club Stats</h1>
      <h2 className="text-xl font-bold">Top 10 Male 5km</h2>
      <RunTable participants={clubStats.male5k} />
      <h2 className="text-xl font-bold">Top 10 Female 5km</h2>
      <RunTable participants={clubStats.female5k} />
      <h2 className="text-xl font-bold">Top 10 Male 3.5km</h2>
      <RunTable participants={clubStats.male3k} />
      <h2 className="text-xl font-bold">Top 10 Female 3.5km</h2>
      <RunTable participants={clubStats.female3k} />
    </div>
  );
}
