// frontend/src/Components/chat/ImageOutput.tsx
"use client";
import Image from "next/image";
import { formatFileUrl } from "@/utils/formatFileUrl";

export const ImageOutput = ({ url }: { url: string }) => {
  return (
    <div className="mt-4 w-full max-w-lg mx-auto aspect-square relative animate-fade-in">
      <Image
        src={formatFileUrl(url)}
        alt="AI generated image"
        fill
        sizes="100%"
        className="object-contain rounded-lg shadow-md"
      />
    </div>
  );
};
