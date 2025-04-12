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
import { Event } from "@/lib/types";
import { Trash } from "lucide-react";
import { useToast } from "../ui/use-toast";

export function EventDeleteAlertDialog({
  event,
  refreshEvents,
}: {
  event: Event;
  refreshEvents: VoidFunction;
}) {
  const { pb } = usePocket();
  const { toast } = useToast();

  async function deleteHandler() {
    if (event && event.id) {
      await pb.collection("events").delete(event.id);
      toast({
        title: "Event Deleted",
        description: `"${event.title}" has been permanently deleted.`,
      });
    }
    refreshEvents();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent aria-describedby="confirm event deletion">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this event?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            event and remove it from the server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteHandler}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
