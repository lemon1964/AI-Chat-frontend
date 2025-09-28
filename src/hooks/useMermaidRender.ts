// src/hooks/useMermaidRender.ts
"use client";

import { useEffect, RefObject } from "react";

function stripMermaidCommentsForRender(src: string) {
  return src
    .split(/\r?\n/)
    .filter(ln => !ln.trimStart().startsWith("%%"))
    .join("\n");
}

declare global {
  interface Window {
    __mmdInited?: boolean;
  }
}

export function useMermaidRender(
  code: string,
  hostRef: RefObject<HTMLDivElement | null>,
  extraDeps: unknown[] = []
) {
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // 💡 Ленивая загрузка модуля
        const { default: mermaid } = await import("mermaid");

        // 💡 Инициализируем только один раз (и только на клиенте)
        if (!window.__mmdInited) {
          mermaid.initialize({ startOnLoad: false, securityLevel: "loose" });
          window.__mmdInited = true;
        }

        const id = `mmd-${Math.random().toString(36).slice(2)}`;
        const renderCode = stripMermaidCommentsForRender(code);

        const { svg } = await mermaid.render(id, renderCode);

        if (cancelled || !hostRef.current) return;
        hostRef.current.innerHTML = "";
        hostRef.current.insertAdjacentHTML("afterbegin", svg);
      } catch (e) {
        // Не трогаем DOM, если не удалось отрендерить — контейнер сам покажет сообщение
        if (process.env.NODE_ENV !== "production") {
          console.warn("[mermaid] render failed:", e);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, hostRef, ...extraDeps]);
}

// // src/hooks/useMermaidRender.ts
// "use client";
// import { useEffect, RefObject } from "react";
// import mermaid from "mermaid";

// mermaid.initialize({ startOnLoad: false, securityLevel: "loose" });

// function stripMermaidCommentsForRender(src: string) {
//   return src
//     .split(/\r?\n/)
//     .filter(ln => !ln.trimStart().startsWith("%%"))
//     .join("\n");
// }

// export function useMermaidRender(
//   code: string,
//   hostRef: RefObject<HTMLDivElement | null>,
//   extraDeps: unknown[] = []
// ) {
//   useEffect(() => {
//     let cancelled = false;
//     const stripComments = true;
//     (async () => {
//       try {
//         const { default: mermaid } = await import("mermaid"); // безопасно для SSR
//         const id = `mmd-${Math.random().toString(36).slice(2)}`;
//         const renderCode = stripComments ? stripMermaidCommentsForRender(code) : code;
//         const { svg } = await mermaid.render(id, renderCode);
//         // const { svg } = await mermaid.render(id, code);
//         if (cancelled || !hostRef.current) return;
//         if (!cancelled && hostRef.current) {
//           hostRef.current.innerHTML = "";
//           hostRef.current.insertAdjacentHTML("afterbegin", svg);
//           // hostRef.current.innerHTML = svg;
//         }
//       } catch {
//         /* контейнер покажет ошибку */
//         /* не затираем текущий SVG, если ошибка — просто не изменяем DOM */
//       }
//     })();
//     return () => { cancelled = true; };
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [code, hostRef, ...extraDeps]);
// }
