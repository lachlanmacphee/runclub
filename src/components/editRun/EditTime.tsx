import { Participant } from "@/lib/types";
import { useCallback, useState } from "react";
import Select from "react-select";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { COLLECTIONS } from "@/lib/constants";
import { usePocket } from "@/contexts";

function secondsToHms(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return {
    hours,
    minutes,
    seconds: remainingSeconds,
  };
}

export function EditTime({
  participants,
  update,
}: {
  participants: Participant[] | undefined;
  update: VoidFunction;
}) {
  const { pb } = usePocket();
  const { toast } = useToast();

  const [participant, setParticipant] = useState<Participant>();

  const [hours, setHours] = useState<string | undefined>();
  const [minutes, setMinutes] = useState<string | undefined>();
  const [seconds, setSeconds] = useState<string | undefined>();

  const onSelectParticipant = (selection: { label: string; value: string }) => {
    const newParticipant: Participant | undefined = participants?.find(
      (participant) => participant.waiver_id == selection?.value
    );
    setParticipant(newParticipant);

    if (newParticipant?.time_seconds) {
      const timeCalc = secondsToHms(newParticipant?.time_seconds ?? 0);
      setHours(timeCalc.hours.toString());
      setMinutes(timeCalc.minutes.toString());
      setSeconds(timeCalc.seconds.toString());
      return;
    }

    setHours(undefined);
    setMinutes(undefined);
    setSeconds(undefined);
  };

  const onChange = useCallback(async () => {
    if (!participant) {
      toast({
        title: "Error 567",
        description: "Make sure you have a participant selected!",
        variant: "destructive",
      });
      return;
    }

    if (!participant.id) {
      toast({
        title: "Error 568",
        description: "Participant doesn't have an id!",
        variant: "destructive",
      });
      return;
    }

    if (hours == undefined || minutes == undefined || seconds == undefined) {
      toast({
        title: "Error 569",
        description: "Times not entered correctly!",
        variant: "destructive",
      });
      return;
    }

    try {
      const newTime =
        parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
      await pb.collection(COLLECTIONS.PARTICIPANT_RUNS).update(participant.id, {
        time_seconds: newTime,
      });
    } catch {
      toast({
        title: "Error 570",
        description: "Something went wrong while converting times...",
        variant: "destructive",
      });
    }

    toast({
      title: "Changed!",
      description: `${participant.name}'s time has been adjusted.`,
    });

    setParticipant(undefined);
    update();
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hours, minutes, participant, pb, seconds, toast]);

  if (!participants) {
    return <p>Failed to get participants for this run...</p>;
  }

  return (
    <div className="flex flex-col gap-4 grow max-w-3xl">
      <h1 className="text-5xl font-bold">Edit Time</h1>
      <h2>Choose a participant to edit their time</h2>
      <Select
        className="custom-react-select-container"
        classNamePrefix="custom-react-select"
        placeholder="Select a participant..."
        value={
          participant
            ? { label: participant.name, value: participant.waiver_id }
            : null
        }
        onChange={(selection) => !!selection && onSelectParticipant(selection)}
        options={participants.map((participant) => {
          return {
            label: participant.name,
            value: participant.waiver_id,
          };
        })}
      />
      {participant?.time_seconds && (
        <>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Hours</Label>
              <Input
                value={hours}
                type="number"
                onChange={(e) => setHours(e.target.value)}
              />
            </div>
            <div>
              <Label>Minutes</Label>
              <Input
                value={minutes}
                type="number"
                onChange={(e) => setMinutes(e.target.value)}
              />
            </div>
            <div>
              <Label>Seconds</Label>
              <Input
                value={seconds}
                type="number"
                onChange={(e) => setSeconds(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={onChange}>Change</Button>
        </>
      )}
    </div>
  );
}
