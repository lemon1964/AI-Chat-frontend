// src/components/ui/common/wrapModelId.tsx
import React from "react";

/** Красиво переносит длинные model_id по "/" и ":" с помощью <wbr/>. */
export function wrapModelId(id?: string): React.ReactNode {
  if (!id) return "—";
  return id.split(/([/:])/).map((part, i) =>
    part === "/" || part === ":" ? (
      <span key={i}>
        {part}
        <wbr />
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}
