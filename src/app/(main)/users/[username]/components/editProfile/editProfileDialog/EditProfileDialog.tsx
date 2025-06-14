"use client";

import LoadingButton from "@/components/customComponents/LoadingButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocaleSettings } from "@/hooks/useLocaleSettings";
import { profileTranslations } from "@/lib/translationKeys";
import { UserData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import ProfileUpdateForm from "./components/ProfileUpdateForm";
import { useUpdateProfileMutation } from "./hooks/useUpdateProfileMutation";
interface EditProfileDialogProps {
  user: UserData;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditProfileDialog({
  user,
  isOpen,
  onOpenChange,
}: EditProfileDialogProps) {
  console.log(`Edit profile dialog ...`);

  const t = useTranslations();

  const { mutate: updateProfileMutation, isPending } =
    useUpdateProfileMutation();

  const { direction } = useLocaleSettings();
  const aligningDirection =
    direction === "rtl" ? "sm:justify-start" : "sm:justify-end";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={aligningDirection} dir={direction}>
        <DialogHeader>
          <DialogTitle
            className={cn(direction === "rtl" ? "text-right" : "text-left")}
          >
            {t(profileTranslations.edit.title)}
          </DialogTitle>
          <DialogDescription>
            {t(profileTranslations.edit.description)}
          </DialogDescription>
        </DialogHeader>
        <ProfileUpdateForm
          userId={user.id}
          userBio={user.bio}
          userAvatarUrl={user.avatarUrl}
          userDisplayName={user.displayName}
          updateProfileMutation={updateProfileMutation}
          onOpenChange={onOpenChange}
        />
        <DialogFooter className={aligningDirection}>
          <LoadingButton isLoading={isPending} type="submit">
            {t(profileTranslations.edit.save)}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
