import { profileTranslations } from "@/lib/translationKeys";
import { useUploadThing } from "@/lib/uploadthing";
import { UpdateUserProfileValues } from "@/lib/validations";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { handleUpdateProfileError } from "../helpers/handleUpdateProfileError";
import { handleUpdateProfileOptimisticUpdate } from "../helpers/handleUpdateProfileOptimisticUpdate";
import { submitUserProfileChanges } from "../services/submitUserProfileChanges";

export function useUpdateProfileMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations();
  const { startUpload: startAvatarUpload } = useUploadThing("avatar");

  const updateProfileMutation = useMutation({
    mutationFn: async ({
      values: userProfileValues,
      avatar,
    }: {
      values: UpdateUserProfileValues;
      avatar?: File;
    }) =>
      submitUserProfileChanges({
        values: userProfileValues,
        avatar,
        startAvatarUpload,
      }),
    async onSuccess([updatedUser, uploadResult]) {
      const newAvatarUrl = uploadResult?.[0].serverData.newAvatarUrl;

      const updateProfileSuccessMessages = {
        title: t(profileTranslations.edit.success.title),
        description: t(profileTranslations.edit.success.description),
      } as const;

      handleUpdateProfileOptimisticUpdate({
        queryClient,
        router,
        newAvatarUrl,
        updatedUser,
        updateProfileSuccessMessages,
      });
    },
    onError(error) {
      const updateProfileErrorMessages = {
        title: t(profileTranslations.edit.failed.title),
        description: t(profileTranslations.edit.failed.description),
      } as const;

      handleUpdateProfileError({
        error,
        updateProfileErrorMessages,
      });
    },
  });

  return updateProfileMutation;
}
