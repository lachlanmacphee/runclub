import { usePocket } from "@/contexts";
import { GroupRun, Participant } from "@/lib/types";
import { convertLocationValueToLabel, createRunDescription } from "@/lib/utils";
import { useCallback } from "react";

export function usePastRuns() {
  const { pb } = usePocket();

  const getParticipantsForRun = useCallback(
    async (id: string) => {
      // Find all the participants that were part of that run
      const threeKmParticipants: Participant[] = await pb
        .collection("participant_runs")
        .getFullList({
          filter: pb.filter("group_run_id = {:id} && distance = 3.5", {
            id,
          }),
          sort: "time_seconds",
        });

      const fiveKmParticipants: Participant[] = await pb
        .collection("participant_runs")
        .getFullList({
          filter: pb.filter("group_run_id = {:id} && distance = 5", {
            id,
          }),
          sort: "time_seconds",
        });

      threeKmParticipants.forEach(
        (participant, index) => (participant.position = index + 1)
      );

      fiveKmParticipants.forEach(
        (participant, index) => (participant.position = index + 1)
      );

      return { threeKmParticipants, fiveKmParticipants };
    },
    [pb]
  );

  const fetchLatestRun = useCallback(async () => {
    const res = await pb
      .collection("group_runs")
      .getList(1, 1, { sort: "-date" });

    const runs: GroupRun[] = res.items as unknown as GroupRun[];
    if (runs.length == 0) return undefined;

    const run = runs[0];
    const { threeKmParticipants, fiveKmParticipants } =
      await getParticipantsForRun(run.id);
    const location = convertLocationValueToLabel(run.location);
    const description = createRunDescription(
      [...threeKmParticipants, ...fiveKmParticipants],
      location
    );

    return {
      run,
      threeKmParticipants,
      fiveKmParticipants,
      description,
      location,
    };
  }, [pb, getParticipantsForRun]);

  const fetchRunFromDate = useCallback(
    async (date: Date) => {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const res = await pb.collection("group_runs").getList(1, 1, {
        filter: pb.filter("date >= {:startOfDay} && date <= {:endOfDay}", {
          startOfDay,
          endOfDay,
        }),
      });

      const runs: GroupRun[] = res.items as unknown as GroupRun[];
      if (runs.length == 0) return undefined;

      const run: GroupRun = runs[0];
      const { threeKmParticipants, fiveKmParticipants } =
        await getParticipantsForRun(run.id);
      const location = convertLocationValueToLabel(run.location);
      const description = createRunDescription(
        [...threeKmParticipants, ...fiveKmParticipants],
        location
      );

      return {
        run,
        threeKmParticipants,
        fiveKmParticipants,
        description,
        location,
      };
    },
    [pb, getParticipantsForRun]
  );

  return { fetchLatestRun, fetchRunFromDate };
}
