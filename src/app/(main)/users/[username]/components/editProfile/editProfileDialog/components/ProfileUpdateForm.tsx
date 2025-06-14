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
import {
  profileTranslations,
  validationsMessages,
} from "@/lib/translationKeys";
import {
  getUpdateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useUpdateProfileMutation } from "../hooks/useUpdateProfileMutation";
import avatarPlaceHolder from "./../../../../../../../../assets/avatar-placeholder.png";
import AvatarInput from "./AvatarInput";

interface ProfileUpdateFormProps {
  userId: string;
  userDisplayName: string;
  userBio: string | null;
  userAvatarUrl: string | null;
  updateProfileMutation: ReturnType<typeof useUpdateProfileMutation>["mutate"];
  onOpenChange: (open: boolean) => void;
}

export default function ProfileUpdateForm({
  userId,
  userDisplayName,
  userBio,
  userAvatarUrl,
  updateProfileMutation,
  onOpenChange,
}: ProfileUpdateFormProps) {
  console.log(`Edit profile form ....`);

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
      displayName: userDisplayName,
      bio: userBio || "",
    },
  });

  const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>(null);

  async function onSubmit(values: UpdateUserProfileValues) {
    console.log(`On Submit form .... `);

    const newAvatarFile = croppedAvatar
      ? new File([croppedAvatar], `avatar_${userId}.webp`)
      : undefined;

    console.log(`newAvatarFile,`, newAvatarFile);

    updateProfileMutation(
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
    <>
      <div className="space-y-1.5">
        <Label>{t(profileTranslations.edit.user.avatar.title)}</Label>
        <AvatarInput
          src={
            croppedAvatar
              ? URL.createObjectURL(croppedAvatar)
              : userAvatarUrl || avatarPlaceHolder
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
                  <FormLabel>
                    {t(profileTranslations.edit.user.displayName.title)}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        profileTranslations.edit.user.displayName.placeholder,
                      )}
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
                  <FormLabel>
                    {t(profileTranslations.edit.user.bio.title)}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t(
                        profileTranslations.edit.user.bio.placeholder,
                      )}
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
        </form>
      </Form>
    </>
  );
}
