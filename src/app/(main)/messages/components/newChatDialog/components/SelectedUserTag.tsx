import UserAvatar from "@/components/customComponents/user/userAvatar/UserAvatar";
import { X } from "lucide-react";
import { UserResponse } from "stream-chat";

interface SelectedUserTagProps {
  user: UserResponse;
  onRemove: () => void;
}

export default function SelectedUserTag({
  user,
  onRemove,
}: SelectedUserTagProps) {
  return (
    <button
      onClick={onRemove}
      className="flex items-center gap-2 rounded-full border p-1 hover:bg-muted/50"
    >
      <UserAvatar avatarUrl={user.image} size={24} />
      <p className="font-bold">{user.name}</p>
      <X className="mx-2 size-5 text-muted-foreground" />
    </button>
  );
}
