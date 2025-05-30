"use client";

import { Dialog, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import useDebounce from "@/hooks/useDebounce";
import { DialogContent } from "@radix-ui/react-dialog";
import { useState } from "react";
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

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="bg-card p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>New chat</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
