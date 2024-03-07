import { usePocket } from "@/contexts";
import type { Volunteer } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { AdminAddVolunteer } from "@/components/volunteer/adminAddVolunteer";
import { getTuesdaysForNext3Months } from "@/lib/utils";
import { useVolunteers } from "@/hooks/useVolunteers";
import { Navigate } from "react-router-dom";

const tuesdaysForNext3Months: Date[] = getTuesdaysForNext3Months();
const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const requiredTimeZone = "Australia/Melbourne";

export function Volunteer() {
  const { user } = usePocket();
  const { signUp, optOut, volunteers, isUpdating } = useVolunteers();

  if (!user) return <Navigate to="/" replace />;

  if (currentTimeZone !== requiredTimeZone)
    return (
      <p>
        For now, this page only works in the Australia/Melbourne time zone. If
        you are overseas, please ask a committee member to add you as a
        volunteer.
      </p>
    );

  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-4 max-w-3xl">
        {user.role == "admin" && <AdminAddVolunteer />}
        <div className="grid grid-cols-4 gap-4 font-bold">
          <p>Date</p>
          <p className="col-start-2 col-end-5">Volunteers</p>
        </div>
        {tuesdaysForNext3Months.map((date) => {
          const curVolunteers: (Volunteer | undefined)[] = Array.from({
            ...volunteers[date.toLocaleDateString("en-AU")],
            length: 3,
          });

          const isAlreadyVolunteer =
            curVolunteers.findIndex((vol) => vol?.user_id == user.id) > -1;

          return (
            <div
              key={date.toLocaleDateString("en-AU")}
              className="grid grid-cols-4 gap-2 items-center min-h-[60px]"
            >
              <p className="text-sm sm:text-base">
                {date.toLocaleDateString("en-us", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
              {curVolunteers.map((vol, idx) => {
                const volDisabled =
                  isUpdating ||
                  (vol && vol.user_id !== user.id) ||
                  (isAlreadyVolunteer && vol?.user_id !== user.id);
                return (
                  <Button
                    key={date.toDateString() + idx.toString()}
                    variant={
                      vol?.user_id === user.id ? "destructive" : "outline"
                    }
                    disabled={volDisabled}
                    onClick={() =>
                      vol?.user_id === user.id
                        ? optOut(vol.id)
                        : signUp(date, user.id)
                    }
                    className="h-full whitespace-normal"
                  >
                    {vol
                      ? vol.expand.user_id?.name ??
                        vol.expand.waiver_id?.fname +
                          " " +
                          vol.expand.waiver_id?.lname ??
                        "Volunteer"
                      : "Volunteer"}
                  </Button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
