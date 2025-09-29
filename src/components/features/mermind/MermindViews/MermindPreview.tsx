import { useMemo } from "react";
import { wrapModelId } from "@ui/common/wrapModelId";
import { extractMermaidCommentLines } from "@/utils/mermaidNotes";

export default function MermindPreview({
  svgHostRef,
  displayModel,
  code,
}: {
  svgHostRef: React.RefObject<HTMLDivElement | null>;
  displayModel: string;
  code: string;
}) {
  const notes = useMemo(() => extractMermaidCommentLines(code), [code]);

  return (
    <>
      <h2 className="text-xl text-white font-semibold mb-3">Предпросмотр</h2>

      <div className="border rounded p-4 bg-white">
        <div className="flex justify-center">
        <div ref={svgHostRef} className="w-full min-h-[180px] overflow-auto" style={{ WebkitOverflowScrolling: 'touch' }} />
          {/* <div ref={svgHostRef} className="w-full min-h-[180px] overflow-auto" /> */}
        </div>

        <p className="mt-2 text-xs bg-white text-gray-700 font-mono flex items-center gap-1">
          ⚙️ used model:
          <span className="inline-block max-w-full sm:max-w-[420px]" title={displayModel}>
            {wrapModelId(displayModel)}
          </span>
        </p>

        {/* Примечания из %% */}
        {notes.length > 0 && (
          <details className="mt-3 rounded border bg-gray-50 text-gray-700" open={false}>
            <summary className="cursor-pointer select-none px-3 py-2 text-xs font-semibold uppercase tracking-wide">
              Примечания ({notes.length})
            </summary>
            <div className="px-3 pb-3 max-h-40 overflow-auto">
              <ul className="list-disc pl-5 text-sm leading-relaxed">
                {notes.map((line, i) => (
                  <li key={i}>{line || <span className="opacity-50">—</span>}</li>
                ))}
              </ul>
            </div>
          </details>
        )}
      </div>
    </>
  );
}
