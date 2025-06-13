"use client";

import { Button } from "@/components/ui/button";
import { chatTranslations } from "@/lib/translationKeys";
import { MailPlus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import NewChatDialog from "../../newChatDialog/NewChatDialog";

interface MenuHeaderProps {
  onClose: () => void;
}

export default function MenuHeader({ onClose }: MenuHeaderProps) {
  const [showNewChatDialog, setShowNewChatDialog] = useState<boolean>(false);

  const t = useTranslations();

  return (
    <>
      <div className="flex items-center gap-3 p-2">
        <div className="h-full md:hidden">
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>
        <h1 className="me-auto text-xl font-bold md:ms-2">
          {t(chatTranslations.messages.title)}
        </h1>
        <Button
          size="icon"
          variant="ghost"
          title={t(chatTranslations.messages.newChat.start)}
          onClick={() => setShowNewChatDialog(true)}
        >
          <MailPlus className="size-5" />
        </Button>
      </div>
      {showNewChatDialog && (
        <NewChatDialog
          onOpenChange={setShowNewChatDialog}
          onChatCreated={() => {
            setShowNewChatDialog(false);
            onClose();
          }}
        />
      )}
    </>
  );
}
