import { useEffect, useState } from "react";

import { RunDetails } from "@/lib/types";

import { RunTable } from "@/components/runs/runTable";
import { DatePicker } from "@/components/ui/date-picker";

import { Loader2 } from "lucide-react";
import { usePastRuns } from "@/hooks/usePastRuns";
import { format } from "date-fns";
import { usePocket } from "@/contexts";
import { ROLES } from "@/lib/constants";
import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";

export function Runs() {
  const { user } = usePocket();
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
          <div className="flex gap-4">
            <DatePicker date={date} setDate={dateChangeHandler} />
            {user?.role == ROLES.ADMIN && runDetails?.run.id && (
              <Link
                to={`/runs/${runDetails.run.id}/edit`}
                className={buttonVariants({ variant: "default" })}
              >
                Edit Run
              </Link>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center md:items-end justify-center ">
          <h1 className="text-xl font-bold">
            {date && format(date, "do 'of' MMMM")}
          </h1>
          {!isLoading && runDetails && <h2>{runDetails.location}</h2>}
        </div>
      </div>
      {isLoading && (
        <div className="flex justify-center">
          <Loader2 className="h-12 w-12 animate-spin" />
        </div>
      )}
      {!isLoading && !runDetails && (
        <>
          <h2 className="text-xl font-bold">5km</h2>
          <RunTable participants={[]} />
          <h2 className="text-xl font-bold">3.5km</h2>
          <RunTable participants={[]} />
        </>
      )}
      {!isLoading && runDetails && (
        <>
          {runDetails.run.conditions && <p>{runDetails.run.conditions}</p>}
          <p>{runDetails.description}</p>
          <h2 className="text-xl font-bold">5km</h2>
          <RunTable participants={runDetails.fiveKmParticipants} />
          <h2 className="text-xl font-bold">3.5km</h2>
          <RunTable participants={runDetails.threeKmParticipants} />
        </>
      )}
    </div>
  );
}
