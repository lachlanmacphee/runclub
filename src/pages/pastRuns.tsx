import { RunTable } from "@/components/runTable";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDateWithSuffix } from "@/utils";
import { useState } from "react";

export function PastRuns() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  function handleCalendarClose(date: Date | undefined) {
    setDate(date);
    setShowCalendar(false);
  }

  return (
    <div className="flex flex-col p-8 gap-4">
      <div className="flex justify-between items-center">
        <div className="flex w-full flex-col gap-2 max-w-xs">
          <Label htmlFor="date" className="font-bold">
            Date
          </Label>
          <Input
            name="date"
            onClick={() => setShowCalendar(true)}
            onChange={() => {}}
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
        <div className="flex flex-col items-center text-center">
          <h1 className="text-xl font-bold">
            {date && formatDateWithSuffix(date)}
          </h1>
          <h2>Albert Park Lake</h2>
        </div>
        <div className="flex flex-col gap-2 w-full max-w-xs">
          <Label htmlFor="date" className="font-bold">
            Runner
          </Label>
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
