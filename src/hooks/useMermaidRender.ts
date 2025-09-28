// src/hooks/useMermaidRender.ts
"use client";

import { useEffect, RefObject } from "react";

function stripMermaidCommentsForRender(src: string) {
  return src
    .split(/\r?\n/)
    .filter(ln => !ln.trimStart().startsWith("%%"))
    .join("\n");
}

declare global { interface Window { __mmdInited?: boolean } }

// Простейшее определение мобилы (достаточно для нашей задачи)
function isMobileUA() {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// SVG → PNG (dataURL) через canvas
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

    // размеры из viewBox, если naturalWidth/Height не даны
    const vbMatch = svgText.match(/viewBox="([\d.\s-]+)"/i);
    let w = img.naturalWidth || 0;
    let h = img.naturalHeight || 0;
    if ((!w || !h) && vbMatch) {
      const [ , , vw, vh ] = vbMatch[1].trim().split(/\s+/).map(Number);
      if (vw > 0 && vh > 0) { w = vw; h = vh; }
    }
    if (!w || !h) { w = 1024; h = 512; } // запасной вариант

    // мягкая защита от слишком больших картинок
    const MAX = 3000;
    const s = Math.min(scale, MAX / Math.max(w, h));

    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.floor(w * s));
    canvas.height = Math.max(1, Math.floor(h * s));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context not available");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(url);
  }
}

// Делаем <svg> «резиновым» (для десктопа)
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
        const host = hostRef.current;
        if (!host) return;

        const { default: mermaid } = await import("mermaid");
        if (!window.__mmdInited) {
          mermaid.initialize({ startOnLoad: false, securityLevel: "loose" });
          window.__mmdInited = true;
        }

        const id = `mmd-${Math.random().toString(36).slice(2)}`;
        const renderCode = stripMermaidCommentsForRender(code);
        const { svg } = await mermaid.render(id, renderCode);
        if (cancelled || !hostRef.current) return;

        host.innerHTML = "";

        // 🔹 Мобила: сразу PNG (без промежуточного SVG в DOM)
        if (isMobileUA()) {
          const png = await svgToPngDataUrl(normalizeSvg(svg), 2); // ретина-качество
          if (cancelled || !hostRef.current) return;
          hostRef.current.innerHTML =
            `<img src="${png}" alt="diagram" style="width:100%;height:auto;display:block" />`;
          return;
        }

        // 🔹 Десктоп: чистый SVG
        const svgNormalized = normalizeSvg(svg);
        host.insertAdjacentHTML("afterbegin", svgNormalized);
      } catch (e) {
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

