import { Dispatch, SetStateAction, useEffect, useState } from "react";

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
  const [isDisabled, setIsDisabled] = useState(true);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isConfirmationModalOpen && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [isConfirmationModalOpen, countdown]);

  useEffect(() => {
    if (!isConfirmationModalOpen) {
      setCountdown(10);
      setIsDisabled(true);
    }
  }, [isConfirmationModalOpen]);

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
          <AlertDialogAction
            disabled={isDisabled}
            onClick={handleSubmitConfirmationConfirm}
          >
            {countdown > 0 ? `Next Step (${countdown})` : "Next Step"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
