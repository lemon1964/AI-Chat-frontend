// src/hooks/useMermaidRender.ts
"use client";

import { useEffect, RefObject } from "react";

function stripMermaidComments(src: string) {
  return src
    .split(/\r?\n/)
    .filter(ln => !ln.trimStart().startsWith("%%"))
    .join("\n");
}

declare global { interface Window { __mmdInited?: boolean } }

// Очень простое определение мобилы
function isMobileUA() {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// Чуть «резиновее» SVG — пригодится для конвертации в PNG
function normalizeSvg(svg: string) {
  return svg.replace(/<svg\b([^>]*?)>/i, (m, attrs) => {
    let a = attrs.replace(/\swidth="[^"]*"/i, "").replace(/\sheight="[^"]*"/i, "");
    if (!/\spreserveAspectRatio=/i.test(a)) a += ' preserveAspectRatio="xMidYMid meet"';
    return `<svg${a}>`;
  });
}

// SVG → PNG dataURL (без изысков, максимально просто)
async function svgToPngDataUrl(svgText: string, scale = 2): Promise<string> {
  const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.decoding = "async";
      image.src = url;
    });

    // размеры из viewBox (у mermaid обычно он есть)
    const vb = svgText.match(/viewBox="([\d.\s-]+)"/i)?.[1]?.trim().split(/\s+/).map(Number) || [];
    const w = img.naturalWidth || vb[2] || 1024;
    const h = img.naturalHeight || vb[3] || 512;

    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.floor(w * scale));
    canvas.height = Math.max(1, Math.floor(h * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("no canvas 2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(url);
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
        const host = hostRef.current;
        if (!host) return;

        const { default: mermaid } = await import("mermaid");
        if (!window.__mmdInited) {
          mermaid.initialize({ startOnLoad: false, securityLevel: "loose" });
          window.__mmdInited = true;
        }

        const id = `mmd-${Math.random().toString(36).slice(2)}`;
        const renderCode = stripMermaidComments(code);
        const { svg } = await mermaid.render(id, renderCode);
        if (cancelled || !hostRef.current) return;

        host.innerHTML = "";

        // 🔴 ТУПО и НАДЁЖНО: на мобильных всегда PNG
        if (isMobileUA()) {
          try {
            const png = await svgToPngDataUrl(normalizeSvg(svg), 2);
            if (cancelled || !hostRef.current) return;
            hostRef.current.innerHTML =
              `<img src="${png}" alt="diagram" style="width:100%;height:auto;display:block" />`;
            return;
          } catch {
            // если даже PNG не собрался — даём ссылку на SVG
            const href = "data:image/svg+xml;utf8," + encodeURIComponent(svg);
            hostRef.current.innerHTML =
              `<a href="${href}" download="diagram.svg" class="underline text-blue-600">Download SVG</a>`;
            return;
          }
        }

        // 🟢 Десктоп — как было: вставляем SVG
        host.insertAdjacentHTML("afterbegin", svg);
      } catch (e) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[mermaid] render failed:", e);
        }
        // ничего не трогаем: контейнер/страница всё равно остаются живыми
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

