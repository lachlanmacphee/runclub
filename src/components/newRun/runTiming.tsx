import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStopwatch } from "react-timer-hook";
import { usePocket } from "@/contexts";
import { Participant } from "@/lib/types";

import { toast } from "@/components/ui/use-toast";
import { Stopwatch } from "@/components/newRun/stopwatch";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import { Latecomers } from "./collapsibles/latecomers";
import { NewParticipants } from "./collapsibles/newParticipants";
import { RemainingParticipants } from "./collapsibles/remainingParticipants";
import { RunNotes } from "./collapsibles/runNotes";

function getCompletedDefault(participants: Participant[]) {
  const res: Record<number, boolean> = {};
  participants.forEach(({ bib }) => {
    res[bib] = false;
  });
  return res;
}

export function RunTiming({
  participants,
  setParticipants,
}: {
  participants: Participant[];
  setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
}) {
  const { pb } = usePocket();
  const runId = participants[0].group_run_id;
  const { start, pause, hours, minutes, seconds, totalSeconds, isRunning } =
    useStopwatch();
  const navigate = useNavigate();

  const [completed, setCompleted] = useState<Record<number, boolean>>(
    getCompletedDefault(participants)
  );
  const [changing, setChanging] = useState<Record<number, boolean>>({});

  const isRunComplete =
    Object.keys(completed).length === participants.length &&
    Object.values(completed).every(Boolean);

  useEffect(() => {
    async function markRunComplete() {
      await pb.collection("group_runs").update(runId, { isComplete: true });
      pause();
      toast({
        title: "Run Complete!",
        description:
          "All participants have crossed the finish line! Please screenshot your notes if necessary. Redirecting to the results page in 15 seconds...",
      });
      setTimeout(() => {
        navigate("/runs");
      }, 15000);
    }
    if (isRunComplete) {
      markRunComplete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completed]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const markParticipant = useCallback(
    async (bib: number) => {
      const participant = participants.find((p) => p.bib === bib);

      if (!participant || !participant.id) {
        toast({
          title: "Participant Not Found",
          description:
            "We couldn't find that participant or they do not have an id.",
          variant: "destructive",
        });
        return;
      }

      setChanging((prevState) => ({ ...prevState, [bib]: true }));

      if (completed[bib]) {
        await pb
          .collection("participant_runs")
          .update(participant?.id, { time_seconds: 0 });

        setCompleted((prevState) => ({ ...prevState, [bib]: false }));
        setChanging((prevState) => ({ ...prevState, [bib]: false }));

        return;
      }

      await pb
        .collection("participant_runs")
        .update(participant?.id, { time_seconds: totalSeconds });

      setCompleted((prevState) => ({ ...prevState, [bib]: true }));
      setChanging((prevState) => ({ ...prevState, [bib]: false }));
    },
    [completed, participants, pb, totalSeconds]
  );

  return (
    <div className="flex flex-col gap-8">
      <Stopwatch
        start={start}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
        isRunning={isRunning}
        isRunComplete={isRunComplete}
      />
      {isRunning && (
        <div className="flex gap-4 justify-around flex-wrap">
          {participants
            .sort((a, b) => b.bib - a.bib)
            .map((participant) => (
              <Button
                onClick={() => markParticipant(participant.bib)}
                key={participant.bib}
                className="w-14 h-10 md:w-24 md:h-16 font-bold text-base md:text-xl"
                variant={completed[participant.bib] ? "secondary" : "default"}
                disabled={!isRunning}
              >
                {changing[participant.bib] ? (
                  <Loader2 className="h-4 w-4 md:h-8 md:w-8 animate-spin" />
                ) : (
                  participant.bib
                )}
              </Button>
            ))}
        </div>
      )}
      <div className="space-y-2">
        {!isRunning && !isRunComplete && (
          <NewParticipants participants={participants} />
        )}
        {!isRunning && !isRunComplete && (
          <Latecomers
            runId={runId}
            participants={participants}
            setParticipants={setParticipants}
          />
        )}
        {isRunning && !isRunComplete && (
          <RemainingParticipants
            participants={participants}
            completed={completed}
          />
        )}
        <RunNotes />
      </div>
    </div>
  );
}
