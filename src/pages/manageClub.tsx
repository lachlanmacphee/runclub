import { Announcements } from "@/components/manage/announcementsForm";
import { ClubNameForm } from "@/components/manage/clubNameForm";

export function ManageClub() {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-8 w-[48rem]">
        <ClubNameForm />
        <Announcements />
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-2xl">Edit Past Runs</h2>
          <p>
            To edit past runs, please click{" "}
            <a
              href="https://gunniesapp.fly.dev/_/"
              target="_blank"
              className="underline font-semibold"
            >
              here
            </a>{" "}
            to visit the Pocketbase GUI. You will need to modify records in the
            participant_runs collection.
          </p>
        </div>
      </div>
    </div>
  );
}
