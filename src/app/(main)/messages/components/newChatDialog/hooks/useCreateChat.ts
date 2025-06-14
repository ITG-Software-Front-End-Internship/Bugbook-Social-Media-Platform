import { chatTranslations } from "@/lib/translationKeys";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Channel, StreamChat, UserResponse } from "stream-chat";

interface UseCreateChatProps {
  client: StreamChat;
  loggedInUserId: string;
  selectedUsers: UserResponse[];
  setActiveChannel: (newChannel?: Channel) => void;
  onChatCreated: () => void;
}

/**
 * Not mandatory but since mutation provides use with req statuses isLoading, isError ..... it consider beneficial
 */

export function useCreateChat({
  client,
  loggedInUserId,
  selectedUsers,
  setActiveChannel,
  onChatCreated,
}: UseCreateChatProps) {
  const t = useTranslations();

  const newChatmutation = useMutation({
    mutationFn: async () => {
      const creatorId = loggedInUserId;
      const selectedUserIds = selectedUsers.map((user) => user.id);
      const allMemberIds = [creatorId, ...selectedUserIds];

      const channel = client.channel("messaging", null, {
        members: allMemberIds,
      });

      await channel.create();

      return channel;
    },
    onSuccess(channel) {
      setActiveChannel(channel);
      onChatCreated();
    },
    onError(error) {
      console.error("Error starting chat ...", error);
      toast.error(t(chatTranslations.newChat.error.title), {
        description: t(chatTranslations.newChat.error.description),
      });
    },
  });

  return newChatmutation;
}
