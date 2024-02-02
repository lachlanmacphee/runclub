import { usePocket } from "@/contexts";

// Components
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

export function AvatarIconModal() {
  const { user } = usePocket();

  if (!user) return null;

  const name = user.name.replace(" ", "+");
  const userInitialsAvatar = `https://ui-avatars.com/api/?name=${name}`;

  return (
    <Link to="/account">
      <Avatar>
        <AvatarImage src={userInitialsAvatar} />
      </Avatar>
    </Link>
  );
}
