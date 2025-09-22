import { usePocket } from "@/contexts";
import { COLLECTIONS, DISTANCE_OPTIONS } from "@/lib/constants";
import { Participant } from "@/lib/types";
import { useCallback, useState } from "react";
import Select from "react-select";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";

function convertStrDistanceToNumber(distance: string) {
  if (distance == "3.5") return 3.5;
  if (distance == "5") return 5;
  return 5;
}

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

export function EditDistanceTime({
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
  const [distance, setDistance] = useState<{
    label: string;
    value: string;
  } | null>();

  const onSelectParticipant = (selection: { label: string; value: string }) => {
    const newParticipant: Participant | undefined = participants?.find(
      (participant) => participant.waiver_id == selection?.value
    );

    if (!newParticipant) {
      toast({
        title: "Error 571",
        description: "New participant was invalid!",
        variant: "destructive",
      });
      return;
    }

    setParticipant(newParticipant);
    const timeCalc = secondsToHms(newParticipant.time_seconds);
    setHours(timeCalc.hours.toString());
    setMinutes(timeCalc.minutes.toString());
    setSeconds(timeCalc.seconds.toString());
    setDistance(
      DISTANCE_OPTIONS.find(
        (option) => option.value == newParticipant?.distance.toString()
      )
    );
    return;
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

    if (!distance) {
      toast({
        title: "Error 570",
        description: "Distance not entered correctly!",
        variant: "destructive",
      });
      return;
    }

    try {
      const newTime =
        parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
      const newDistance = convertStrDistanceToNumber(distance.value);
      await pb.collection(COLLECTIONS.PARTICIPANT_RUNS).update(participant.id, {
        time_seconds: newTime,
        distance: newDistance,
      });
    } catch {
      toast({
        title: "Error 571",
        description: "Something went wrong while converting times...",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success!",
      description: `${participant.name}'s run entry has been adjusted.`,
    });

    setParticipant(undefined);
    update();
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hours, minutes, participant, pb, seconds, distance, toast]);

  if (!participants) {
    return <p>Failed to get participants for this run...</p>;
  }

  return (
    <div className="flex flex-col gap-4 grow max-w-3xl">
      <h1 className="text-5xl font-bold">Edit Participant</h1>
      <h2>Choose a participant to edit their distance and time</h2>
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
      {participant && participant.time_seconds >= 0 && (
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
          <Select
            className="custom-react-select-container"
            classNamePrefix="custom-react-select"
            placeholder="Select distance..."
            value={distance}
            isSearchable={false}
            onChange={setDistance}
            options={DISTANCE_OPTIONS}
          />
          <Button onClick={onChange}>Change</Button>
        </>
      )}
    </div>
  );
}
