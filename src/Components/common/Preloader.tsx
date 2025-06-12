// frontend/src/Components/Preloader.tsx
"use client";
import React from "react";

const ChatSkeleton = () => {
  return (
    <div className="flex-1 p-4 space-y-4 animate-pulse">
      {/* Имитация трех строк чата */}
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      {/* Можно продублировать ниже для большей “глубины” */}
      <div className="h-4 bg-gray-200 rounded w-2/3 mt-6"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      <div className="h-4 bg-gray-200 rounded w-4/5"></div>
    </div>
  );
};

export default ChatSkeleton;
