// src/hooks/useRateLimit.ts
import { useCallback } from "react";

// const DEFAULT = { text: 100, code: 100, image: 1, diagram: 100 } as const;
const DEFAULT = { text: 1, code: 1, image: 1, diagram: 1 } as const;
type ModelType = keyof typeof DEFAULT;
type Limits = Record<ModelType, number>;

interface RateState {
  start: string;
  counts: Record<ModelType, number>;
}

const STORAGE_KEY = "rate_limit";
const PERIOD_MS = 24 * 3600_000;

function loadState(): RateState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed: RateState = JSON.parse(raw);
      const since = Date.now() - new Date(parsed.start).getTime();
      if (since < PERIOD_MS) return parsed;
    } catch {}
  }
  return { start: new Date().toISOString(), counts: { text:0, code:0, image:0, diagram:0 } };
}

function saveState(state: RateState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useRateLimit(overrides?: Partial<Limits>) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const LIMITS: Limits = { ...DEFAULT, ...(overrides || {}) };
  // if (process.env.NODE_ENV !== "production") {
  //   console.log("[ratelimit] limits in effect:", LIMITS);
  // }

  const isAllowed = useCallback((type: ModelType) => {
    const state = loadState();
    const startTime = new Date(state.start).getTime();
    const retryAfter = new Date(startTime + PERIOD_MS);

    const cap = LIMITS[type] ?? 0;
    if (state.counts[type] < cap) return { ok: true as const };
    return { ok: false as const, retryAfter };
  }, [LIMITS]);

  const mark = useCallback((type: ModelType) => {
    const state = loadState();
    state.counts[type] = (state.counts[type] || 0) + 1;
    saveState(state);
  }, []);

  const reset = useCallback(() => {
    saveState({ start: new Date().toISOString(), counts: { text:0, code:0, image:0, diagram:0 } });
  }, []);

  return { isAllowed, mark, reset, limits: LIMITS };
}
