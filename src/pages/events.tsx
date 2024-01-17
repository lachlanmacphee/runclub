import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import { useCallback, useEffect, useState } from "react";
import { usePocket } from "@/contexts";
import { EventCreationDialog } from "@/components/events/eventCreationDialog";
import { ROLES } from "@/lib/constants";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

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
    <div>
      {isAdmin && <EventCreationDialog refreshEvents={fetchEvents} />}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        className="mt-4"
      />
    </div>
  );
}
