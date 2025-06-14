import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import { memo, useRef } from "react";

interface AddAttachmentButtonProps {
  onFilesSelected: (files: File[]) => void;
  disabled: boolean;
}

function AddAttachmentButton({
  onFilesSelected,
  disabled,
}: AddAttachmentButtonProps) {
  console.log(`AddAttachmentButton render ... `);

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-primary hover:text-primary"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
      >
        <ImageIcon size={20} />
      </Button>
      <input
        type="file"
        accept="image/*, video/*"
        ref={fileInputRef}
        multiple
        className="sr-only hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length) {
            onFilesSelected(files);
            /** To select same file multiple time in the same input fields  */
            e.target.value = "";
          }
        }}
      />
    </>
  );
}

export default memo(AddAttachmentButton);
