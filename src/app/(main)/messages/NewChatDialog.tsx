"use client";

import LoadingButton from "@/components/customComponents/LoadingButton";
import UserAvatar from "@/components/customComponents/UserAvatar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useDebounce from "@/hooks/useDebounce";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, Loader2, SearchIcon, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { UserResponse } from "stream-chat";
import { useChatContext } from "stream-chat-react";
import { useSession } from "../SessionProvider";

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
  const { client, setActiveChannel } = useChatContext();

  const { user: loggedInUser } = useSession();

  const [searchInput, setSearchInput] = useState<string>("");

  const searchInputDebounced = useDebounce(searchInput);

  const [selectedUsers, setSelectedUsers] = useState<UserResponse[]>([]);

  /**
   * We want to wrap them in react query so they are cached (fetched data from 3rd part library).
   
  * This is good when we search about user we get the result from cache immedaitely and also we avoid race conditions.
   */

  const { data, isFetching, isError, isSuccess } = useQuery({
    queryKey: ["stream-users", searchInputDebounced],
    queryFn: async () => {
      const response = await client.queryUsers(
        searchInputDebounced
          ? {
              $or: [
                /** Finds partial natures */
                { name: { $autocomplete: searchInputDebounced } },
                { username: { $autocomplete: searchInputDebounced } },
              ],
            }
          : {},
        { name: 1, username: 1 },
        { limit: 15 },
      );

      // Client-side filtering
      /** When u create a new stream chat app, there is an admin user created, and there no exist for this user in our app so we filtter it.  */

      return response.users.filter(
        (user) => user.id !== loggedInUser.id && user.role !== "admin",
      );
    },
  });

  /**
   * Not mandatory but since mutation provides use with req statuses isLoading, isError ..... it consider beneficial
   */

  const mutation = useMutation({
    mutationFn: async () => {
      const channel = client.channel("messaging", null, {
        /* name:
          selectedUsers.length > 1
            ? `${loggedInUser.displayName},${selectedUsers.map((u) => u.name).join(", ")}`
            : null,*/
        members: [loggedInUser.id, ...selectedUsers.map((user) => user.id)],
      });

      await channel.create();

      return channel;
    },
    onSuccess(channel) {
      setActiveChannel(channel);
      onChatCreated(); /** Closes the dialog */
    },
    onError(error) {
      console.error("Error starting chat ...", error);
      toast.error("Error starting chat", {
        description: "Error starting chat, please try again ...",
      });
    },
  });

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="bg-card p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>New chat</DialogTitle>
        </DialogHeader>
        <div>
          <div className="group relative">
            <SearchIcon className="absolute left-5 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground group-focus-within:text-primary" />
            <input
              type="text"
              placeholder="Seach users ..."
              className="h-12 w-full pe-4 ps-14 focus:outline-none"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <hr />
          {!!selectedUsers.length && (
            <div className="mt-4 flex flex-wrap gap-2 p-2">
              {selectedUsers.map((user) => {
                return (
                  <SelectedUserTag
                    key={user.id}
                    user={user}
                    onRemove={() => {
                      setSelectedUsers((prevState) =>
                        prevState.filter((u) => u.id !== user.id),
                      );
                    }}
                  />
                );
              })}
            </div>
          )}
          <div className="h-96 overflow-y-auto">
            {isSuccess &&
              data.map((user) => {
                return (
                  <UserResult
                    key={user.id}
                    user={user}
                    selected={selectedUsers.some((u) => u.id === user.id)}
                    onClick={() => {
                      setSelectedUsers((prevState) =>
                        prevState.some((u) => u.id === user.id)
                          ? prevState.filter((u) => u.id !== user.id)
                          : [...prevState, user],
                      );
                    }}
                  />
                );
              })}
            {isSuccess && !!data.length && (
              <p className="my-3 text-center text-muted-foreground">
                No users found. Try a different name.
              </p>
            )}
            {isFetching && <Loader2 className="mx-auto my-3 animate-spin" />}
            {isError && (
              <p className="my-3 text-center text-destructive">
                An error occurred while loading users.
              </p>
            )}
          </div>
        </div>
        <DialogFooter className="px-6 pb-6">
          <LoadingButton
            disabled={!!selectedUsers.length}
            isLoading={mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            Start chat
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface UserResultProps {
  user: UserResponse;
  selected: boolean;
  onClick: () => void;
}

function UserResult({ user, selected, onClick }: UserResultProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between px-4 py-2.5 transition-colors hover:bg-muted/50"
    >
      <div className="flex items-center gap-2">
        <UserAvatar avatarUrl={user.image} />
        <div className="flex flex-col text-start">
          <p className="font-bold">{user.name}</p>
          <p className="text-muted-foreground">@{user.username}</p>
        </div>
      </div>
      {selected && <Check className="size-5 text-green-500" />}
    </button>
  );
}

interface SelectedUserTagProps {
  user: UserResponse;
  onRemove: () => void;
}

function SelectedUserTag({ user, onRemove }: SelectedUserTagProps) {
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
