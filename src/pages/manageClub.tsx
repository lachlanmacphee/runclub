import { Announcements } from "@/components/manage/announcementsForm";
import { EmergencyContactSearch } from "@/components/manage/emergencyContactSearch";
import { JudgeRoleRequests } from "@/components/manage/judgeRoleRequests";
import { LinkWaiverToUser } from "@/components/manage/linkWaiverToUser";

export function ManageClub() {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col grow gap-16 max-w-3xl">
        <Announcements />
        <JudgeRoleRequests />
        <LinkWaiverToUser />
        <EmergencyContactSearch />
      </div>
    </div>
  );
}
