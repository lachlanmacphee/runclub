import { AnnouncementTypes, announcementMessages } from "@/lib/constants";
import { AlertCircle, Car, PartyPopper } from "lucide-react";

type AnnouncementBannerProps = {
  type: AnnouncementTypes;
  isPreview?: boolean;
};

function getIconForType(type: AnnouncementTypes) {
  switch (type) {
    case AnnouncementTypes.NoRun:
      return <AlertCircle />;
    case AnnouncementTypes.GrandPrix:
      return <Car />;
    case AnnouncementTypes.ChristmasParty:
      return <PartyPopper />;
  }
}

export function AnnouncementBanner({
  type,
  isPreview,
}: AnnouncementBannerProps) {
  return (
    <div
      className={`flex justify-center py-2 px-8 gap-2 bg-orange-400 text-white ${
        isPreview && "rounded-lg"
      }`}
    >
      {getIconForType(type)}
      <span>{announcementMessages[type]}</span>
    </div>
  );
}
