// frontend/src/Components/common/ModalTogglable.tsx
import { forwardRef, useImperativeHandle, useState, ReactNode } from "react";

interface ModalTogglableProps {
  buttonLabel: string;
  children: ReactNode;
}

const ModalTogglable = forwardRef(({ buttonLabel, children }: ModalTogglableProps, ref) => {
  const [isVisible, setIsVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    toggleVisibility: () => setIsVisible((prev) => !prev),
  }));

  return (
    <div>
      {!isVisible && (
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          onClick={() => setIsVisible(true)}
        >
          {buttonLabel}
        </button>
      )}
      {isVisible && (
        <div>
          {children}
          <button
            className="mt-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
            onClick={() => setIsVisible(false)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
});

ModalTogglable.displayName = "ModalTogglable";
export default ModalTogglable;
