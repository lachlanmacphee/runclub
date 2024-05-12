import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { usePastRuns } from "@/hooks/usePastRuns";
import { Participant } from "@/lib/types";
import { SwapTimes } from "@/components/editRun/SwapTimes";
import { EditDistanceTime } from "@/components/editRun/EditDistanceTime";
import { Loader2 } from "lucide-react";

export function EditRun() {
  const { runId } = useParams();

  const { getParticipantsForRun } = usePastRuns();
  const [participants, setParticipants] = useState<Participant[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getParticipants = useCallback(async () => {
    setIsLoading(true);
    if (!runId) {
      setIsLoading(false);
      return;
    }
    const { threeKmParticipants, fiveKmParticipants } =
      await getParticipantsForRun(runId, true);
    setParticipants([...threeKmParticipants, ...fiveKmParticipants]);
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getParticipants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!runId) {
    return <p>URL is missing runId</p>;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-16 grow max-w-3xl">
        <SwapTimes participants={participants} update={getParticipants} />
        <EditDistanceTime
          participants={participants}
          update={getParticipants}
        />
      </div>
    </div>
  );
}
