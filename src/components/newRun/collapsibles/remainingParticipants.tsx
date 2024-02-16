/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Participant } from "@/lib/types";
import { ChevronsUpDown } from "lucide-react";
import { useState, useMemo } from "react";

function getRemainingParticipants(
  participants: Participant[],
  completed: Record<number, boolean>
) {
  const incompleteBibs: number[] = [];
  Object.entries(completed).forEach(([key, value]) => {
    if (!value) incompleteBibs.push(parseInt(key));
  });
  const incompleteParticipants: Participant[] = [];
  participants.forEach((participant) => {
    if (incompleteBibs.includes(participant.bib)) {
      incompleteParticipants.push(participant);
    }
  });
  return incompleteParticipants;
}

export const RemainingParticipants = ({
  participants,
  completed,
}: {
  participants: Participant[];
  completed: Record<number, boolean>;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const incompleteParticipants: Participant[] = useMemo(
    () => getRemainingParticipants(participants, completed),
    [completed]
  );

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
      <div className="flex items-center justify-between space-x-4">
        <h4 className="text-sm font-semibold">Remaining Participants</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-1">
        {incompleteParticipants.map((participant) => (
          <p key={participant.bib} className="text-sm sm:text-base">
            {participant.name}
          </p>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};
