import { toast } from "sonner";

interface HandleUpdateProfileError {
  error: Error;
  updateProfileErrorMessages: { [key: string]: string };
}

export function handleUpdateProfileError({
  error,
  updateProfileErrorMessages,
}: HandleUpdateProfileError) {
  console.error(error);
  toast(updateProfileErrorMessages.title, {
    description: updateProfileErrorMessages.description,
  });
}
