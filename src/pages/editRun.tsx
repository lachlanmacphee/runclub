import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { usePastRuns } from "@/hooks/usePastRuns";
import { Participant } from "@/lib/types";
import { SwapTimes } from "@/components/editRun/SwapTimes";
import { EditTime } from "@/components/editRun/EditTime";

export function EditRun() {
  const { runId } = useParams();

  const { getParticipantsForRun } = usePastRuns();
  const [participants, setParticipants] = useState<Participant[]>();

  useEffect(() => {
    async function getParticipants() {
      const { threeKmParticipants, fiveKmParticipants } =
        await getParticipantsForRun(runId as string);
      setParticipants([...threeKmParticipants, ...fiveKmParticipants]);
    }
    getParticipants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-16 grow max-w-3xl">
        <SwapTimes participants={participants} />
        <EditTime participants={participants} />
      </div>
    </div>
  );
}
