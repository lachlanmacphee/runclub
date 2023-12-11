import { ClubNameForm } from "@/components/manage/clubNameForm";

export function ManageClub() {
  return (
    <div className="flex flex-col gap-8">
      <ClubNameForm />
      <span>Edit Previous Runs</span>
    </div>
  );
}
