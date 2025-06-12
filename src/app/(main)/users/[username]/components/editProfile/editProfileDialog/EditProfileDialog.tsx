"use client";

import avatarPlaceHolder from "@/assets/avatar-placeholder.png";
import LoadingButton from "@/components/customComponents/LoadingButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { validationsMessages } from "@/lib/translationKeys";
import { UserData } from "@/lib/types";
import {
  getUpdateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useUpdateProfileMutation } from "../../../mutations";
import AvatarInput from "./components/AvatarInput";

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

  const updateUserProfileSchemaMessages = {
    required: t(validationsMessages.required),
    maxLength: t(validationsMessages.displayName.maxLength),
  };

  const form = useForm<UpdateUserProfileValues>({
    resolver: zodResolver(
      getUpdateUserProfileSchema(updateUserProfileSchemaMessages),
    ),
    defaultValues: {
      displayName: user.displayName,
      bio: user.bio || "",
    },
  });

  const updateProfileMutation = useUpdateProfileMutation();

  const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>(null);

  async function onSubmit(values: UpdateUserProfileValues) {
    console.log(`On Submit form .... `);

    const newAvatarFile = croppedAvatar
      ? new File([croppedAvatar], `avatar_${user.id}.webp`)
      : undefined;

    console.log(`newAvatarFile,`, newAvatarFile);

    updateProfileMutation.mutate(
      {
        values,
        avatar: newAvatarFile,
      },
      {
        onSuccess(data, variables, context) {
          console.log("Update profile succeeded!", {
            data,
            variables,
            context,
          });
          setCroppedAvatar(null);
          onOpenChange(false);
        },
        onError(error, variables, context) {
          console.error("Update profile failed!", error, {
            variables,
            context,
          });
        },
      },
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Update your public profile information. Changes will be visible to
            others.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label>Avatar</Label>
          <AvatarInput
            src={
              croppedAvatar
                ? URL.createObjectURL(croppedAvatar)
                : user.avatarUrl || avatarPlaceHolder
            }
            onImageCropped={setCroppedAvatar}
          />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Display name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your display name here ..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a little bit about yourself"
                        {...field}
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <DialogFooter>
              <LoadingButton
                isLoading={updateProfileMutation.isPending}
                type="submit"
              >
                Save
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
