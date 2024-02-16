import { useCallback, useEffect, useState } from "react";

import { usePocket } from "@/contexts";
import { getTuesdaysForNext3Months } from "@/lib/utils";
import type { User, Volunteer } from "@/lib/types";

import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const tuesdaysForNext3Months: Date[] = getTuesdaysForNext3Months();

export function Volunteer() {
  const pocket = usePocket();
  const pb = pocket.pb;
  const user = pocket.user as User;

  const [isUpdating, setIsUpdating] = useState(false);

  const [volunteers, setVolunteers] = useState<{
    [key: string]: Volunteer[];
  }>({});

  const signUpToVolunteer = useCallback(
    async (run_date: Date, user_id: string) => {
      setIsUpdating(true);

      const res = await pb.collection("volunteers").getFullList({
        filter: pb.filter("run_date = {:run_date}", {
          run_date,
        }),
      });

      if (res.length == 2) {
        toast({
          title: "Volunteer Signup Failed",
          variant: "destructive",
          duration: 5000,
          description:
            "There are already 2 volunteers signed up for this run. Please refresh the page to get the latest data",
        });
        return;
      }

      await pb.collection("volunteers").create({ run_date, user_id });
      setIsUpdating(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const optOutOfVolunteering = useCallback(
    async (run_date: Date, user_id: string) => {
      setIsUpdating(true);
      const res = await pb.collection("volunteers").getFirstListItem(
        pb.filter("run_date = {:run_date} && user_id = {:user_id}", {
          run_date,
          user_id,
        })
      );
      await pb.collection("volunteers").delete(res.id);
      setIsUpdating(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const fetchVolunteers = useCallback(async () => {
    const resVolunteers: Volunteer[] = await pb
      .collection("volunteers")
      .getFullList({
        filter: pb.filter("run_date >= {:minDate} && run_date <= {:maxDate}", {
          minDate: tuesdaysForNext3Months[0],
          maxDate: tuesdaysForNext3Months[tuesdaysForNext3Months.length - 1],
        }),
        expand: "user_id",
      });
    const tempVolunteers: { [key: string]: Volunteer[] } = {};
    resVolunteers.map((volunteer) => {
      const dateStr = new Date(volunteer.run_date).toISOString();
      tempVolunteers[dateStr] = [...(tempVolunteers[dateStr] ?? []), volunteer];
    });
    setVolunteers(tempVolunteers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchVolunteers();
    pb.collection("volunteers").subscribe("*", fetchVolunteers);
    return () => {
      pb.collection("volunteers").unsubscribe("*");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-4 max-w-3xl">
        <div className="grid grid-cols-4 gap-4 font-bold">
          <p>Date</p>
          <p className="col-start-2 col-end-5">Volunteers</p>
        </div>
        {tuesdaysForNext3Months.map((date) => {
          const arr = volunteers[date.toISOString()];

          let volunteerOne: Volunteer | undefined;
          let volunteerTwo: Volunteer | undefined;
          let volunteerThree: Volunteer | undefined;

          if (arr) {
            volunteerOne = arr[0];
            volunteerTwo = arr[1];
            volunteerThree = arr[2];
          }

          const exVolunteerOne = volunteerOne?.expand?.user_id;
          const exVolunteerTwo = volunteerTwo?.expand?.user_id;
          const exVolunteerThree = volunteerThree?.expand?.user_id;

          const volunteerOneName = exVolunteerOne?.alias
            ? exVolunteerOne?.alias
            : exVolunteerOne?.name ?? "Volunteer";
          const volunteerTwoName = exVolunteerTwo?.alias
            ? exVolunteerTwo?.alias
            : exVolunteerTwo?.name ?? "Volunteer";
          const volunteerThreeName = exVolunteerThree?.alias
            ? exVolunteerThree?.alias
            : exVolunteerThree?.name ?? "Volunteer";

          const isAlreadyVolunteer = [
            exVolunteerOne?.id,
            exVolunteerTwo?.id,
            exVolunteerThree?.id,
          ].includes(user.id);

          const volunteerOneDisabled =
            isUpdating ||
            (exVolunteerOne && exVolunteerOne.id !== user.id) ||
            (isAlreadyVolunteer && exVolunteerOne?.id !== user.id);

          const volunteerTwoDisabled =
            isUpdating ||
            (exVolunteerTwo && exVolunteerTwo.id !== user.id) ||
            (isAlreadyVolunteer && exVolunteerTwo?.id !== user.id);

          const volunteerThreeDisabled =
            isUpdating ||
            (exVolunteerThree && exVolunteerThree.id !== user.id) ||
            (isAlreadyVolunteer && exVolunteerThree?.id !== user.id);

          return (
            <div
              key={date.toISOString()}
              className="grid grid-cols-4 gap-2 items-center min-h-[60px]"
            >
              <p className="text-sm sm:text-base">
                {date.toLocaleDateString("en-us", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <Button
                variant={
                  volunteerOne?.user_id === user.id ? "destructive" : "outline"
                }
                disabled={volunteerOneDisabled}
                onClick={() =>
                  volunteerOne?.user_id === user.id
                    ? optOutOfVolunteering(date, user.id)
                    : signUpToVolunteer(date, user.id)
                }
                className="h-full whitespace-normal"
              >
                {volunteerOneName}
              </Button>
              <Button
                variant={
                  volunteerTwo?.user_id === user.id ? "destructive" : "outline"
                }
                disabled={volunteerTwoDisabled}
                onClick={() =>
                  volunteerTwo?.user_id === user.id
                    ? optOutOfVolunteering(date, user.id)
                    : signUpToVolunteer(date, user.id)
                }
                className="h-full whitespace-normal"
              >
                {volunteerTwoName}
              </Button>
              <Button
                variant={
                  volunteerThree?.user_id === user.id
                    ? "destructive"
                    : "outline"
                }
                disabled={volunteerThreeDisabled}
                onClick={() =>
                  volunteerThree?.user_id === user.id
                    ? optOutOfVolunteering(date, user.id)
                    : signUpToVolunteer(date, user.id)
                }
                className="h-full whitespace-normal"
              >
                {volunteerThreeName}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
