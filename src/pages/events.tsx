import { useCallback, useEffect, useState } from "react";
import { usePocket } from "@/contexts";
import type { Event, EventAttendance } from "@/lib/types";
import { ROLES } from "@/lib/constants";

// Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EventUpsertDialog } from "@/components/events/eventUpsertDialog";
import { EventDeleteAlertDialog } from "@/components/events/eventDeleteAlertDialog";
import { EventAttendeesDialog } from "@/components/events/eventAttendeesDialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function Events() {
  const { pb, user } = usePocket();
  const [events, setEvents] = useState<Event[]>([]);
  const [eventAttendances, setEventAttendances] = useState<EventAttendance[]>(
    []
  );
  const isAdmin = user?.role === ROLES.ADMIN;

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const fetchEventsAndAttendance = useCallback(async () => {
    const eventsRes = (await pb.collection("events").getFullList({
      filter: pb.filter("end >= {:currentDate}", {
        currentDate: todayDate,
      }),
    })) as Event[];
    const attendanceRes = (await pb.collection("event_attendance").getFullList({
      expand: "event_id",
      filter: pb.filter(
        "event_id.end >= {:currentDate} && user_id = {:currentUser}",
        {
          currentDate: todayDate,
          currentUser: user!.id,
        }
      ),
    })) as EventAttendance[];
    const newEvents: Event[] = eventsRes
      .map((event) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        link: event.link,
        start: new Date(event.start),
        end: new Date(event.end),
      }))
      .sort((a, b) => a.start.getTime() - b.start.getTime());
    setEvents(newEvents);
    setEventAttendances(attendanceRes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pb]);

  const goingHandler = async (event_id: string, going: boolean) => {
    if (going) {
      await pb.collection("event_attendance").create({
        user_id: user!.id,
        event_id,
      });
    } else {
      const attendances = eventAttendances.filter(
        (attendance) => attendance.event_id == event_id
      );

      if (attendances.length != 1) {
        console.error(
          "Unexpected number of attendances found:",
          attendances.length
        );
        return;
      }

      const attendance_id = attendances[0].id;
      await pb.collection("event_attendance").delete(attendance_id);
    }
    fetchEventsAndAttendance();
  };

  useEffect(() => {
    fetchEventsAndAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-16">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl md:text-5xl font-bold">Events</h1>
        {isAdmin && (
          <EventUpsertDialog refreshEvents={fetchEventsAndAttendance} />
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-6 gap-8">
        {events.length == 0 && <p>There are currently no upcoming events.</p>}
        {events.map((event, idx) => (
          <Card key={idx} className="flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg font-bold leading-tight truncate">
                    {event.title}
                  </CardTitle>
                  <CardDescription className="text-sm mt-1">
                    {event.start.getTime() == event.end.getTime()
                      ? event.start.toLocaleDateString()
                      : `${event.start.toLocaleDateString()} - ${event.end.toLocaleDateString()}`}
                  </CardDescription>
                </div>
                {isAdmin && (
                  <div className="flex gap-1 flex-shrink-0">
                    <EventUpsertDialog
                      event={event}
                      refreshEvents={fetchEventsAndAttendance}
                    />
                    <EventAttendeesDialog
                      eventId={event.id}
                      eventTitle={event.title}
                    />
                    <EventDeleteAlertDialog
                      event={event}
                      refreshEvents={fetchEventsAndAttendance}
                    />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p>{event.description}</p>
            </CardContent>
            <CardFooter>
              {event.link && (
                <a
                  href={event.link}
                  className="text-primary w-full font-bold underline-offset-4 hover:underline"
                >
                  More details
                </a>
              )}
              <div className="w-full flex justify-end">
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`${event.title.toLowerCase().replace(/\s/g, "")}-going`}
                    checked={eventAttendances.some(
                      (attendance) => attendance.event_id == event.id
                    )}
                    onCheckedChange={(checked) =>
                      goingHandler(event.id, checked)
                    }
                  />
                  <Label
                    htmlFor={`${event.title
                      .toLowerCase()
                      .replace(/\s/g, "")}-going`}
                  >
                    Going?
                  </Label>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
