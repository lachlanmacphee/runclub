import { usePocket } from "@/contexts";
import type { RoleRequest } from "@/lib/types";
import { Check, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { ROLES } from "@/lib/constants";

export const JudgeRoleRequests = () => {
  const { pb, user } = usePocket();
  const [roleRequests, setRoleRequests] = useState<RoleRequest[]>();

  const fetchRoleRequests = useCallback(async () => {
    const res = (await pb
      .collection("role_requests")
      .getFullList({ expand: "user_id" })) as RoleRequest[];
    setRoleRequests(res);
  }, [pb]);

  const denyRequest = useCallback(
    async (id: string, name: string) => {
      await pb.collection("role_requests").delete(id);
      fetchRoleRequests();
      toast({
        title: "Request Denied",
        duration: 3000,
        description: `Declined ${name}'s role change request`,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pb]
  );

  const approveRequest = useCallback(
    async (id: string, user_id: string, new_role: string, name: string) => {
      await pb.collection("users").update(user_id, { role: new_role });
      await pb.collection("role_requests").delete(id);
      fetchRoleRequests();
      toast({
        title: "Request Approved",
        duration: 3000,
        description: `Approved ${name}'s request to change to ${new_role}`,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pb]
  );

  useEffect(() => {
    fetchRoleRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!roleRequests || roleRequests.length == 0)
    return (
      <div className="flex flex-col gap-4">
        <h2 className="font-bold text-2xl">Role Requests</h2>
        <div className="grid grid-cols-3">
          <h2>Name</h2>
          <h2>Role Requested</h2>
          <h2>Approve / Deny</h2>
        </div>
        <p className="text-center font-bold">No role requests to approve</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-bold text-2xl">Role Requests</h2>
      <div className="grid grid-cols-3">
        <h2>Name</h2>
        <h2>Role Requested</h2>
        <h2>Approve / Deny</h2>
      </div>
      {roleRequests?.map((request) => (
        <div key={request.id} className="grid grid-cols-3">
          <p>{request.expand.user_id.name}</p>
          <p>
            {request.new_role == ROLES.MODERATOR
              ? ROLES.VOLUNTEER
              : request.new_role}
          </p>
          <div className="flex gap-4">
            <Button
              variant="ghost"
              disabled={request.expand.user_id.id == user?.id}
              onClick={() =>
                approveRequest(
                  request.id,
                  request.expand.user_id.id,
                  request.new_role,
                  request.expand.user_id.name
                )
              }
            >
              <Check color="green" />
            </Button>
            <Button
              variant="ghost"
              onClick={() =>
                denyRequest(request.id, request.expand.user_id.name)
              }
            >
              <X color="red" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
