// frontend/src/hooks/useRateLimit.ts
import { useCallback } from "react";

const STORAGE_KEY = "rate_limit";
const PERIOD_MS = 72 * 3600_000; // 72 часа
const LIMITS = {
  text: 5,
  code: 3,
  image: 1,
} as const;

/** Загружает состояние из localStorage или создаёт новое */
function loadState(): RateState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed: RateState = JSON.parse(raw);
      const since = Date.now() - new Date(parsed.start).getTime();
      if (since < PERIOD_MS) {
        return parsed;
      }
    } catch {}
  }
  // Новый период
  const now = new Date().toISOString();
  return {
    start: now,
    counts: { text: 0, code: 0, image: 0 },
  };
}

/** Сохраняет состояние в localStorage */
function saveState(state: RateState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/**
 * Хук-утилита для проверки и отметки лимитов.
 * Пользователь с именем 'gudvin' обходит ограничения на фронте через отдельную проверку.
 */
export function useRateLimit() {
  const isAllowed = useCallback(
    (type: ModelType) => {
      const state = loadState();
    //   const used = state.counts[type];
    //   const remaining = LIMITS[type] - used;
    //   console.log(`[RateLimit] Checking "${type}": used=${used}, remaining=${remaining}`);
      const startTime = new Date(state.start).getTime();
      const retryAfter = new Date(startTime + PERIOD_MS);

      if (state.counts[type] < LIMITS[type]) {
        return { ok: true as const };
      } else {
        return { ok: false as const, retryAfter };
      }
    },
    []
  );

  const mark = useCallback((type: ModelType) => {
    const state = loadState();
    state.counts[type] = (state.counts[type] || 0) + 1;
    saveState(state);
    // console.log(`[RateLimit] Marked "${type}", new count=${state.counts[type]}`);
  }, []);

  const reset = useCallback(() => {
    const now = new Date().toISOString();
    const newState: RateState = {
      start: now,
      counts: { text: 0, code: 0, image: 0 },
    };
    saveState(newState);
  }, []);

  return { isAllowed, mark, reset, limits: LIMITS };
}
