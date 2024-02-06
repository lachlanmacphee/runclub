import { usePocket } from "@/contexts";
import { Member, Participant, Waiver } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

export function useMembers() {
  const { pb } = usePocket();
  const [members, setMembers] = useState<Member[]>([]);

  const fetchMembers = useCallback(async () => {
    const uniqueMembers: Record<string, Member> = {};

    // Particiants from the last 90 days count as members for now
    const date = new Date();
    date.setDate(date.getDate() - 90);
    const participantRes = (await pb
      .collection("participant_runs")
      .getFullList({
        filter: pb.filter("created > {:date}", { date }),
      })) as Participant[];
    for (const participant of participantRes) {
      uniqueMembers[participant.name] = {
        name: participant.name,
        user_id: participant?.user_id,
      };
    }

    // People that have signed the waiver count as members
    const waiverRes = (await pb
      .collection("waivers")
      .getFullList()) as Waiver[];
    for (const waiver of waiverRes) {
      const combinedName = waiver.fname + " " + waiver.lname;
      uniqueMembers[combinedName] = {
        name: combinedName,
        user_id: undefined,
      };
    }

    const sortedMembers = Object.values(uniqueMembers).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    setMembers(sortedMembers);
  }, [pb]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const refreshMembers = useCallback(async () => {
    await fetchMembers();
  }, [fetchMembers]);

  return { members, refreshMembers };
}
