// src/components/features/common/Notification.tsx
"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const Notification = () => {
  const notification = useSelector((state: RootState) => state.notification);

  if (!notification?.message) return null;

  const bgColor =
    notification.type === "success"
      ? "bg-green-500"
      : notification.type === "error"
      ? "bg-red-500"
      : notification.type === "info"
      ? "bg-blue-500"
      : "bg-transparent";

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-3 rounded-lg text-white shadow-lg transition-opacity duration-300 ${bgColor}`}
    >
      {notification.message}
    </div>
  );
};

export default Notification;