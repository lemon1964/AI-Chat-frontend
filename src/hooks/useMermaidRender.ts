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

// SVG → PNG (dataURL) через canvas
async function svgToPngDataUrl(svgText: string, scale = 2): Promise<string> {
  // создаём Blob из SVG
  const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  try {
    // грузим в Image
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.decoding = "async";
      image.src = url;
    });

    // подстраиваем размер по viewBox
    // если у <svg> нет явных ширины/высоты — читаем из viewBox
    // (большинство версий mermaid их ставят)
    const vbMatch = svgText.match(/viewBox="([\d.\s-]+)"/i);
    let w = img.naturalWidth || 0;
    let h = img.naturalHeight || 0;

    if ((!w || !h) && vbMatch) {
      const vb = vbMatch[1].trim().split(/\s+/).map(Number);
      if (vb.length === 4 && vb[2] > 0 && vb[3] > 0) {
        w = vb[2];
        h = vb[3];
      }
    }
    if (!w || !h) {
      // запасной вариант
      w = 1024;
      h = 512;
    }

    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.floor(w * scale));
    canvas.height = Math.max(1, Math.floor(h * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context not available");

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(url);
  }
}

// нормализуем <svg> для «резиновой» вёрстки
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
        const { default: mermaid } = await import("mermaid");
        if (!window.__mmdInited) {
          mermaid.initialize({ startOnLoad: false, securityLevel: "loose" });
          window.__mmdInited = true;
        }

        const id = `mmd-${Math.random().toString(36).slice(2)}`;
        const renderCode = stripMermaidCommentsForRender(code);
        const { svg } = await mermaid.render(id, renderCode);
        if (cancelled || !hostRef.current) return;

        // 1) пробуем SVG
        const svgNormalized = normalizeSvg(svg);
        const host = hostRef.current;
        host.innerHTML = "";
        host.insertAdjacentHTML("afterbegin", svgNormalized);

        // 2) проверяем, действительно ли оно «проявилось»
        const svgEl = host.querySelector("svg");
        const rect = svgEl?.getBoundingClientRect();
        const visible = !!rect && rect.width > 1 && rect.height > 1;

        if (!visible) {
          // 3) фолбэк: PNG
          const dataUrl = await svgToPngDataUrl(svgNormalized, 2); // retina-качество
          if (cancelled || !hostRef.current) return;
          hostRef.current.innerHTML = `<img src="${dataUrl}" alt="diagram" style="width:100%;height:auto;display:block" />`;
        }
      } catch (e) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[mermaid] render failed:", e);
        }
        // на всякий случай не трогаем текущий DOM — кнопка/ошибка от контейнера останется
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

