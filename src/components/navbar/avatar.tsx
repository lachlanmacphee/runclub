import { usePocket } from "@/contexts";

// Components
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export function AvatarIconModal() {
  const { pb, user } = usePocket();

  if (!user) return null;

  return (
    <Avatar>
      <AvatarImage src={pb.files.getUrl(user, user.avatar)} />
    </Avatar>
  );
}
