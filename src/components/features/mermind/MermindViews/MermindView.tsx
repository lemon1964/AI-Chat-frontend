// src/components/features/mermind/MermindView.tsx
import MermindToolbar from "./MermindToolbar";
import MermindPreview from "./MermindPreview";
import MermindEditor from "./MermindEditor";
import MermindAdjust from "./MermindAdjust";
import MermindLibraryModal from "./MermindLibraryModal";

type Props = {
  text: string;
  setText: (v: string) => void;
  type: DiagramType;
  setType: (t: DiagramType) => void;
  code: string;
  setCode: (v: string) => void;
  types: DiagramType[];
  typeLabels: Record<DiagramType, string>;
  svgHostRef: React.RefObject<HTMLDivElement | null>;
  detectedType: string;
  error: string | null;

  allModels: Array<{ id: string; name: string }>;
  selectedModel?: string | null;
  onModelChange: (id: string) => void;
  displayModel: string;
  usedModelBadgeSource: string;

  isGenerating: boolean;
  isSaving: boolean;
  isAdjusting: boolean;
  isAuthed: boolean;
  isReady: boolean;

  onGenerate: () => void;
  onSave: () => void;
  onDownloadSvg: () => void;

  instruction: string;
  setInstruction: (v: string) => void;
  onAdjust: () => void;

  isLibOpen: boolean;
  openLibrary: () => void;
  closeLibrary: () => void;
  library: DiagramListItem[];
  loadingLib: boolean;
  loadDiagram: (id: number) => void;
  renameDiagram: (id: number, title: string, tags?: string) => Promise<void>;
  deleteDiagram: (id: number) => Promise<void>;

  setLibQuery: (v: string) => void;
  libQuery: string;
  setLibType: (v: string) => void;
  libType: string;
  libTags: string;
  setLibLimit: (v: number) => void;
  libLimit: number;

  availableTags: string[];
  toggleTag: (tag: string) => void;
  clearTags: () => void;
  onOpenZoom: () => void;
};
// detectedType
export default function MermindView(props: Props) {
  const {
    text,
    setText,
    type,
    setType,
    code,
    setCode,
    types,
    typeLabels,
    svgHostRef,
    error,
    allModels,
    selectedModel,
    onModelChange,
    usedModelBadgeSource,
    isGenerating,
    isSaving,
    isAuthed,
    isReady,
    onGenerate,
    onSave,
    onDownloadSvg,
    instruction,
    setInstruction,
    isAdjusting,
    onAdjust,
    isLibOpen,
    openLibrary,
    closeLibrary,
    library,
    loadingLib,
    loadDiagram,
    renameDiagram,
    deleteDiagram,
    displayModel,
    setLibQuery,
    libQuery,
    setLibType,
    libType,
    libTags,
    setLibLimit,
    libLimit,
    availableTags,
    toggleTag,
    clearTags,
    onOpenZoom,
  } = props;
  const buttonsDisabled = !isReady || !isAuthed;
  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-6 bg-black">
      {/* левая колонка */}
      <div>
        <h2 className="text-xl text-white font-semibold mb-3">Описание</h2>
        <textarea
          className="w-full h-48 p-3 border rounded"
          placeholder="Опиши, что визуализировать…"
          value={text}
          onChange={e => setText(e.target.value)}
        />

        <MermindToolbar
          allModels={allModels}
          selectedModel={selectedModel || ""}
          onModelChange={onModelChange}
          usedModel={usedModelBadgeSource}
          type={type}
          types={types}
          typeLabels={typeLabels}
          setType={setType}
          isGenerating={isGenerating}
          onGenerate={onGenerate}
          canGenerate={Boolean(text.trim() && selectedModel)}
          onOpenLibrary={openLibrary}
          isSaving={isSaving}
          onSave={onSave}
          onDownloadSvg={onDownloadSvg}
          isAuthed={isAuthed}
          buttonsDisabled={buttonsDisabled}
          onOpenZoom={onOpenZoom}
        />

        <MermindAdjust
          instruction={instruction}
          setInstruction={setInstruction}
          isAdjusting={isAdjusting}
          onAdjust={onAdjust}
          buttonsDisabled={buttonsDisabled}
        />

        {error && <p className="text-red-600 mt-2 text-sm">Ошибка парсинга: {error}</p>}
      </div>

      {/* правая колонка */}
      <div>
        <MermindPreview svgHostRef={svgHostRef} displayModel={displayModel} code={code} />
        <MermindEditor code={code} setCode={setCode} />
      </div>

      {isLibOpen && (
        <MermindLibraryModal
          onClose={closeLibrary}
          loading={loadingLib}
          items={library}
          onOpen={loadDiagram}
          onRename={renameDiagram}
          onDelete={deleteDiagram}
          setLibQuery={setLibQuery}
          libQuery={libQuery}
          setLibType={setLibType}
          libType={libType}
          libTags={libTags}
          setLibLimit={setLibLimit}
          libLimit={libLimit}
          types={types}
          typeLabels={typeLabels}
          availableTags={availableTags}
          toggleTag={toggleTag}
          clearTags={clearTags}
        />
      )}
    </div>
  );
}
