// src/hooks/useMermaidRender.ts
"use client";
import { useEffect, RefObject } from "react";
import mermaid from "mermaid";

mermaid.initialize({ startOnLoad: false, securityLevel: "loose" });

function stripMermaidCommentsForRender(src: string) {
  return src
    .split(/\r?\n/)
    .filter(ln => !ln.trimStart().startsWith("%%"))
    .join("\n");
}

export function useMermaidRender(
  code: string,
  hostRef: RefObject<HTMLDivElement | null>,
  extraDeps: unknown[] = []
) {
  useEffect(() => {
    let cancelled = false;
    const stripComments = true;
    (async () => {
      try {
        const { default: mermaid } = await import("mermaid"); // безопасно для SSR
        const id = `mmd-${Math.random().toString(36).slice(2)}`;
        const renderCode = stripComments ? stripMermaidCommentsForRender(code) : code;
        const { svg } = await mermaid.render(id, renderCode);
        // const { svg } = await mermaid.render(id, code);
        if (cancelled || !hostRef.current) return;
        if (!cancelled && hostRef.current) {
          hostRef.current.innerHTML = "";
          hostRef.current.insertAdjacentHTML("afterbegin", svg);
          // hostRef.current.innerHTML = svg;
        }
      } catch {
        /* контейнер покажет ошибку */
        /* не затираем текущий SVG, если ошибка — просто не изменяем DOM */
      }
    })();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, hostRef, ...extraDeps]);
}
