import { errorsMessages } from "@/lib/translationKeys";
import { useUploadThing } from "@/lib/uploadthing";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { generateUniqueFileName } from "../helpers/helpers";

const MAX_FILES_NUMBER = 5;

export interface Attachment {
  file: File;
  mediaId?: string;
  isUploading: boolean;
}

export default function useMediaUpload() {
  // attachmentes which we will show on UI
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>();
  const t = useTranslations();

  const { startUpload, isUploading } = useUploadThing("attachments", {
    onBeforeUploadBegin(files) {
      /* This will return a files with unique name, Files dont have a unique id.*/

      const uniqueNamedFiles = files.map((file) => {
        const fileExtension = file.name.split(",")[1];
        const newFileName = generateUniqueFileName(fileExtension);
        return new File([file], newFileName, {
          type: file.type,
        });
      });

      const uniqueNamedAttachment = uniqueNamedFiles.map((file) => {
        return {
          file,
          isUploading: true,
        };
      });

      setAttachments((prevAttachment) => [
        ...prevAttachment,
        ...uniqueNamedAttachment,
      ]);

      return uniqueNamedFiles;
    },
    onUploadProgress: setUploadProgress,
    onClientUploadComplete(uploadFilesResults) {
      /**
       * We need to figure out which results (mediaIds) belong to which files.
       * This why we renamed this files.
       */
      setAttachments((prevAttachments) => {
        const uploadedAttachments = prevAttachments.map((attachment) => {
          /** We need to find the attachment that successfully uploaded to the server */
          const uploadedAttachment = uploadFilesResults.find((uploadedFile) => {
            return uploadedFile.name === attachment.file.name;
          });

          if (!uploadedAttachment) {
            return attachment;
          }

          const attachmentMedia = {
            ...attachment,
            mediaId: uploadedAttachment.serverData.mediaId,
            isUploading: false,
          };

          return attachmentMedia;
        });
        return uploadedAttachments;
      });
    },
    onUploadError(e) {
      /** Remove all faild attachments */
      /* On error happen remove all files that still uploading (true)
       * Becuase we know that if upload false this already succeeded
       * Keep the once that successfully uploading
       */
      setAttachments((prevAttachments) => {
        /** Rollback to successfully uploaded Attachments */
        const successfullUploadedAttachments = prevAttachments.filter(
          (attachment) => attachment.isUploading === false,
        );
        return successfullUploadedAttachments;
      });

      toast.error(t(errorsMessages.files.upload.failed), {
        description: e.message,
      });
    },
  });

  /*
   * OnUpload progress will misbehave if 2 uploads in a row before the first one has finished
   * To avoid this we will allow on upload at a time.
   * One upload can contain multiple files (So We do not have to upload each file spreatly)
   * if i select 3 files i have to wait untill all 3 files are uploaded before adding more files
   */

  const handleStartUpload = useCallback(
    (files: File[]) => {
      if (isUploading) {
        toast.error(t(errorsMessages.files.upload.failed), {
          description: t(errorsMessages.files.upload.wait),
        });
        return;
      }
      /** Frontend validation */
      if (attachments.length + files.length > MAX_FILES_NUMBER) {
        toast.error(t(errorsMessages.files.upload.failed), {
          description: t(errorsMessages.files.upload.maxLimit),
        });
        return;
      }

      startUpload(files);
    },
    [attachments.length, isUploading, t, startUpload],
  );

  const removeAttachment = useCallback((fileName: string) => {
    setAttachments((prev) => {
      const attachmentsAfterDeletion = prev.filter((attachment) => {
        /* Keep only the attachment that are not the target files. */
        const isTargetFileToRemove = attachment.file.name === fileName;
        return !isTargetFileToRemove;
      });
      return attachmentsAfterDeletion;
    });
  }, []);

  const reset = useCallback(() => {
    setAttachments([]);
    setUploadProgress(undefined);
  }, []);

  return {
    startUpload: handleStartUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset,
  };
}
