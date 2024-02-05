import { Dispatch, SetStateAction } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function RunSetupConfirmationAlert({
  isConfirmationModalOpen,
  setIsConfirmationModalOpen,
  handleSubmitConfirmationConfirm,
  handleSubmitConfirmationCancel,
}: {
  isConfirmationModalOpen: boolean;
  setIsConfirmationModalOpen: Dispatch<SetStateAction<boolean>>;
  handleSubmitConfirmationConfirm: VoidFunction;
  handleSubmitConfirmationCancel: VoidFunction;
}) {
  return (
    <AlertDialog
      open={isConfirmationModalOpen}
      onOpenChange={setIsConfirmationModalOpen}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl text-red-600">
            IMPORTANT
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xl">
            You will not be able to come back to this screen, but you can still
            add latecomers on the next page. You should only click "Next Step"
            as you are about to leave the pub.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleSubmitConfirmationCancel}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmitConfirmationConfirm}>
            Next Step
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
