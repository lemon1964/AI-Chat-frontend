// src/hooks/useMermaidRender.ts
"use client";

import { useEffect, RefObject, useState } from "react";

function stripMermaidCommentsForRender(src: string) {
  return src.split(/\r?\n/).filter(ln => !ln.trimStart().startsWith("%%")).join("\n");
}

declare global {
  interface Window {
    __mmdInited?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mermaid?: any; // <— добавили глобал для CDN-скрипта
  }
}

export function useMermaidRender(
  code: string,
  hostRef: RefObject<HTMLDivElement | null>,
  extraDeps: unknown[] = []
) {
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const log = (...a: unknown[]) => console.log("[mermind/render]", ...a);
    const err = (...a: unknown[]) => console.error("[mermind/render]", ...a);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async function importMermaidWithRetry(): Promise<any | null> {
      try {
        log("import mermaid: try #1");
        const m = await import("mermaid");
        return m?.default ?? m;
      } catch (e1) {
        err("import mermaid failed #1:", e1);
        const msg = String((e1 as Error)?.message || e1);
        const looksLikeChunkFail = /Loading chunk|ChunkLoadError/i.test(msg);

        if (!looksLikeChunkFail) return null;

        await new Promise(r => setTimeout(r, 250));
        try {
          log("import mermaid: retry #2");
          const m2 = await import("mermaid");
          return m2?.default ?? m2;
        } catch (e2) {
          err("import mermaid failed #2:", e2);
          return null;
        }
      }
    }

    async function render() {
      if (!code.trim() || !hostRef.current) return;

      setIsRendering(true);
      setError(null);
      log("start render");

      let mod = await importMermaidWithRetry();

      // 🔥 Fallback: если импорт не вышел — пробуем глобальный mermaid из CDN
      if (!mod && typeof window !== "undefined" && window.mermaid) {
        log("using window.mermaid (CDN fallback)");
        mod = window.mermaid;
      }

      if (!mod) {
        setError("Не удалось загрузить модуль диаграмм (mermaid). Попробуйте обновить страницу.");
        if (!cancelled && hostRef.current) {
          hostRef.current.innerHTML =
            `<div style="padding:16px;text-align:center;color:#666;">
               Не удалось загрузить графический модуль.<br/>
               <small>Попробуйте обновить страницу.</small>
             </div>`;
        }
        return;
      }

      try {
        if (!window.__mmdInited) {
          mod.initialize({ startOnLoad: false, securityLevel: "loose" });
          window.__mmdInited = true;
          log("mermaid initialized");
        }

        const id = `mmd-${Math.random().toString(36).slice(2)}`;
        const renderCode = stripMermaidCommentsForRender(code);
        const { svg } = await mod.render(id, renderCode);
        if (cancelled || !hostRef.current) return;

        hostRef.current.innerHTML = svg;
        const svgEl = hostRef.current.querySelector("svg") as SVGSVGElement | null;
        if (svgEl) {
          svgEl.style.maxWidth = "100%";
          svgEl.style.height = "auto";
          svgEl.style.display = "block";
        }
        log("render ok");
      } catch (e) {
        err("render exception:", e);
        setError((e as Error)?.message || "Ошибка рендеринга");
        if (!cancelled && hostRef.current) {
          hostRef.current.innerHTML =
            `<div style="padding:16px;text-align:center;color:#666;">
               Не удалось отрисовать диаграмму.<br/>
               <small>${(e as Error)?.message ?? ""}</small>
             </div>`;
        }
      } finally {
        if (!cancelled) setIsRendering(false);
      }
    }

    const t = setTimeout(render, 100);
    return () => { clearTimeout(t); cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, hostRef, ...extraDeps]);

  return { isRendering, error };
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
//         // 💡 Ленивая загрузка модуля
//         const { default: mermaid } = await import("mermaid");

//         // 💡 Инициализируем только один раз (и только на клиенте)
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
//         // Не трогаем DOM, если не удалось отрендерить — контейнер сам покажет сообщение
//         if (process.env.NODE_ENV !== "production") {
//           console.warn("[mermaid] render failed:", e);
//         }
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [code, hostRef, ...extraDeps]);
// }

