import { useCallback, useState } from "react";
import Select from "react-select";

import { Participant } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { usePocket } from "@/contexts";
import { useToast } from "../ui/use-toast";
import { COLLECTIONS } from "@/lib/constants";

export function SwapTimes({
  participants,
  update,
}: {
  participants: Participant[] | undefined;
  update: VoidFunction;
}) {
  const { pb } = usePocket();
  const { toast } = useToast();
  const [participantOne, setParticipantOne] = useState<Participant>();
  const [participantTwo, setParticipantTwo] = useState<Participant>();

  const onSwap = useCallback(async () => {
    if (!participantOne || !participantTwo) {
      toast({
        title: "Error 563",
        description: "Make sure you have two participants selected!",
        variant: "destructive",
      });
      return;
    }

    if (!participantOne?.time_seconds || !participantTwo?.time_seconds) {
      toast({
        title: "Error 564",
        description: "Both participants need to have times!",
        variant: "destructive",
      });
      return;
    }

    if (!participantOne?.id || !participantTwo?.id) {
      toast({
        title: "Error 565",
        description: "Both participants need to have ids!",
        variant: "destructive",
      });
      return;
    }

    if (participantOne.id == participantTwo.id) {
      toast({
        title: "Error 566",
        description: "You can't select the same participant!",
        variant: "destructive",
      });
      return;
    }

    // Swap participant one's time to participant two's
    await pb
      .collection(COLLECTIONS.PARTICIPANT_RUNS)
      .update(participantOne.id, {
        time_seconds: participantTwo.time_seconds,
      });

    // Swap participant two's time to participant one's
    await pb
      .collection(COLLECTIONS.PARTICIPANT_RUNS)
      .update(participantTwo.id, {
        time_seconds: participantOne.time_seconds,
      });

    toast({
      title: "Swapped!",
      description: `${participantOne.name}'s time was swapped with ${participantTwo.name}'s`,
    });

    setParticipantOne(undefined);
    setParticipantTwo(undefined);
    update();

    return;
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participantOne, participantTwo, pb, toast]);

  if (!participants) {
    return <p>Failed to get participants for this run...</p>;
  }

  return (
    <div className="flex flex-col gap-4 grow max-w-3xl">
      <h1 className="text-5xl font-bold">Swap Times</h1>
      <h2>Choose two participants and click the button</h2>
      <Select
        className="custom-react-select-container"
        classNamePrefix="custom-react-select"
        placeholder="Select the first participant..."
        value={
          participantOne
            ? { label: participantOne.name, value: participantOne.waiver_id }
            : null
        }
        onChange={(selection) =>
          setParticipantOne(
            participants.find(
              (participant) => participant.waiver_id == selection?.value
            )
          )
        }
        options={participants
          .filter(
            (participant) => participant.waiver_id !== participantTwo?.waiver_id
          )
          .map((participant) => {
            return {
              label: participant.name,
              value: participant.waiver_id,
            };
          })}
      />
      <Select
        className="custom-react-select-container"
        classNamePrefix="custom-react-select"
        placeholder="Select the second participant..."
        value={
          participantTwo
            ? { label: participantTwo.name, value: participantTwo.waiver_id }
            : null
        }
        onChange={(selection) =>
          setParticipantTwo(
            participants.find(
              (participant) => participant.waiver_id == selection?.value
            )
          )
        }
        options={participants
          .filter(
            (participant) => participant.waiver_id !== participantOne?.waiver_id
          )
          .map((participant) => {
            return {
              label: participant.name,
              value: participant.waiver_id,
            };
          })}
      />
      <Button onClick={onSwap} disabled={!participantOne || !participantTwo}>
        Swap Times
      </Button>
    </div>
  );
}
