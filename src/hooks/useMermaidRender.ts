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

function isIOS() {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && (navigator).maxTouchPoints > 1)
  );
}

function normalizeSvgForMobile(svg: string) {
  return svg.replace(/<svg\b([^>]*?)>/i, (m, attrs) => {
    let a = attrs.replace(/\swidth="[^"]*"/i, "").replace(/\sheight="[^"]*"/i, "");
    if (!/\spreserveAspectRatio=/i.test(a)) a += ' preserveAspectRatio="xMidYMid meet"';
    if (/\sstyle="/i.test(a)) {
      a = a.replace(
        /\sstyle="([^"]*)"/i,
        (_m: unknown, s: unknown) => ` style="${s};width:100%;height:auto;display:block;"`
      );
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

        // единственная «мобильная» спец-ветка
        const finalSvg = isIOS() ? normalizeSvgForMobile(svg) : svg;

        hostRef.current.innerHTML = "";
        hostRef.current.insertAdjacentHTML("afterbegin", finalSvg);
        // hostRef.current.insertAdjacentHTML("afterbegin", svg);
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
