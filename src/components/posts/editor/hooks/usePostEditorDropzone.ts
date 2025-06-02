import { useDropzone } from "@uploadthing/react";
import { ClipboardEvent, useCallback, useMemo } from "react";

export default function usePostEditorDropzone(
  startUpload: (files: File[]) => void,
) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: startUpload,
  });
  const { onClick, ...rootProps } = getRootProps();

  const onPaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      const clipboardDataArray = Array.from(e.clipboardData.items);
      const clipboardDataFiles = clipboardDataArray.filter((item) => {
        const isFile: boolean = item.kind === "file";
        return isFile;
      });
      const clipboardDataFilesObjects = clipboardDataFiles.map(
        (item) => item.getAsFile() as File,
      ) as File[];
      startUpload(clipboardDataFilesObjects);
    },
    [startUpload],
  );

  return {
    getRootProps,
    getInputProps,
    isDragActive,
    onPaste,
    ...rootProps,
  };
}
