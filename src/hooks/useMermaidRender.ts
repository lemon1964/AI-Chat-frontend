// src/hooks/useMermaidRender.ts
"use client";

import { useEffect, RefObject, useState } from "react";

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
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mermaidInstance: any = null;

    const renderMermaid = async () => {
      if (!code.trim() || !hostRef.current) return;

      try {
        setIsRendering(true);
        setError(null);

        // Ленивая загрузка mermaid
        const mermaidModule = await import("mermaid");
        mermaidInstance = mermaidModule.default;

        // Переинициализация для мобильных устройств
        mermaidInstance.initialize({
          startOnLoad: false,
          securityLevel: "loose",
          theme: "default",
          fontFamily: "sans-serif",
          // Оптимизации для мобильных
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: "basis"
          }
        });

        const id = `mmd-${Math.random().toString(36).slice(2)}`;
        const renderCode = stripMermaidCommentsForRender(code);

        const { svg } = await mermaidInstance.render(id, renderCode);

        if (cancelled || !hostRef.current) return;

        // Очистка и вставка SVG
        hostRef.current.innerHTML = svg;
        
        // Применяем стили для мобильной оптимизации
        const svgElement = hostRef.current.querySelector('svg');
        if (svgElement) {
          svgElement.style.maxWidth = '100%';
          svgElement.style.height = 'auto';
        }

      } catch (e) {
        if (!cancelled) {
          console.error("[mermaid] render failed:", e);
          setError(e instanceof Error ? e.message : "Ошибка рендеринга");
          
          // Показываем сообщение об ошибке
          if (hostRef.current) {
            hostRef.current.innerHTML = `
              <div style="padding: 20px; text-align: center; color: #666;">
                <p>Не удалось отобразить диаграмму</p>
                <small>${e instanceof Error ? e.message : 'Попробуйте обновить страницу'}</small>
              </div>
            `;
          }
        }
      } finally {
        if (!cancelled) {
          setIsRendering(false);
        }
      }
    };

    // Задержка для стабильности на мобильных
    const timer = setTimeout(renderMermaid, 100);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
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

