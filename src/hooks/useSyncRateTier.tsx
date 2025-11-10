// ai-chat-next/src/hooks/useSyncRateTier.tsx
import { useEffect, useRef } from "react";
import { useRateLimit } from "@/hooks/useRateLimit";

export function useSyncRateTier(tier: string | undefined) {
  const prevTier = useRef<string | undefined>(undefined);
  const { reset } = useRateLimit(); // reset() из хука – чистит окно

  useEffect(() => {
    if (tier && prevTier.current && prevTier.current !== tier) {
      reset(); // новая “эпоха” лимитов — начнём окно заново
    }
    prevTier.current = tier;
  }, [tier, reset]);
}
