import { UpdateUserProfileValues } from "@/lib/validations";
import { ClientUploadedFileData } from "uploadthing/types";
import { updateUserProfile } from "../../../../action";

type StartAvatarUploadReturnType = Promise<
  | ClientUploadedFileData<{
      newAvatarUrl: string;
    }>[]
  | undefined
>;

interface SubmitUserProfileChanges {
  values: UpdateUserProfileValues;
  avatar?: File;
  startAvatarUpload: (
    files: File[],
    input?: undefined,
  ) => StartAvatarUploadReturnType;
}

export function submitUserProfileChanges({
  values: userProfileValues,
  avatar,
  startAvatarUpload,
}: SubmitUserProfileChanges) {
  return Promise.all([
    updateUserProfile(userProfileValues),
    avatar && startAvatarUpload([avatar]),
  ]);
}
