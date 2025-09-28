export default function MermindAdjust({
    instruction,
    setInstruction,
    isAdjusting,
    onAdjust,
    buttonsDisabled
  }: {
    instruction: string;
    setInstruction: (v: string) => void;
    isAdjusting: boolean;
    onAdjust: () => void;
    buttonsDisabled: boolean
  }) {
    return (
      <div className="mt-4">
        <label className="block text-sm font-medium mb-1">Уточнение к диаграмме</label>
        <textarea
          className="w-full h-24 p-3 border rounded"
          placeholder="Например: добавь вебхук от Юкассы к бэкенду…"
          value={instruction}
          onChange={e => setInstruction(e.target.value)}
        />
        <div className="mt-2">
          <button
            onClick={onAdjust}
            disabled={isAdjusting || !instruction.trim() || buttonsDisabled}
            className={`px-3 py-2 rounded text-white ${
              isAdjusting || !instruction.trim()
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            {isAdjusting ? "Обновляем…" : "Уточнить"}
          </button>
        </div>
      </div>
    );
  }
  