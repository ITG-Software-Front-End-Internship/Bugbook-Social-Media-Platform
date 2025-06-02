import Error from "next/error";
import { toast } from "sonner";

export const onErrorCreatePostMutation = (error: Error) => {
  console.error(error);
  toast.error("Faild to post !", {
    description: "Faild to post. Please try again",
  });
};
