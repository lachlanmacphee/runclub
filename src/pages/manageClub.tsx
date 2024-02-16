import { Announcements } from "@/components/manage/announcementsForm";
import { ClubNameForm } from "@/components/manage/clubNameForm";
import { EmergencyContactSearch } from "@/components/manage/emergencyContactSearch";
import { JudgeRoleRequests } from "@/components/manage/judgeRoleRequests";

export function ManageClub() {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col grow gap-8 max-w-3xl">
        <ClubNameForm />
        <Announcements />
        <JudgeRoleRequests />
        <EmergencyContactSearch />
      </div>
    </div>
  );
}
