// src/hooks/useMermaidRender.ts
"use client";

import { useEffect, RefObject } from "react";

function stripMermaidCommentsForRender(src: string) {
  return src.split(/\r?\n/).filter(ln => !ln.trimStart().startsWith("%%")).join("\n");
}

type MermaidAPI = {
  initialize(cfg: unknown): void;
  render(id: string, code: string): Promise<{ svg: string }>;
  parse(code: string): Promise<void> | void;
  parseError?: (err: unknown, hash?: unknown) => void;
};

declare global {
  interface Window {
    __mmdInited?: boolean;
    mermaid?: MermaidAPI; // fallback из CDN
  }
}

async function waitForMermaidFromCDN(ms = 800): Promise<MermaidAPI | null> {
  const deadline = Date.now() + ms;
  while (Date.now() < deadline) {
    if (typeof window !== "undefined" && window.mermaid) return window.mermaid;
    await new Promise(r => setTimeout(r, 50));
  }
  return null;
}

/**
 * depsKey — любой маркер (булевы/числа/строки/JSON.stringify([...])).
 * Меняем его, когда нужно перерендерить диаграмму по внешним условиям.
 */
export function useMermaidRender(
  code: string,
  hostRef: RefObject<HTMLDivElement | null>,
  depsKey?: unknown
) {
  useEffect(() => {
    let cancelled = false;

    // фикс #1: работаем с «снимком» текущего элемента
    const hostEl = hostRef.current;

    (async () => {
      try {
        // если контейнера нет — выходим
        if (!hostEl) return;

        // 1) динамический импорт → иначе ждём CDN-глобал
        let mermaid: MermaidAPI | null = null;
        try {
          const mod = await import("mermaid");
          mermaid = (mod?.default ?? mod) as unknown as MermaidAPI;
        } catch {
          mermaid = await waitForMermaidFromCDN();
          if (!mermaid) throw new Error("Mermaid not available");
        }

        // 2) init один раз + гасим глобальный parseError
        if (!window.__mmdInited) {
          mermaid.initialize({ startOnLoad: false, securityLevel: "loose" });
          mermaid.parseError = () => {};
          window.__mmdInited = true;
        }

        const id = `mmd-${Math.random().toString(36).slice(2)}`;
        const renderCode = stripMermaidCommentsForRender(code);

        // 3) предварительная валидация — показываем локальное сообщение
        try {
          await mermaid.parse(renderCode);
        } catch (e) {
          if (!cancelled && hostEl) {
            hostEl.innerHTML =
              `<div style="padding:12px;text-align:center;color:#b91c1c;background:#fee2e2;border-radius:6px;">
                 Ошибка в диаграмме: ${(e as Error)?.message || "Syntax error"}
               </div>`;
          }
          return;
        }

        // 4) рендер
        const { svg } = await mermaid.render(id, renderCode);
        if (cancelled || !hostEl) return;

        hostEl.innerHTML = "";
        hostEl.insertAdjacentHTML("afterbegin", svg);
      } catch {
        if (!cancelled && hostEl) {
          hostEl.innerHTML =
            `<div style="padding:12px;text-align:center;color:#6b7280;">
               Не удалось отрисовать диаграмму.
             </div>`;
        }
      }
    })();

    return () => {
      cancelled = true;
      // фикс #1: чистим именно тот DOM-узел, который был в этом эффекте
      if (hostEl) hostEl.innerHTML = "";
    };

    // фикс #2: без спреда; ref сам по себе стабилен, его в deps не кладём
  }, [code, depsKey, hostRef]); // ← только код диаграммы и внешний «ключ»
}



// // src/hooks/useMermaidRender.ts
// "use client";

// import { useEffect, RefObject } from "react";

// function stripMermaidCommentsForRender(src: string) {
//   return src
//     .split(/\r?\n/)
//     .filter(ln => !ln.trimStart().startsWith("%%"))
//     .join("\n");
// }

// declare global {
//   interface Window {
//     __mmdInited?: boolean;
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     mermaid?: any; // fallback из CDN
//   }
// }

// export function useMermaidRender(
//   code: string,
//   hostRef: RefObject<HTMLDivElement | null>,
//   extraDeps: unknown[] = []
// ) {
//   useEffect(() => {
//     let cancelled = false;

//     (async () => {
//       try {
//         // 1) пробуем динамический импорт
//         let mermaid;
//         try {
//           const mod = await import("mermaid");
//           mermaid = mod?.default ?? mod;
//         } catch {
//           // 2) fallback: глобальный mermaid от CDN-скрипта
//           mermaid = typeof window !== "undefined" ? window.mermaid : null;
//           if (!mermaid) throw new Error("Mermaid not available");
//         }

//         if (!window.__mmdInited) {
//           mermaid.initialize({ startOnLoad: false, securityLevel: "loose" });
//           window.__mmdInited = true;
//         }

//         const id = `mmd-${Math.random().toString(36).slice(2)}`;
//         const renderCode = stripMermaidCommentsForRender(code);
//         const { svg } = await mermaid.render(id, renderCode);

//         if (cancelled || !hostRef.current) return;
//         hostRef.current.innerHTML = "";
//         hostRef.current.insertAdjacentHTML("afterbegin", svg);
//       } catch (e) {
//         if (process.env.NODE_ENV !== "production") {
//           console.warn("[mermaid] render failed:", e);
//         }
//         // не трогаем DOM — ваш контейнер сам показывает сообщение об ошибке
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [code, hostRef, ...extraDeps]);
// }
