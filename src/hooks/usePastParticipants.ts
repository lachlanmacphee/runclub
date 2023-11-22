import { usePocket } from "@/contexts";
import { Participant } from "@/lib/types";
import { useEffect, useState } from "react";

export function usePastParticipants() {
  const { pb } = usePocket();
  const [pastParticipants, setPastParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    async function fetchPastParticipants() {
      const date = new Date();
      date.setDate(date.getDate() - 30);
      const res = (await pb.collection("participant_runs").getFullList({
        filter: pb.filter("created > {:date}", { date }),
      })) as Participant[];
      const uniqueObjMap: Record<string, Participant> = {};
      for (const object of res) {
        uniqueObjMap[object.name] = object;
      }
      setPastParticipants(Object.values(uniqueObjMap));
    }
    fetchPastParticipants();
  }, [pb]);

  return pastParticipants;
}
