import { RunTable } from "@/components/runTable";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { formatDateWithSuffix } from "@/utils";
import { useState } from "react";

export function PastRuns() {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <div className="flex flex-col p-8 gap-4">
      <div className="flex justify-between items-center">
        <DatePicker date={date} setDate={setDate} />
        <div className="flex flex-col items-center text-center">
          <h1 className="text-xl font-bold">
            {date && formatDateWithSuffix(date)}
          </h1>
          <h2>Albert Park Lake</h2>
        </div>
        <div className="flex flex-col gap-2 w-full max-w-xs">
          <Input
            name="runner"
            type="text"
            placeholder="Runner"
            className="w-full max-w-xs"
          />
        </div>
      </div>

      <RunTable />
    </div>
  );
}
