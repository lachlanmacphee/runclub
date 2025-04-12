import { usePocket } from "@/contexts";
import { Member, Waiver } from "@/lib/types";
import { RecordModel, RecordSubscription } from "pocketbase";
import { useCallback, useEffect, useState } from "react";

export function useMembers() {
  const { pb } = usePocket();
  const [members, setMembers] = useState<Member[]>([]);

  const fetchMembers = useCallback(async () => {
    const waiverRes = (await pb
      .collection("waivers")
      .getFullList({ fields: "id,fname,lname,alias,user_id" })) as Waiver[];

    const uniqueMembers = waiverRes.map((waiver) => {
      const combinedName = waiver.alias
        ? waiver.alias
        : waiver.fname + " " + waiver.lname;
      return {
        waiver_id: waiver.id,
        name: combinedName,
        user_id: waiver?.user_id,
      };
    });

    const sortedMembers = uniqueMembers.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    setMembers(sortedMembers);
  }, [pb]);

  const addWaiver = useCallback((event: RecordSubscription<RecordModel>) => {
    if (event.action == "create") {
      const waiver = event.record as unknown as Waiver;
      const combinedName = waiver.alias
        ? waiver.alias
        : waiver.fname + " " + waiver.lname;
      const addedMember: Member = {
        waiver_id: waiver.id,
        name: combinedName,
        user_id: waiver?.user_id,
      };
      setMembers((currentMembers) => [...currentMembers, addedMember]);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
    pb.collection("waivers").subscribe("*", addWaiver);
    return () => {
      pb.collection("waivers").unsubscribe("*");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { members };
}
