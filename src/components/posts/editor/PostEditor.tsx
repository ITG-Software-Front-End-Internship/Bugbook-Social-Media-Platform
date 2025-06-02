"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import LoadingButton from "@/components/customComponents/LoadingButton";
import UserAvatar from "@/components/customComponents/UserAvatar";
import { Loader2 } from "lucide-react";
import AddAttachmentButton from "./components/AddAttachmentButton";
import { AttachmentPreviews } from "./components/AttachmentPreviews";
import PostEditorContent from "./components/PostEditorContent";
import usePostEditor from "./hooks/usePostEditor";
import { useSubmitFormMutation } from "./mutations";
import "./styles.css";
import useMediaUpload from "./useMediaUpload";

export default function PostEditor() {
  const { user } = useSession();
  const submitFormMutation = useSubmitFormMutation();
  const {
    startUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset: resetMediaUploads,
  } = useMediaUpload();
  const { editor: postEditor, input } = usePostEditor();

  async function onSubmit() {
    submitFormMutation.mutate(
      {
        content: input,
        mediaIds: attachments
          .map((attachment) => attachment.mediaId)
          .filter(Boolean) as string[],
      },
      {
        onSuccess: () => {
          postEditor?.commands.clearContent();
          resetMediaUploads();
        },
      },
    );
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex items-center gap-5">
        <UserAvatar avatarUrl={user.avatarUrl} className="hidden sm:inline" />
        <PostEditorContent editor={postEditor} startUpload={startUpload} />
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
          disabled={isUploading || attachments.length >= 5}
        />
        <LoadingButton
          isLoading={submitFormMutation.isPending}
          onClick={onSubmit || isUploading}
          disabled={!input.trim()}
          className="min-w-20 select-none"
        >
          Post
        </LoadingButton>
      </div>
    </div>
  );
}
