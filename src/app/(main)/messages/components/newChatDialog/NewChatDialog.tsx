"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import LoadingButton from "@/components/customComponents/LoadingButton";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useDebounce from "@/hooks/useDebounce";
import { useLocaleSettings } from "@/hooks/useLocaleSettings";
import { chatTranslations } from "@/lib/translationKeys";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { UserResponse } from "stream-chat";
import { useChatContext } from "stream-chat-react";
import UserSelector from "./components/UserSelector";
import { useCreateChat } from "./hooks/useCreateChat";
import { useFetchStreamUsersQuery } from "./hooks/useFetchStreamUsersQuery";

interface NewChatDialogProps {
  onOpenChange: (isOpen: boolean) => void;
  onChatCreated: () => void;
}

/**
 * Note: parent is a client component, so the child is implicitly a client component.
 */

export default function NewChatDialog({
  onOpenChange,
  onChatCreated,
}: NewChatDialogProps) {
  console.log(`New chat dialog render ...`);

  const t = useTranslations();
  const { client, setActiveChannel } = useChatContext();
  const { user: loggedInUser } = useSession();
  const [selectedUsers, setSelectedUsers] = useState<UserResponse[]>([]);

  const [searchInput, setSearchInput] = useState<string>("");
  const searchInputDebounced = useDebounce(searchInput);

  const {
    data: streamUsers,
    isFetching,
    isError,
    isSuccess,
  } = useFetchStreamUsersQuery({
    searchInputDebounced,
    loggedInUserId: loggedInUser.id,
    streamClientChat: client,
  });

  const { isPending, mutate: createNewChatMutate } = useCreateChat({
    client,
    loggedInUserId: loggedInUser.id,
    selectedUsers,
    setActiveChannel,
    onChatCreated,
  });
  const { direction } = useLocaleSettings();
  const alignDirection =
    direction === "rtl" ? "sm:justify-start" : "sm:justify-end";
  const textDirection = direction === "rtl" ? "sm:text-right" : "sm:text-left";

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="bg-card p-0" dir={direction}>
        <DialogHeader className={cn("px-6 pt-6", textDirection)}>
          <DialogTitle>{t(chatTranslations.newChat.title)}</DialogTitle>
          <DialogDescription>
            {t(chatTranslations.newChat.dialogDescription)}
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="group relative">
            <SearchIcon className="absolute left-5 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground group-focus-within:text-primary" />
            <input
              type="text"
              placeholder={t(chatTranslations.newChat.searchUsers)}
              className="h-12 w-full pe-4 ps-14 focus:outline-none"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <hr />
          <UserSelector
            selectedUsers={selectedUsers}
            isSuccess={isSuccess}
            streamUsers={streamUsers || []}
            isError={isError}
            isFetching={isFetching}
            setSelectedUsers={setSelectedUsers}
          />
        </div>
        <DialogFooter className={cn("px-6 pb-6", alignDirection)}>
          <LoadingButton
            disabled={!!selectedUsers.length}
            isLoading={isPending}
            onClick={() => createNewChatMutate()}
          >
            {t(chatTranslations.newChat.startChat)}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
