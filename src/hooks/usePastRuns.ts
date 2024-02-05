import { usePocket } from "@/contexts";
import { GroupRun, Participant } from "@/lib/types";
import { convertLocationValueToLabel, createRunDescription } from "@/lib/utils";
import { useCallback } from "react";

export function usePastRuns() {
  const { pb } = usePocket();

  const getParticipantsForRun = useCallback(
    async (id: string) => {
      // Find all the participants that were part of that run
      const participants: Participant[] = await pb
        .collection("participant_runs")
        .getFullList({
          filter: pb.filter("group_run_id = {:id}", {
            id,
          }),
          sort: "time_seconds",
        });

      participants.forEach(
        (participant, index) => (participant.position = index + 1)
      );

      return participants;
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
    const participants = await getParticipantsForRun(run.id);
    const location = convertLocationValueToLabel(run.location);
    const description = createRunDescription(participants, location);

    return { run, participants, description, location };
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
      const participants = await getParticipantsForRun(run.id);
      const location = convertLocationValueToLabel(run.location);
      const description = createRunDescription(participants, location);

      return { run, participants, description, location };
    },
    [pb, getParticipantsForRun]
  );

  return { fetchLatestRun, fetchRunFromDate };
}
