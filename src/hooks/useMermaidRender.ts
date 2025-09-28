// src/hooks/useMermaidRender.ts
"use client";

import { useEffect, RefObject } from "react";
import mermaid from "mermaid";

function stripMermaidCommentsForRender(src: string) {
  return src
    .split(/\r?\n/)
    .filter(ln => !ln.trimStart().startsWith("%%"))
    .join("\n");
}

declare global { interface Window { __mmdInited?: boolean } }

// чутка подчистим <svg>
function normalizeSvg(svg: string) {
  return svg.replace(/<svg\b([^>]*?)>/i, (m, attrs) => {
    let a = attrs.replace(/\swidth="[^"]*"/i, "").replace(/\sheight="[^"]*"/i, "");
    if (!/\spreserveAspectRatio=/i.test(a)) a += ' preserveAspectRatio="xMidYMid meet"';
    if (/\sstyle="/i.test(a)) {
      a = a.replace(/\sstyle="([^"]*)"/i, (_m: unknown, s: unknown) => ` style="${s};width:100%;height:auto;display:block;"`);
    } else {
      a += ' style="width:100%;height:auto;display:block;"';
    }
    return `<svg${a}>`;
  });
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
        if (!window.__mmdInited) {
          mermaid.initialize({ startOnLoad: false, securityLevel: "loose" });
          window.__mmdInited = true;
        }

        const id = `mmd-${Math.random().toString(36).slice(2)}`;
        const renderCode = stripMermaidCommentsForRender(code);
        const { svg } = await mermaid.render(id, renderCode);
        if (cancelled || !hostRef.current) return;

        const svgNormalized = normalizeSvg(svg);
        const dataUrl =
          "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgNormalized);

        // 👉 вместо innerHTML со <svg> — всегда <img src="data:...">
        hostRef.current.innerHTML =
          `<img src="${dataUrl}" alt="diagram" style="width:100%;height:auto;display:block" />`;
      } catch (e) {
        if (!cancelled && hostRef.current) {
          hostRef.current.innerHTML =
            `<div style="padding:12px;text-align:center;color:#666">Не удалось отобразить диаграмму</div>`;
        }
        if (process.env.NODE_ENV !== "production") {
          console.warn("[mermaid] render failed:", e);
        }
      }
    })();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, hostRef, ...extraDeps]);
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

