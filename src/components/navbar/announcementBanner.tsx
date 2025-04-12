import { AlertCircle, Car, PartyPopper, X } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

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
  const [isShowing, setIsShowing] = useState(true);

  if (!isPreview && !isShowing) {
    return;
  }

  return (
    <div
      className={`${
        !isPreview && "fixed bottom-0 left-0 z-10 w-full rounded-t-xl"
      } flex justify-between items-center py-2 pl-8 pr-4 ${
        icon == "Alert"
          ? "bg-red-500"
          : icon == "Party"
          ? "bg-green-600"
          : "bg-blue-600"
      } text-white ${isPreview && "rounded-lg"}`}
    >
      <div className="flex gap-2">
        {getIcon(icon)}
        <span>
          {isPreview && message === ""
            ? "Your message will appear here"
            : message}
        </span>
      </div>
      {!isPreview && (
        <Button variant="ghost" onClick={() => setIsShowing(false)}>
          <X />
        </Button>
      )}
    </div>
  );
}
