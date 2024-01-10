import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dispatch, SetStateAction, useState } from "react";

export function DatePicker({
  date,
  setDate,
}: {
  date: Date | null;
  setDate: Dispatch<SetStateAction<Date | null>>;
}) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  return (
    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {date && (
          <Calendar
            mode="single"
            selected={date}
            onDayClick={(newDate) => {
              setDate(newDate);
              setCalendarOpen(false);
            }}
            initialFocus
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
