"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { postEditorTranslations } from "@/lib/translationKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import submitPost from "../actions";
import { onErrorCreatePostMutation } from "./helpers/onErrorCreatePostMutation";
import { onSuccessCreatePostMutation } from "./helpers/onSuccessCreatePostMutation";

export function useCreatePostMutation() {
  const queryClient = useQueryClient();
  const { user } = useSession();
  const t = useTranslations();

  const onSuccessCreatePostMessages = {
    title: t(postEditorTranslations.postCreate.success.title),
    description: t(postEditorTranslations.postCreate.success.description),
  };

  const onErrorCreatePostMessages = {
    title: t(postEditorTranslations.postCreate.failed.title),
    description: t(postEditorTranslations.postCreate.failed.description),
  };

  const mutation = useMutation({
    mutationFn: submitPost,
    onSuccess: (newPost) =>
      onSuccessCreatePostMutation({
        queryClient,
        newPost,
        userId: user.id,
        onSuccessCreatePostMessages,
      }),
    onError: (error) =>
      onErrorCreatePostMutation({ error, onErrorCreatePostMessages }),
  });

  return mutation;
}
