import { usePocket } from "@/contexts";

// Components
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export function AvatarIconModal() {
  const { user } = usePocket();

  if (!user) return null;

  const name = user.name.replace(" ", "+");
  const userInitialsAvatar = `https://ui-avatars.com/api/?name=${name}`;

  return (
    <Avatar>
      <AvatarImage src={userInitialsAvatar} />
    </Avatar>
  );
}
