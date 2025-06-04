"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import LoadingButton from "@/components/customComponents/LoadingButton";
import UserAvatar from "@/components/customComponents/UserAvatar";
import { MAX_ATTACHMENT_NUMBER } from "@/lib/constants";
import { postEditorTranslations } from "@/lib/translationKeys";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { memo, useCallback, useEffect, useRef } from "react";
import AddAttachmentButton from "./components/AddAttachmentButton";
import AttachmentPreviews from "./components/AttachmentPreviews";
import EditorLoadingSkeleton from "./components/EditorLoadingSkeleton";
import PostEditorContent from "./components/PostEditorContent";
import useMediaUpload from "./hooks/useMediaUpload";
import usePostEditor from "./hooks/usePostEditor";
import { useCreatePostMutation } from "./mutations/useCreatePostMutation";
import "./styles.css";

function PostEditor() {
  console.log(`post editor render ...`);

  const { editor: postEditor, input: postText } = usePostEditor();
  const t = useTranslations();
  const { user } = useSession();
  const { mutate: createPostMutate, isPending } = useCreatePostMutation();
  const {
    startUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset: resetMediaUploads,
  } = useMediaUpload();

  const postTextRef = useRef(postText);

  useEffect(() => {
    postTextRef.current = postText;
  }, [postText]);

  const commandsRef = useRef(postEditor?.commands);

  useEffect(() => {
    commandsRef.current = postEditor?.commands;
  }, [postEditor?.commands]);

  const onPostSubmit = useCallback(async () => {
    console.log(`onPostSubmit ...`);

    const mediaIds: string[] = attachments
      .map((attachment) => attachment.mediaId)
      .filter(Boolean) as string[];

    createPostMutate(
      {
        content: postTextRef.current,
        mediaIds: mediaIds,
      },
      {
        onSuccess: () => {
          commandsRef.current?.clearContent();
          resetMediaUploads();
        },
      },
    );
  }, [attachments, resetMediaUploads, createPostMutate]);

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex items-center gap-5">
        <UserAvatar avatarUrl={user.avatarUrl} className="hidden sm:inline" />
        {postEditor ? (
          <PostEditorContent editor={postEditor} startUpload={startUpload} />
        ) : (
          <EditorLoadingSkeleton />
        )}
      </div>
      {!!attachments.length && (
        <AttachmentPreviews
          attachments={attachments}
          removeAttachment={removeAttachment}
        />
      )}
      <div className="flex items-center justify-end gap-3">
        {isUploading && (
          <>
            <span className="text-sm"> {uploadProgress ?? 0}%</span>
            <Loader2 className="size-5 animate-spin text-primary" />
          </>
        )}
        <AddAttachmentButton
          onFilesSelected={startUpload}
          disabled={isUploading || attachments.length >= MAX_ATTACHMENT_NUMBER}
        />
        <LoadingButton
          isLoading={isPending}
          onClick={onPostSubmit || isUploading}
          disabled={!postTextRef.current.trim()}
          className="min-w-20 select-none"
        >
          {t(postEditorTranslations.post)}
        </LoadingButton>
      </div>
    </div>
  );
}

export default memo(PostEditor);
