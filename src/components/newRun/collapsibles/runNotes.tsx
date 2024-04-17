import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";

export const RunNotes = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
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
          defaultValue={localStorage.getItem("run_notes") || ""}
          onChange={(e) => localStorage.setItem("run_notes", e.target.value)}
          className="w-full h-[192px]"
          placeholder="You can write notes for the run here, but they will disappear once the run finishes. Screenshot if you need to keep them."
        />
      </CollapsibleContent>
    </Collapsible>
  );
};
