import { AlertCircle, Car, PartyPopper } from "lucide-react";

type AnnouncementBannerProps = {
  icon: string;
  message: string;
  isPreview?: boolean;
};

function getIcon(icon: string) {
  switch (icon) {
    case "Alert":
      return <AlertCircle />;
    case "Car":
      return <Car />;
    case "Party":
      return <PartyPopper />;
  }
}

export function AnnouncementBanner({
  icon,
  message,
  isPreview,
}: AnnouncementBannerProps) {
  return (
    <div
      className={`flex justify-center py-2 px-8 gap-2 bg-orange-400 text-white ${
        isPreview && "rounded-lg"
      }`}
    >
      {getIcon(icon)}
      <span>
        {isPreview && message === ""
          ? "Your message will appear here"
          : message}
      </span>
    </div>
  );
}
