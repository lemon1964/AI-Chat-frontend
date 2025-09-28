import React from "react";

// красивый перенос длинных model_id по "/" и ":"
export const wrapModelId = (id?: string) => {
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
};
