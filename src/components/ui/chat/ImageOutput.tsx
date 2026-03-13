// src/components/ui/chat/ImageOutput.tsx
"use client";

import Image from "next/image";
import { formatFileUrl } from "@/utils/formatFileUrl";

export const ImageOutput = ({ url }: { url: string }) => {
  return (
    <div className="mt-4 w-full max-w-lg mx-auto aspect-square relative animate-fade-in px-4">
      <Image
        src={formatFileUrl(url)}
        alt="AI generated image"
        fill
        sizes="100%"
        className="object-contain rounded-lg shadow-md hover:scale-[1.02] transition-transform"
        style={{
          maxWidth: 'calc(100% - 2rem)',
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      />
    </div>
  );
};