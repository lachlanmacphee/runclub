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
          <DialogTitle className="text-2xl text-red-600">IMPORTANT</DialogTitle>
          <DialogDescription className="text-xl">
            Read this before starting
          </DialogDescription>
        </DialogHeader>
        <p className="text-center">
          Set your phone to <strong>Do Not Disturb</strong> mode before creating
          and timing a run.
        </p>
        <p className="text-center">
          In settings, set your screen to <strong>never sleep</strong> so it
          stays on whilst timing.
        </p>
        <DialogFooter>
          <Button onClick={() => setIsIntroModalOpen(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
