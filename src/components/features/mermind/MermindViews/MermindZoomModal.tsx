"use client";
import { useEffect, useRef } from "react";
import Modal from "@ui/common/Modal";
import { useMermaidRender } from "@/hooks/useMermaidRender";

type Props = {
  code: string;
  onClose: () => void;
};

export default function MermindZoomModal({ code, onClose }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  // рендерим тот же код; хук уже убирает %% из отрисовки
  useMermaidRender(code, hostRef);

  // ESC закрывает модалку
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <Modal onClose={onClose}>
      <div className="w-[95vw] h-[90vh] bg-gray-900 rounded-lg p-3 flex flex-col">
        <div className="mb-2 flex justify-between items-center">
          <h3 className="text-gray-200 text-sm">Предпросмотр «крупно»</h3>
          <button
            onClick={onClose}
            className="px-3 py-1 text-sm rounded bg-gray-700 hover:bg-gray-600 text-white"
          >
            Закрыть
          </button>
        </div>

        {/* холст: занимаем всё пространство и даём скролл, если SVG огромный */}
        <div className="flex-1 overflow-auto rounded bg-white">
          {/* mermaid сам выставит размер SVG; родитель даёт скролл */}
          <div ref={hostRef} className="min-w-full min-h-full p-2" />
        </div>
      </div>
    </Modal>
  );
}
