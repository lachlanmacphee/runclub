import { useCallback, useEffect, useState } from "react";
import { usePocket } from "@/contexts";
import { EventUpsertDialog } from "@/components/events/eventUpsertDialog";
import type { Event } from "@/lib/types";
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
import { EventDeleteAlertDialog } from "@/components/events/eventDeleteAlertDialog";

export function Events() {
  const { pb, user } = usePocket();
  const [events, setEvents] = useState<Event[]>([]);
  const isAdmin = user?.role === ROLES.ADMIN;

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const fetchEvents = useCallback(async () => {
    const eventsRes = (await pb.collection("events").getFullList({
      filter: pb.filter("end >= {:currentDate}", {
        currentDate: todayDate,
      }),
    })) as Event[];
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pb]);

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-16">
      <h1 className="text-3xl md:text-5xl text-center md:text-left font-bold">
        Upcoming Events
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-3xl">
        {events.map((event, idx) => (
          <Card key={idx}>
            <div className="flex justify-between items-center pr-6">
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription>
                  {event.start.getTime() == event.end.getTime()
                    ? event.start.toLocaleDateString()
                    : `${event.start.toLocaleDateString()} - ${event.end.toLocaleDateString()}`}
                </CardDescription>
              </CardHeader>
              {isAdmin && (
                <div className="flex gap-2">
                  <EventUpsertDialog
                    event={event}
                    refreshEvents={fetchEvents}
                  />
                  <EventDeleteAlertDialog
                    event={event}
                    refreshEvents={fetchEvents}
                  />
                </div>
              )}
            </div>
            <CardContent>
              <p>{event.description}</p>
            </CardContent>
            <CardFooter>
              <a
                href={event.link}
                className="text-primary underline-offset-4 hover:underline"
              >
                {event.link}
              </a>
            </CardFooter>
          </Card>
        ))}
      </div>
      {isAdmin && <EventUpsertDialog refreshEvents={fetchEvents} />}
    </div>
  );
}
