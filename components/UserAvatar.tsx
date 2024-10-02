import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarImage } from "./ui/avatar";

const UserAvatar = () => {
  const { user } = useUser();

  return (
    <Avatar className="size-12">
      <AvatarImage src={user?.imageUrl} />
    </Avatar>
  );
};

export default UserAvatar;
