import { RunTable } from "@/components/runTable";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Participant } from "@/types";
import { formatDateWithSuffix } from "@/utils";
import { useState } from "react";

export function PastRuns() {
  const [date, setDate] = useState<Date>(new Date());
  const [runner, setRunner] = useState<string>("");
  const [runLocation, setRunLocation] = useState<string>("");
  const [participants, setParticipants] = useState<Participant[]>([]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:gap-0 md:grid-cols-[0.5fr_1fr_0.5fr]">
        <div className="row-start-2 md:row-start-1">
          <DatePicker date={date} setDate={setDate} />
        </div>
        <div className="flex flex-col items-center text-center">
          <h1 className="text-xl font-bold">
            {date && formatDateWithSuffix(date)}
          </h1>
          <h2>{runLocation}</h2>
        </div>
        <Input
          name="runner"
          type="text"
          value={runner}
          onChange={(e) => setRunner(e.target.value)}
          placeholder="Runner"
          className="justify-self-end"
        />
      </div>
      <RunTable participants={participants} runner={runner} />
    </div>
  );
}
