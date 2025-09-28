// src/components/ui/status/InfoScreen.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type Tone = "success" | "warning" | "error" | "info";

export default function InfoScreen({
  title,
  message,
  redirectTo = "/",
  redirectAfterSec = 3,
  tone = "info",
}: {
  title: string;
  message: string;
  redirectTo?: string;
  redirectAfterSec?: number;
  tone?: Tone;
}) {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.push(redirectTo), redirectAfterSec * 1000);
    return () => clearTimeout(t);
  }, [router, redirectTo, redirectAfterSec]);

  const toneBg =
    tone === "success"
      ? "bg-green-50"
      : tone === "warning"
      ? "bg-amber-50"
      : tone === "error"
      ? "bg-red-50"
      : "bg-blue-50";

  const toneText =
    tone === "success"
      ? "text-green-700"
      : tone === "warning"
      ? "text-amber-700"
      : tone === "error"
      ? "text-red-700"
      : "text-blue-700";

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className={`text-center ${toneBg} p-8 rounded shadow-md w-full max-w-md`}>
        <h2 className={`text-2xl font-bold mb-4 ${toneText}`}>{title}</h2>
        <p className="text-gray-700">{message}</p>
        <p className="mt-2 text-xs text-gray-500">
          Перенаправление через {redirectAfterSec} сек…
        </p>
      </div>
    </div>
  );
}
