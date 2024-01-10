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
          <AlertDialogTitle>
            Are you sure you want to create a run?
          </AlertDialogTitle>
          <AlertDialogDescription>
            You will not be able to come back to this screen after. We recommend
            clicking "Create Run" only when you are about to leave the pub.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleSubmitConfirmationCancel}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmitConfirmationConfirm}>
            Create
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
