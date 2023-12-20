import { useEffect, useState } from "react";

import { usePocket } from "@/contexts";
import { getTuesdaysForNext3Months } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { User } from "@/lib/types";

type Volunteer = {
  run_date: Date;
  user_id: string;
  expand: {
    user_id: {
      name: string;
    };
  };
};

const tuesdaysForNext3Months: Date[] = getTuesdaysForNext3Months();

export function Volunteer() {
  const pocket = usePocket();
  const pb = pocket.pb;
  const user = pocket.user as User;

  const [volunteers, setVolunteers] = useState<{
    [key: string]: Volunteer[];
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const signUpToVolunteer = async (run_date: Date, user_id: string) => {
    await pb.collection("volunteers").create({ run_date, user_id });
    const volunteer: Volunteer = {
      run_date,
      user_id,
      expand: { user_id: { name: user.name } },
    };
    const tempVolunteers = { ...volunteers };

    const exists = tempVolunteers[run_date.toISOString()];
    if (!exists) {
      tempVolunteers[run_date.toISOString()] = [volunteer];
    } else {
      tempVolunteers[run_date.toISOString()].push(volunteer);
    }
    setVolunteers(tempVolunteers);
  };

  const optOutOfVolunteering = async (run_date: Date, user_id: string) => {
    const res = await pb.collection("volunteers").getFirstListItem(
      pb.filter("run_date = {:run_date} && user_id = {:user_id}", {
        run_date,
        user_id,
      })
    );
    await pb.collection("volunteers").delete(res.id);
    const tempVolunteers = { ...volunteers };
    tempVolunteers[run_date.toISOString()] = tempVolunteers[
      run_date.toISOString()
    ].filter((volunteer) => volunteer.user_id !== user_id);
    setVolunteers(tempVolunteers);
  };

  useEffect(() => {
    const fetchVolunteers = async () => {
      setIsLoading(true);
      const resVolunteers: Volunteer[] = await pb
        .collection("volunteers")
        .getFullList({
          filter: pb.filter(
            "run_date >= {:minDate} && run_date <= {:maxDate}",
            {
              minDate: tuesdaysForNext3Months[0],
              maxDate:
                tuesdaysForNext3Months[tuesdaysForNext3Months.length - 1],
            }
          ),
          expand: "user_id",
        });
      const tempVolunteers: { [key: string]: Volunteer[] } = {};
      resVolunteers.map((volunteer) => {
        const exists =
          tempVolunteers[new Date(volunteer.run_date).toISOString()];
        if (!exists) {
          tempVolunteers[new Date(volunteer.run_date).toISOString()] = [
            volunteer,
          ];
        } else {
          tempVolunteers[new Date(volunteer.run_date).toISOString()].push(
            volunteer
          );
        }
      });
      setVolunteers(tempVolunteers);
      setIsLoading(false);
    };
    fetchVolunteers();
  }, [pb]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-2 w-10/12 max-w-3xl">
        <div className="grid grid-cols-3 gap-8 mb-2 font-bold">
          <p>Date</p>
          <p>Volunteer One</p>
          <p>Volunteer Two</p>
        </div>
        {tuesdaysForNext3Months.map((date) => {
          const arr = volunteers[date.toISOString()];

          let volunteerOne: Volunteer | undefined;
          let volunteerTwo: Volunteer | undefined;

          if (arr) {
            volunteerOne = arr[0];
            volunteerTwo = arr[1];
          }

          return (
            <div
              key={date.toISOString()}
              className="grid grid-cols-3 gap-8 items-center"
            >
              <p>{date.toLocaleDateString()}</p>
              <Button
                variant={
                  volunteerOne?.user_id === user.id ? "destructive" : "outline"
                }
                disabled={
                  volunteerTwo?.user_id === user.id ||
                  (volunteerOne?.user_id !== undefined &&
                    volunteerOne?.user_id !== user.id)
                }
                onClick={() =>
                  volunteerOne?.user_id === user.id
                    ? optOutOfVolunteering(date, user.id)
                    : signUpToVolunteer(date, user.id)
                }
              >
                {volunteerOne?.expand?.user_id.name ?? "Click to volunteer"}
              </Button>
              <Button
                variant={
                  volunteerTwo?.user_id === user.id ? "destructive" : "outline"
                }
                disabled={
                  volunteerOne?.user_id === user.id ||
                  (volunteerTwo?.user_id !== undefined &&
                    volunteerTwo?.user_id !== user.id)
                }
                onClick={() =>
                  volunteerTwo?.user_id === user.id
                    ? optOutOfVolunteering(date, user.id)
                    : signUpToVolunteer(date, user.id)
                }
              >
                {volunteerTwo?.expand?.user_id.name ?? "Click to volunteer"}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
