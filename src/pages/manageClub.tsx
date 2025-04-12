import { Announcements } from "@/components/manage/announcementsForm";
import { EmergencyContactSearch } from "@/components/manage/emergencyContactSearch";
import { JudgeRoleRequests } from "@/components/manage/judgeRoleRequests";
import { LinkWaiverToUser } from "@/components/manage/linkWaiverToUser";
import { DemoteAdmins } from "@/components/manage/demoteAdmins";

export function ManageClub() {
  return (
    <div className="flex flex-col gap-16">
      <Announcements />
      <JudgeRoleRequests />
      <LinkWaiverToUser />
      <EmergencyContactSearch />
      <DemoteAdmins />
    </div>
  );
}
