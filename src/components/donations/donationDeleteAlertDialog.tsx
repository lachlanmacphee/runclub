import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { usePocket } from "@/contexts";
import { Donation } from "@/lib/types";
import { Trash } from "lucide-react";
import { useToast } from "../ui/use-toast";

export function DonationDeleteAlertDialog({
  donation,
  refreshDonations,
}: {
  donation: Donation;
  refreshDonations: VoidFunction;
}) {
  const { pb } = usePocket();
  const { toast } = useToast();

  async function deleteHandler() {
    if (donation && donation.id) {
      await pb.collection("donations").delete(donation.id);
      toast({
        title: "Donation Deleted",
        description: `Donation to "${donation.recipient}" has been permanently deleted.`,
      });
    }
    refreshDonations();
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(amount);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent aria-describedby="confirm donation deletion">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this donation?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the {formatCurrency(donation.amount)}{" "}
            donation to "{donation.recipient}". This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteHandler}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
