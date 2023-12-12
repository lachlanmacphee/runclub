import { Announcements } from "@/components/manage/announcementsForm";
import { ClubNameForm } from "@/components/manage/clubNameForm";

export function ManageClub() {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-8 w-[48rem]">
        <ClubNameForm />
        <Announcements />
      </div>
    </div>
  );
}
