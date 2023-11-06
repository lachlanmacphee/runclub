import { RunTable } from "@/components/runTable";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function PastRuns() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  function handleCalendarClose(date: Date | undefined) {
    setDate(date);
    setShowCalendar(false);
  }

  return (
    <div className="flex flex-col px-4 gap-4">
      <div className="flex justify-between items-center">
        <div className="w-full max-w-xs">
          <Label htmlFor="date">Date</Label>
          <Input
            name="date"
            onClick={() => setShowCalendar(true)}
            value={date?.toLocaleDateString()}
          />
          {showCalendar && (
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleCalendarClose}
              className="rounded-md z-10 bg-white dark:bg-black border absolute"
            />
          )}
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-bold">7th of November, 2023</h1>
          <h2>Albert Park Lake</h2>
        </div>
        <div className="w-full max-w-xs">
          <Label htmlFor="date">Runner</Label>
          <Input
            name="runner"
            type="text"
            placeholder="Name here"
            className="w-full max-w-xs"
          />
        </div>
      </div>

      <RunTable />
    </div>
  );
}
