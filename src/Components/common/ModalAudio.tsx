// frontend/src/Components/common/ModalAudio.tsx
"use client";
import { FC, ReactNode } from "react";
import { localizationService } from "@/services/localizationService";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

const ModalAudio: FC<ModalProps> = ({ onClose, title, children }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-gray-800 rounded-lg shadow-lg w-11/12 max-w-md">
      {title && (
        <div className="px-4 py-2 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      )}
      <div>{children}</div>
      <div className="p-4 border-t text-right">
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          onClick={onClose}
        >
          {localizationService.get("Close")}
        </button>
      </div>
    </div>
  </div>
);

export default ModalAudio;
