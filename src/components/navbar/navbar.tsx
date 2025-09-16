import { Link } from "react-router-dom";

// Components
import { DesktopNavMenu } from "./desktopNavMenu";
import { MobileNavMenu } from "./mobileNavMenu";
import { AvatarIconModal } from "./avatar";
import { ModeToggle } from "./mode-toggle";
import { LogInOut } from "./logInOut";
import { AnnouncementBanner } from "./announcementBanner";
import { useCallback, useEffect, useState } from "react";
import { usePocket } from "@/contexts";
import { RecordModel } from "pocketbase";
import { ROLES } from "@/lib/constants";

const currentTime = Date.now();

export function Navbar() {
  const { user, pb } = usePocket();
  const [isPendingRoleRequest, setIsPendingRoleRequest] =
    useState<boolean>(false);
  const [announcement, setAnnouncement] = useState<RecordModel | null>(null);

  const fetchLatestAnnouncement = useCallback(async () => {
    const record = await pb.collection("announcements").getList(1, 1, {
      sort: "-created",
    });
    const latestAnnouncement = record.items[0];
    
    // Check if this announcement was already closed
    if (latestAnnouncement) {
      const closedAnnouncementId = localStorage.getItem('closedAnnouncementId');
      if (closedAnnouncementId !== latestAnnouncement.id) {
        setAnnouncement(latestAnnouncement);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRoleRequests = useCallback(async () => {
    const record = await pb.collection("role_requests").getList(1, 1);
    if (record?.items?.length > 0) {
      setIsPendingRoleRequest(true);
      return;
    }
    setIsPendingRoleRequest(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchLatestAnnouncement();
    if (user && user.role == ROLES.ADMIN) {
      fetchRoleRequests();
      pb.collection("role_requests").subscribe("*", fetchRoleRequests);
    }
    return () => {
      pb.collection("role_requests").unsubscribe("*");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const notifications = isPendingRoleRequest ? ["Manage"] : [];

  return (
    <>
      {announcement && currentTime <= announcement.endUnixTime && (
        <AnnouncementBanner
          icon={announcement.icon}
          message={announcement.message}
          announcementId={announcement.id}
        />
      )}
      <div className="flex justify-between py-4 px-8 items-center">
        <Link
          aria-label="Back to home page"
          to="/"
          className="normal-case font-bold text-2xl w-[250px]"
        >
          <img
            alt="Gunn Runners Logo. It has a blue circle, with a red inner circle, and a swan in the very centre. The Gunn Runners text is curved on the top and bottom of the red circle."
            className="w-10 h-10 rounded-full"
            src="/android-chrome-512x512.png"
          />
        </Link>
        <DesktopNavMenu notifications={notifications} />
        <div className="flex gap-2 justify-end w-[250px]">
          <AvatarIconModal />
          <ModeToggle />
          <LogInOut />
          <MobileNavMenu notifications={notifications} />
        </div>
      </div>
    </>
  );
}
