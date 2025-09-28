// src/components/features/mermind/MermindToolbar.tsx
import { wrapModelId } from "../_wrapModelId";

type Props = {
  allModels: Array<{ id: string; name: string }>;
  selectedModel: string;
  onModelChange: (id: string) => void;
  usedModel: string;
  type: DiagramType;
  types: DiagramType[];
  typeLabels: Record<DiagramType, string>;
  setType: (t: DiagramType) => void;
  isGenerating: boolean;
  canGenerate: boolean;
  onGenerate: () => void;
  isSaving: boolean;
  onSave: () => void;
  onDownloadSvg: () => void;
  onOpenLibrary: () => void;
  isAuthed: boolean;
  buttonsDisabled: boolean;
  onOpenZoom: () => void;
};

export default function MermindToolbar({
  allModels,
  selectedModel,
  onModelChange,
  type,
  types,
  typeLabels,
  setType,
  isGenerating,
  canGenerate,
  onGenerate,
  isSaving,
  onSave,
  onDownloadSvg,
  onOpenLibrary,
  isAuthed,
  buttonsDisabled,
  onOpenZoom
}: Props) {
  return (
    <>
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-3 mt-3">
        <select
          value={selectedModel}
          onChange={e => onModelChange(e.target.value)}
          className="border px-2 py-1 rounded bg-gray-700 text-white hover:bg-gray-600"
        >
          {allModels.map(m => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        <select
          className="border rounded p-2 bg-gray-700 text-white hover:bg-gray-600"
          value={type}
          onChange={e => setType(e.target.value as DiagramType)}
        >
          {types.map(t => (
            <option key={t} value={t}>
              {typeLabels[t] ?? t}
            </option>
          ))}
        </select>
      </div>

      {/* бейдж «какой моделью будет сделано прямо сейчас» */}
      <span
        title={selectedModel || ""}
        className="max-w-[260px] truncate px-2 py-0.5 rounded bg-gray-200 text-gray-700 text-xs font-mono"
      >
        ⚙️ will use:&nbsp;
        <span className="truncate sm:truncate-0">{wrapModelId(selectedModel || "—")}</span>
      </span>

      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={onGenerate}
          disabled={isGenerating || !canGenerate || buttonsDisabled}
          title={!isAuthed ? "Войдите, чтобы генерировать диаграммы" : undefined}
          className={`px-4 py-2 rounded text-white ${
            isGenerating || !canGenerate ? "bg-gray-500 cursor-not-allowed" : "bg-black"
          }`}
        >
          {isGenerating ? "Генерируем…" : "Сгенерировать"}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={onSave}
          disabled={isSaving || buttonsDisabled}
          title={!isAuthed ? "Войдите, чтобы сохранять" : undefined}
          className={`px-3 py-2 rounded text-white ${
            isSaving ? "bg-gray-500 cursor-wait" : "bg-gray-700"
          }`}
        >
          {isSaving ? "Сохраняем…" : "Сохранить"}
        </button>

        <button
          onClick={onDownloadSvg}
          disabled={buttonsDisabled}
          title={!isAuthed ? "Войдите, чтобы скачивать SVG" : undefined}
          className="px-3 py-2 rounded bg-gray-700 text-white"
        >
          Скачать SVG
        </button>

        <button
          onClick={onOpenZoom}
          // disabled={buttonsDisabled}
          className={`px-3 py-2 rounded text-white ${
            "bg-gray-700 hover:bg-purple-500"
              // : "bg-purple-600 hover:bg-purple-500"
            // buttonsDisabled
            //   ? "bg-gray-500/50 cursor-not-allowed"
            //   : "bg-gray-700 hover:bg-purple-500"
            //   // : "bg-purple-600 hover:bg-purple-500"
          }`}
          title="Открыть крупно"
        >
          Крупно
        </button>

        <button
          onClick={onOpenLibrary}
          disabled={buttonsDisabled}
          title={!isAuthed ? "Войдите, чтобы открывать библиотеку" : undefined}
          className="px-3 py-2 rounded bg-gray-800 text-white"
        >
          Библиотека
        </button>
      </div>
    </>
  );
}
