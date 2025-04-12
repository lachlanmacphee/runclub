import { usePocket } from "@/contexts";
import type { User } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";
import { DemoteAdminAlertDialog } from "./demoteAdminAlertDialog";
import { GUNN_RUNNER_USER_ID } from "@/lib/constants";

export const DemoteAdmins = () => {
  const { pb } = usePocket();
  const [admins, setAdmins] = useState<User[]>([]);

  const fetchAdmins = useCallback(async () => {
    const res = (await pb.collection("users").getFullList({
      filter: pb.filter(`role = "admin"`),
      sort: "name",
    })) as User[];
    setAdmins(res);
  }, [pb]);

  useEffect(() => {
    fetchAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex flex-col gap-4">
        <h2 className="font-bold text-2xl">Current Admins</h2>
        {admins
          .filter((admin) => admin.id != GUNN_RUNNER_USER_ID)
          .map((admin) => (
            <div key={admin.id} className="flex items-center gap-3">
              <DemoteAdminAlertDialog
                admin={admin}
                refreshAdmins={fetchAdmins}
              />
              <p>{admin.name}</p>
            </div>
          ))}
      </div>
    </>
  );
};
