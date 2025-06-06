import { Navigate } from "react-router-dom";

import { usePocket } from "@/contexts";
import type { Volunteer } from "@/lib/types";
import { ROLES } from "@/lib/constants";

import { useVolunteers } from "@/hooks/useVolunteers";
import { useUpcomingTuesdays } from "@/hooks/useUpcomingTuesdays";

import { Button } from "@/components/ui/button";
import { AdminAddVolunteer } from "@/components/volunteer/adminAddVolunteer";
import { AdminRemoveVolunteer } from "@/components/volunteer/adminRemoveVolunteer";
import { Loader2 } from "lucide-react";

export function Volunteer() {
  const { user } = usePocket();
  const { tuesdays } = useUpcomingTuesdays();
  const { signUp, optOut, volunteers, isUpdating } = useVolunteers();

  if (!user) return <Navigate to="/" replace />;
  if (!tuesdays)
    return (
      <div className="flex justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );

  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-4 max-w-3xl">
        <div className="grid grid-cols-4 gap-4 items-center font-bold">
          <p>Date</p>
          {user.role == ROLES.ADMIN && (
            <div className="grid grid-cols-2 gap-4 col-start-2 col-end-5">
              <AdminRemoveVolunteer
                tuesdays={tuesdays}
                volunteers={volunteers}
              />
              <AdminAddVolunteer tuesdays={tuesdays} />
            </div>
          )}
        </div>
        {tuesdays.map((dateStr) => {
          const curVolunteers: (Volunteer | undefined)[] = Array.from({
            ...volunteers[dateStr],
            length: 3,
          });

          const isAlreadyVolunteer =
            curVolunteers.findIndex((vol) => vol?.user_id == user.id) > -1;

          return (
            <div
              key={dateStr}
              className="grid grid-cols-4 gap-2 items-center min-h-[60px]"
            >
              <p className="text-sm sm:text-base">
                {new Date(dateStr).toLocaleDateString("en-us", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
              {curVolunteers.map((vol, idx) => {
                const volDisabled =
                  isUpdating ||
                  // If the volunteer is not the logged in user
                  (vol && vol.user_id !== user.id) ||
                  // Cases where they have signed up for a week so can't add themselves again
                  (isAlreadyVolunteer && vol?.user_id !== user.id);
                return (
                  <Button
                    key={dateStr + idx.toString()}
                    variant={
                      vol?.user_id === user.id ? "destructive" : "outline"
                    }
                    disabled={volDisabled}
                    onClick={() =>
                      vol?.user_id === user.id
                        ? optOut(vol.id)
                        : signUp(dateStr, user.id)
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
