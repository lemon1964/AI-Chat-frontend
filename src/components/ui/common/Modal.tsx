// ai-chat-next/src/components/ui/common/Modal.tsx
import React from "react";

/**
 * Базовый компонент модального окна.
 * @param children - Контент модалки
 * @param onClose - Функция закрытия
 */
const Modal = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className=" bg-gray-900 p-6 rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
