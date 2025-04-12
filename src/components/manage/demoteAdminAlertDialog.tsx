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
import { XIcon } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { User } from "@/lib/types";
import { useCallback } from "react";

export function DemoteAdminAlertDialog({
  admin,
  refreshAdmins,
}: {
  admin: User | null;
  refreshAdmins: VoidFunction;
}) {
  const { pb } = usePocket();
  const { toast } = useToast();

  const demoteAdmin = useCallback(
    async () => {
      if (!admin) return;
      await pb.collection("users").update(admin.id, { role: "member" });
      refreshAdmins();
      toast({
        title: "Admin Demoted",
        duration: 3000,
        description: `Demoted ${admin.name} from an admin to a member.`,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pb]
  );

  if (!admin) return null;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <XIcon className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent aria-describedby="confirm admin demotion">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to demote {admin.name}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            If they need admin permissions again, they'll have to make a new
            role request by clicking on their avatar.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={demoteAdmin}>Demote</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
