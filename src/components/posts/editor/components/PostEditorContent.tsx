import { cn } from "@/lib/utils";
import { Editor, EditorContent } from "@tiptap/react";
import { memo } from "react";
import usePostEditorDropzone from "../hooks/usePostEditorDropzone";

interface PostEditorContentProps {
  startUpload: (files: File[]) => void;
  editor: Editor | null;
}

function PostEditorContent({ editor, startUpload }: PostEditorContentProps) {
  console.log(`PostEditorContent render ... `);

  const { getRootProps, getInputProps, isDragActive, onPaste, ...rootProps } =
    usePostEditorDropzone(startUpload);

  return (
    <div {...rootProps} className="w-full">
      <EditorContent
        editor={editor}
        className={cn(
          "max-h-[20rem] min-w-full max-w-[32.0rem] overflow-y-auto whitespace-pre-line break-words rounded-2xl bg-background px-5 py-3",
          isDragActive && "outline-dashed",
        )}
        onPaste={onPaste}
      />
      <input {...getInputProps()} />
    </div>
  );
}

export default memo(PostEditorContent);
