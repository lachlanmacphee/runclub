import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { usePastRuns } from "@/hooks/usePastRuns";
import { Participant } from "@/lib/types";
import { SwapTimes } from "@/components/editRun/SwapTimes";
import { EditTime } from "@/components/editRun/EditTime";

export function EditRun() {
  const { runId } = useParams();

  const { getParticipantsForRun } = usePastRuns();
  const [participants, setParticipants] = useState<Participant[]>();

  const getParticipants = useCallback(async () => {
    if (!runId) {
      return;
    }
    const { threeKmParticipants, fiveKmParticipants } =
      await getParticipantsForRun(runId, true);
    setParticipants([...threeKmParticipants, ...fiveKmParticipants]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getParticipants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!runId) {
    return <p>URL is missing runId</p>;
  }

  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-16 grow max-w-3xl">
        <SwapTimes participants={participants} update={getParticipants} />
        <EditTime participants={participants} update={getParticipants} />
      </div>
    </div>
  );
}
