// src/hooks/useDebouncedEffect.ts
"use client";
import { useEffect } from "react";

export function useDebouncedEffect(
  effect: () => void | (() => void),
  deps: unknown[],
  delay = 350
) {
  useEffect(() => {
    const id = setTimeout(() => {
      const cleanup = effect();
      if (typeof cleanup === "function") return cleanup as unknown as void;
    }, delay);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
