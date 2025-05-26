import { useUploadThing } from "@/lib/uploadthing";
import { useState } from "react";
import { toast } from "sonner";

const MAX_FILES_NUMBER = 5;

export interface Attachment {
  file: File;
  mediaId?: string;
  isUploading: boolean;
}

export default function useMediaUpload() {
  // attachmentes which we will show on UI
  const [attachment, setAttachment] = useState<Attachment[]>([]);

  const [uploadProgress, setUploadProgress] = useState<number>();

  const { startUpload, isUploading } = useUploadThing("attachments", {
    onBeforeUploadBegin(files) {
      const renamedFiles = files.map((file) => {
        /**
         * Create a unique file name since file dose not have a unique id
         */
        const fileExtension = file.name.split(",")[1];

        /**
         * Rename the existing file
         */
        return new File(
          [file],
          `attachment_${crypto.randomUUID()}.${fileExtension}`,
          { type: file.type },
        );
      });

      /**
       * We do not have media id yet.
       * But now we now that they are uploaded
       * 
       * Here we are using the setState callback 
         way which we can access the current state
         before update it.
       */

      const renamedAttachment = renamedFiles.map((file) => {
        return {
          file,
          isUploading: true,
        };
      });

      setAttachment((prev) => [...prev, ...renamedAttachment]);

      return renamedFiles;
    },
    onUploadProgress: setUploadProgress,
    onClientUploadComplete(results) {
      /**
       * We need to figure out which results (mediaIds) belong to which files.
       * This why we renamed this files.
       */
      setAttachment((prev) =>
        prev.map((attachment) => {
          const uploadResult = results.find(
            (result) => result.name === attachment.file.name,
          );
          if (!uploadResult) {
            /* No media id to add to it */
            return attachment;
          }
          /**
           * Add each media id to the crossponding attachment.
           */

          return {
            ...attachment,
            mediaId: uploadResult.serverData.mediaId, // on upload complete
            isUploading: false,
          };
        }),
      );
    },
    onUploadError(e) {
      /** Remove all faild attachments */
      /* On error happen remove all files that still uploading (true)
       * Becuase we know that if upload false this already succeeded
       * Keep the once that successfly uploading
       */
      setAttachment((prev) =>
        prev.filter((attachment) => attachment.isUploading === false),
      );

      toast.error("Faild to upload files", {
        description: e.message,
      });
    },
  });

  /*
   * On upload progress will misbehave if 2 uploads in a row before the first one has finished
   * To avoid this we will allow on upload at a time.
   * One upload can contain multiple files (So We do not have to upload each file spreatly)
   * if i select 3 files i have to wait untill all 3 files are uploaded before adding more files
   */

  function handleStartUpload(files: File[]) {
    if (!isUploading) {
      toast.error("Upload failed", {
        description: "Upload faild. Please wait the current uploads to finish.",
      });
      return;
    }
    /** Frontend validation */
    if (attachment.length + files.length > MAX_FILES_NUMBER) {
      toast.error("Upload failed", {
        description:
          "Upload faild. You can only upload up to 5 attachments per post.",
      });
      return;
    }

    startUpload(files);
  }
}
