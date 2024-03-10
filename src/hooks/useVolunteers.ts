import { toast } from "@/components/ui/use-toast";
import { usePocket } from "@/contexts";
import { Volunteer } from "@/lib/types";
import { add } from "date-fns";
import { useCallback, useEffect, useState } from "react";

export function useVolunteers() {
  const { pb } = usePocket();

  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const [volunteers, setVolunteers] = useState<{
    [key: string]: Volunteer[];
  }>({});

  const signUp = useCallback(
    async (run_date: string, user_id: string) => {
      setIsUpdating(true);

      const res = await pb.collection("volunteers").getFullList({
        filter: pb.filter("run_date = {:run_date}", {
          run_date,
        }),
      });

      if (res.length >= 3) {
        toast({
          title: "Volunteer Signup Failed",
          variant: "destructive",
          duration: 5000,
          description:
            "There are already 3 volunteers signed up for this run. Please refresh the page to get the latest data",
        });
        return;
      }

      await pb.collection("volunteers").create({ run_date, user_id });
      setIsUpdating(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const optOut = useCallback(
    async (id: string) => {
      setIsUpdating(true);
      await pb.collection("volunteers").delete(id);
      setIsUpdating(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const fetchVolunteers = useCallback(async () => {
    const resVolunteers: Volunteer[] = await pb
      .collection("volunteers")
      .getFullList({
        filter: pb.filter("run_date >= {:minDate} && run_date <= {:maxDate}", {
          minDate: new Date(),
          maxDate: add(new Date(), { months: 3 }),
        }),
        expand: "user_id,waiver_id",
        sort: "created",
      });
    const tempVolunteers: { [key: string]: Volunteer[] } = {};
    resVolunteers.forEach((volunteer) => {
      // @ts-ignore
      const dateStr = (volunteer.run_date as string).replace(" ", "T");
      tempVolunteers[dateStr] = [...(tempVolunteers[dateStr] ?? []), volunteer];
    });
    setVolunteers(tempVolunteers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchVolunteers();
    pb.collection("volunteers").subscribe("*", fetchVolunteers);
    return () => {
      pb.collection("volunteers").unsubscribe("*");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { signUp, optOut, volunteers, isUpdating };
}
