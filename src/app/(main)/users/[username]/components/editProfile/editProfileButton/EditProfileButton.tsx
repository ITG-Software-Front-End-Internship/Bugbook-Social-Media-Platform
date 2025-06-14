"use client";

import { Button } from "@/components/ui/button";
import { profileTranslations } from "@/lib/translationKeys";
import { UserData } from "@/lib/types";
import { useTranslations } from "next-intl";
import { useState } from "react";
import EditProfileDialog from "../editProfileDialog/EditProfileDialog";

interface EditProfileButtonProps {
  user: UserData;
}

export default function EditProfileButton({ user }: EditProfileButtonProps) {
  console.log(`EditProfileButton render ...`);

  const [showDialog, setShowDialog] = useState(false);
  const t = useTranslations();

  return (
    <>
      <Button variant="outline" onClick={() => setShowDialog(true)}>
        {t(profileTranslations.edit.title)}
      </Button>
      <EditProfileDialog
        user={user}
        isOpen={showDialog}
        onOpenChange={setShowDialog}
      />
    </>
  );
}
