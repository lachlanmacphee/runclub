import { useCallback, useState } from "react";
import Select from "react-select";

import { usePocket } from "@/contexts";
import { useMembers } from "@/hooks/useMembers";
import { COLLECTIONS } from "@/lib/constants";
import { Participant } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

type MemberOption = {
  label: string;
  value: string;
};

export function SwapBibParticipant({
  participants,
  update,
}: {
  participants: Participant[] | undefined;
  update: VoidFunction;
}) {
  const { pb } = usePocket();
  const { members } = useMembers();
  const { toast } = useToast();

  const [bibNumber, setBibNumber] = useState<string>("");
  const [selectedMember, setSelectedMember] = useState<MemberOption | null>(
    null
  );

  const onSwapBibParticipant = useCallback(async () => {
    if (!participants) {
      toast({
        title: "Error 571",
        description: "Failed to load participants for this run.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedMember) {
      toast({
        title: "Error 572",
        description: "Choose a participant from the dropdown.",
        variant: "destructive",
      });
      return;
    }

    const bibAsNumber = Number(bibNumber);
    if (Number.isNaN(bibAsNumber) || bibAsNumber < 1) {
      toast({
        title: "Error 573",
        description: "Enter a valid bib number.",
        variant: "destructive",
      });
      return;
    }

    const participantForBib = participants.find(
      (participant) => participant.bib === bibAsNumber
    );

    if (!participantForBib || !participantForBib.id) {
      toast({
        title: "Error 574",
        description: "No participant was found for that bib number.",
        variant: "destructive",
      });
      return;
    }

    if (participantForBib.waiver_id === selectedMember.value) {
      toast({
        title: "Error 575",
        description: "That member already has this bib.",
        variant: "destructive",
      });
      return;
    }

    await pb.collection(COLLECTIONS.PARTICIPANT_RUNS).update(participantForBib.id, {
      waiver_id: selectedMember.value,
      name: selectedMember.label,
    });

    toast({
      title: "Updated!",
      description: `Bib ${bibAsNumber} now belongs to ${selectedMember.label}.`,
    });

    setBibNumber("");
    setSelectedMember(null);
    update();
  }, [bibNumber, participants, pb, selectedMember, toast, update]);

  if (!participants) {
    return <p>Failed to get participants for this run...</p>;
  }

  return (
    <div className="flex flex-col gap-4 grow max-w-3xl">
      <h1 className="text-4xl font-bold">Swap Bib Participant</h1>
      <h2>Enter a bib number and assign their run to a different member. You might use this if you gave the bib to someone initially, but then they decided to pass it to someone else.</h2>

      <div className="flex flex-col gap-2">
        <Label htmlFor="bib-number">Bib Number</Label>
        <Input
          id="bib-number"
          type="number"
          min={1}
          placeholder="Enter bib number..."
          value={bibNumber}
          onChange={(event) => setBibNumber(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>New Participant</Label>
        <Select
          className="custom-react-select-container"
          classNamePrefix="custom-react-select"
          placeholder="Select a member..."
          value={selectedMember}
          onChange={(selection) => setSelectedMember(selection as MemberOption | null)}
          options={members.map((member) => ({
            label: member.name,
            value: member.waiver_id,
          }))}
        />
      </div>

      <Button
        onClick={onSwapBibParticipant}
        disabled={!bibNumber || !selectedMember}
      >
        Swap Bib Participant
      </Button>
    </div>
  );
}
