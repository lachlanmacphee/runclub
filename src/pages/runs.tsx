import { useEffect, useState } from "react";

import { formatDateWithSuffix } from "@/lib/utils";
import { RunDetails } from "@/lib/types";

import { RunTable } from "@/components/runs/runTable";
import { DatePicker } from "@/components/ui/date-picker";

import { Loader2 } from "lucide-react";
import { usePastRuns } from "@/hooks/usePastRuns";

export function Runs() {
  const { fetchLatestRun, fetchRunFromDate } = usePastRuns();
  const [isLoading, setIsLoading] = useState(true);
  const [runDetails, setRunDetails] = useState<RunDetails>();
  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const newRunDetails = await fetchLatestRun();
      if (newRunDetails) {
        setRunDetails(newRunDetails);
        setDate(new Date(newRunDetails.run.date));
      } else {
        setRunDetails(undefined);
      }
      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dateChangeHandler = async (newDate: Date) => {
    setDate(newDate);
    setIsLoading(true);
    const newRunDetails = await fetchRunFromDate(newDate);
    if (newRunDetails) {
      setRunDetails(newRunDetails);
    } else {
      setRunDetails(undefined);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:gap-0 md:grid-cols-[0.5fr_1fr]">
        <div className="row-start-2 md:row-start-1">
          <DatePicker date={date} setDate={dateChangeHandler} />
        </div>
        <div className="flex flex-col items-center md:items-end justify-center ">
          <h1 className="text-xl font-bold">
            {date && formatDateWithSuffix(date)}
          </h1>
          {!isLoading && runDetails && <h2>{runDetails.location}</h2>}
        </div>
      </div>
      {isLoading && (
        <div className="flex justify-center">
          <Loader2 className="h-12 w-12 animate-spin" />
        </div>
      )}
      {!isLoading && !runDetails && <RunTable participants={[]} />}
      {!isLoading && runDetails && (
        <>
          {runDetails.run.conditions && <p>{runDetails.run.conditions}</p>}
          <p>{runDetails.description}</p>
          <RunTable participants={runDetails.participants} />
        </>
      )}
    </div>
  );
}
