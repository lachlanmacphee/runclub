import { Announcements } from "@/components/manage/announcementsForm";
import { ClubNameForm } from "@/components/manage/clubNameForm";
import { EmergencyContactSearch } from "@/components/manage/emergencyContactSearch";

export function ManageClub() {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col grow gap-8 max-w-3xl">
        <EmergencyContactSearch />
        <ClubNameForm />
        <Announcements />
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-2xl">Edit User Roles & Past Runs</h2>
          <p>
            To edit user roles and past runs, please click{" "}
            <a
              href="https://gunniesapp.fly.dev/_/"
              target="_blank"
              className="underline font-semibold"
            >
              here
            </a>{" "}
            to visit the Pocketbase GUI. You will need to modify records in the
            users and/or participant_runs collection.
          </p>
        </div>
      </div>
    </div>
  );
}
