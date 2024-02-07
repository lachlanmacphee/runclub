import { usePocket } from "@/contexts";
import { Member, Waiver } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

export function useMembers() {
  const { pb } = usePocket();
  const [members, setMembers] = useState<Member[]>([]);

  const fetchMembers = useCallback(async () => {
    const uniqueMembers: Record<string, Member> = {};

    const waiverRes = (await pb
      .collection("waivers")
      .getFullList()) as Waiver[];

    for (const waiver of waiverRes) {
      const combinedName = waiver.fname + " " + waiver.lname;
      uniqueMembers[combinedName] = {
        waiver_id: waiver.id,
        name: combinedName,
        user_id: waiver?.user_id,
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
