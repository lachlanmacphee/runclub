import { usePocket } from "@/contexts";
import { User } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

export function useUsers() {
  const { pb } = usePocket();
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = useCallback(async () => {
    const userRes = (await pb.collection("users").getFullList()) as User[];
    setUsers(userRes);
  }, [pb]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users };
}
