import { Link } from "react-router-dom";

// Components
import { DesktopNavMenu } from "./desktopNavMenu";
import { MobileNavMenu } from "./mobileNavMenu";
import { AvatarIconModal } from "./avatar";
import { ModeToggle } from "./mode-toggle";
import { LogInOut } from "./logInOut";
import { AnnouncementBanner } from "./announcementBanner";
import { useEffect, useState } from "react";
import { usePocket } from "@/contexts";
import { RecordModel } from "pocketbase";

const currentTime = Date.now();

export function Navbar() {
  const { pb } = usePocket();
  const [announcement, setAnnouncement] = useState<RecordModel | null>(null);

  useEffect(() => {
    async function fetchLatestAnnouncement() {
      const record = await pb.collection("announcements").getList(1, 1, {
        sort: "-created",
      });
      setAnnouncement(record.items[0]);
    }
    fetchLatestAnnouncement();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {announcement && currentTime <= announcement.endUnixTime && (
        <AnnouncementBanner
          icon={announcement.icon}
          message={announcement.message}
        />
      )}
      <div className="flex justify-between py-4 px-8 items-center">
        <Link to="/" className="normal-case font-bold text-2xl w-[250px]">
          <div className="flex gap-4 items-center">
            <img
              className="w-10 h-10 rounded-full"
              src="/android-chrome-512x512.png"
            />
            <span className="hidden md:block">Gunn Runners</span>
          </div>
        </Link>
        <DesktopNavMenu />
        <div className="flex gap-3 justify-end w-[250px]">
          <AvatarIconModal />
          <ModeToggle />
          <LogInOut />
          <MobileNavMenu />
        </div>
      </div>
    </>
  );
}
