import { usePocket } from "@/contexts";
import { useCallback, useEffect, useState } from "react";

export function useUpcomingTuesdays() {
  const { pb } = usePocket();
  const [tuesdays, setTuesdays] = useState<string[]>();

  const fetchTuesdays = useCallback(async () => {
    const response = await fetch(pb.baseUrl + "api/tuesdays");
    const tuesdayRes = await response.json();
    const tuesdaysArr = tuesdayRes.message;
    setTuesdays(tuesdaysArr);
  }, [pb]);

  useEffect(() => {
    fetchTuesdays();
  }, [fetchTuesdays]);

  return { tuesdays };
}
