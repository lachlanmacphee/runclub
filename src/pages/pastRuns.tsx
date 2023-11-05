import { RunTable } from "@/components/runTable";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function PastRuns() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="flex flex-col px-4 gap-4">
      <div className="flex justify-between">
        <div className="w-full max-w-xs">
          <label>Date</label>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </div>
        <div className="w-full max-w-xs">
          <label>Runner</label>
          <Input
            type="text"
            placeholder="Name here"
            className="w-full max-w-xs"
          />
        </div>
      </div>
      <div className="flex flex-col items-center">
        <h1 className="text-xl font-bold">7th of November, 2023</h1>
        <h2>Albert Park Lake</h2>
      </div>
      <RunTable />
    </div>
  );
}
