import CropImageDialog from "@/components/posts/components/post/postContent/components/cropImageDialog/CropImageDialog";
import { CameraIcon } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { useRef, useState } from "react";
import Resizer from "react-image-file-resizer";

interface AvatarInputProps {
  src: string | StaticImageData;
  onImageCropped: (blob: Blob | null) => void;
}

export default function AvatarInput({ src, onImageCropped }: AvatarInputProps) {
  const [imageToCrop, setImageToCrop] = useState<File>();

  const fileInputRef = useRef<HTMLInputElement>(null);

  function onImageSelected(image: File | undefined) {
    if (!image) {
      return;
    }
    const MAX_WIDTH = 1024;
    const MAX_HEIGHT = 1024;
    const QUALITY = 100;
    const ROTATION = 0;

    Resizer.imageFileResizer(
      image,
      MAX_WIDTH,
      MAX_HEIGHT,
      "webp",
      QUALITY,
      ROTATION,
      (url) => setImageToCrop(url as File),
      "file",
    );
  }

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onImageSelected(e.target.files?.[0])}
        ref={fileInputRef}
        className="sr-only hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="group relative block"
      >
        <Image
          src={src}
          alt="Avatar preview"
          height={150}
          width={150}
          className="size-32 flex-none rounded-full object-cover"
        />
        <span className="absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full bg-black bg-opacity-30 text-white transition-colors duration-200 group-hover:bg-opacity-25">
          <CameraIcon size={24} />
        </span>
      </button>
      {imageToCrop && (
        <CropImageDialog
          src={URL.createObjectURL(imageToCrop)}
          cropAspectRatio={1}
          onCropped={onImageCropped}
          onClose={() => {
            setImageToCrop(undefined);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
        />
      )}
    </>
  );
}
