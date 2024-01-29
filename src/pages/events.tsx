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
  start: Date;
  end: Date;
};

type EventType = {
  title: string;
  start: Date;
  end: Date;
};

export function Events() {
  const { pb, user } = usePocket();
  const [events, setEvents] = useState<EventType[]>([]);
  const isAdmin = user?.role === ROLES.ADMIN;

  const fetchEvents = useCallback(async () => {
    const eventsRes = (await pb
      .collection("events")
      .getFullList()) as EventResType[];
    const newEvents: EventType[] = [];
    eventsRes.map((event) => {
      newEvents.push({
        title: event.title,
        start: new Date(event.start),
        end: new Date(event.end),
      });
    });
    setEvents(newEvents);
  }, [pb]);

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex justify-center">
      <div className="flex flex-grow max-w-3xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead className="flex justify-between items-center">
                Description
                {isAdmin && <EventCreationDialog refreshEvents={fetchEvents} />}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event, idx) => (
              <TableRow key={idx}>
                <TableCell>{event.start.toLocaleDateString()}</TableCell>
                <TableCell>{event.title}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
