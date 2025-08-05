import { useCallback, useEffect, useState } from "react";
import { usePocket } from "@/contexts";
import type { User } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

type ExpandedEventAttendance = {
  id: string;
  user_id: string;
  event_id: string;
  expand?: {
    user_id?: User;
  };
};

export function EventAttendeesDialog({
  eventId,
  eventTitle,
}: {
  eventId: string;
  eventTitle: string;
}) {
  const { pb } = usePocket();
  const [attendees, setAttendees] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchAttendees = useCallback(async () => {
    if (!open) return;

    setLoading(true);
    try {
      const attendanceRes = (await pb
        .collection("event_attendance")
        .getFullList({
          expand: "user_id",
          filter: pb.filter("event_id = {:eventId}", { eventId }),
        })) as ExpandedEventAttendance[];

      const attendeeUsers: User[] = attendanceRes
        .map((attendance) => attendance.expand?.user_id)
        .filter((user): user is User => Boolean(user));

      setAttendees(attendeeUsers);
    } catch (error) {
      console.error("Error fetching attendees:", error);
      setAttendees([]);
    } finally {
      setLoading(false);
    }
  }, [pb, eventId, open]);

  useEffect(() => {
    fetchAttendees();
  }, [fetchAttendees]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="icon">
          <Users className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Who's going to {eventTitle}?</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground">Loading attendees...</p>
            </div>
          ) : attendees.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No one has signed up yet.</p>
            </div>
          ) : (
            <>
              <div className="text-sm text-muted-foreground mb-4">
                {attendees.length} attendee{attendees.length !== 1 ? "s" : ""}
              </div>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {attendees.map((attendee) => (
                  <div
                    key={attendee.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                  >
                    <p className="font-medium text-sm">
                      {attendee.alias || attendee.name}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
