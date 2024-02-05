import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction } from "react";

export function IntroMessageDialog({
  isIntroModalOpen,
  setIsIntroModalOpen,
}: {
  isIntroModalOpen: boolean;
  setIsIntroModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Dialog open={isIntroModalOpen} onOpenChange={setIsIntroModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Warning!</DialogTitle>
          <DialogDescription>
            Please read this before starting!
          </DialogDescription>
        </DialogHeader>
        <p>
          Please set your phone to <strong>Do Not Disturb</strong> mode before
          creating and timing a run. You should also set your screen to{" "}
          <strong>never sleep</strong> so it doesn't turn off while you're
          timing.
        </p>
        <DialogFooter>
          <Button onClick={() => setIsIntroModalOpen(false)}>Okay!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
