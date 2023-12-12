import { AlertCircle } from "lucide-react";

const announcementText =
  "Christmas party this week! Please meet at the rotunda.";

export function AnnouncementBanner() {
  return (
    <div className="flex justify-center py-2 px-8 gap-2 bg-orange-400">
      <AlertCircle />
      <span>{announcementText}</span>
    </div>
  );
}
