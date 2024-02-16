import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Participant } from "@/lib/types";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";

export const NewParticipants = ({
  participants,
}: {
  participants: Participant[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const newParticipants = participants.filter(
    (participant) => participant.is_new
  );

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
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
  );
};
