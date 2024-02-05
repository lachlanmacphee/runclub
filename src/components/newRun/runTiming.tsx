import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStopwatch } from "react-timer-hook";
import { usePocket } from "@/contexts";
import { convertTimesToSeconds } from "@/lib/utils";
import { Participant } from "@/lib/types";

import { toast } from "@/components/ui/use-toast";
import { Stopwatch } from "@/components/newRun/stopwatch";
import { Button } from "@/components/ui/button";
import { Latecomers } from "./lateComers";
import { Textarea } from "../ui/textarea";
import { ChevronsUpDown } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function RunTiming({
  participants,
  setParticipants,
}: {
  participants: Participant[];
  setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
}) {
  const { pb } = usePocket();
  const runId = participants[0].group_run_id;
  const { start, pause, hours, minutes, seconds, isRunning } = useStopwatch();
  const navigate = useNavigate();

  const [isLatecomersOpen, setIsLatecomersOpen] = useState(false);
  const [isNewGunniesOpen, setIsNewGunniesOpen] = useState(false);
  const [isRunNotesOpen, setIsRunNotesOpen] = useState(false);
  const [completed, setCompleted] = useState<Record<number, boolean>>({});

  const isRunComplete =
    Object.keys(completed).length === participants.length &&
    Object.values(completed).every(Boolean);

  const newParticipants = participants.filter(
    (participant) => participant.is_new
  );

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

  const markParticipant = async (bib: number) => {
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

    if (completed[bib]) {
      await pb
        .collection("participant_runs")
        .update(participant?.id, { time_seconds: 0 });
      setCompleted({ ...completed, [bib]: false });
      return;
    }

    const time = convertTimesToSeconds(hours, minutes, seconds);
    await pb
      .collection("participant_runs")
      .update(participant?.id, { time_seconds: time });

    setCompleted({ ...completed, [bib]: true });
  };

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
          {participants.map((participant) => (
            <Button
              onClick={() => markParticipant(participant.bib)}
              key={participant.bib}
              className="md:w-24 md:h-16 font-bold text-xl"
              variant={completed[participant.bib] ? "secondary" : "default"}
              disabled={!isRunning}
            >
              {participant.bib}
            </Button>
          ))}
        </div>
      )}
      <div className="space-y-2">
        {!isRunning && !isRunComplete && (
          <Collapsible
            open={isNewGunniesOpen}
            onOpenChange={setIsNewGunniesOpen}
            className="space-y-2"
          >
            <div className="flex items-center justify-between space-x-4">
              <h4 className="text-sm font-semibold">New Gunnies</h4>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 p-0">
                  <ChevronsUpDown className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-2">
              <div>
                {newParticipants.map((participant) => (
                  <p key={participant.name} className="text-sm sm:text-base">
                    {participant.name}
                  </p>
                ))}
                {newParticipants.length == 0 && (
                  <p className="text-sm sm:text-base">
                    There are no new Gunnies this week.
                  </p>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
        {!isRunning && !isRunComplete && (
          <Collapsible
            open={isLatecomersOpen}
            onOpenChange={setIsLatecomersOpen}
            className="space-y-2"
          >
            <div className="flex items-center justify-between space-x-4">
              <h4 className="text-sm font-semibold">Latecomers</h4>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 p-0">
                  <ChevronsUpDown className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-2">
              <Latecomers
                runId={runId}
                participants={participants}
                setParticipants={setParticipants}
              />
            </CollapsibleContent>
          </Collapsible>
        )}
        <Collapsible
          open={isRunNotesOpen}
          onOpenChange={setIsRunNotesOpen}
          className="space-y-2"
        >
          <div className="flex items-center justify-between space-x-4">
            <h4 className="text-sm font-semibold">Run Notes</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                <ChevronsUpDown className="h-4 w-4" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="space-y-2">
            <Textarea
              className="w-full h-[192px]"
              placeholder="You can write notes for the run here, but they will disappear once the run finishes."
            />
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
