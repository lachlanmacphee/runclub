import { useCallback, useEffect, useState } from "react";
import { usePocket } from "@/contexts";
import { EventCreationDialog } from "@/components/events/eventCreationDialog";
import { ROLES } from "@/lib/constants";

// Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type EventResType = {
  title: string;
  description: string;
  start: string;
  end: string;
};

type EventType = {
  title: string;
  description: string;
  start: Date;
  end: Date;
};

export function Events() {
  const { pb, user } = usePocket();
  const [events, setEvents] = useState<EventType[]>([]);
  const isAdmin = user?.role === ROLES.ADMIN;

  const fetchEvents = useCallback(async () => {
    const eventsRes = (await pb.collection("events").getFullList({
      filter: pb.filter("end > {:currentDate}", {
        currentDate: new Date(),
      }),
    })) as EventResType[];
    const newEvents: EventType[] = eventsRes
      .map((event) => ({
        title: event.title,
        description: event.description,
        start: new Date(event.start),
        end: new Date(event.end),
      }))
      .sort((a, b) => a.start.getTime() - b.start.getTime());
    setEvents(newEvents);
  }, [pb]);

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl md:text-5xl text-center md:text-left font-bold">
        Upcoming Events
      </h1>
      <div className="flex flex-grow max-w-3xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="flex justify-between items-center">
                Description
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  {event.start.getTime() == event.end.getTime()
                    ? event.start.toLocaleDateString()
                    : `${event.start.toLocaleDateString()} - ${event.end.toLocaleDateString()}`}
                </TableCell>
                <TableCell>{event.title}</TableCell>
                <TableCell>{event.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {isAdmin && <EventCreationDialog refreshEvents={fetchEvents} />}
    </div>
  );
}
