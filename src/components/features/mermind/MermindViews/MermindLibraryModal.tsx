// src/components/features/mermind/MermindLibraryModal.tsx
import Modal from "@ui/common/Modal";
import { useState, useMemo } from "react";
import { parseTagsCSV } from "@/utils/tags";

export default function MermindLibraryModal({
  onClose,
  loading,
  items,
  onOpen,
  onRename,
  onDelete,
  // фильтры + поиск
  setLibQuery,
  libQuery,
  setLibType,
  libType,
  // setLibTags,
  libTags,
  setLibLimit,
  libLimit,
  // словари типов
  types,
  typeLabels,
  // еги
  availableTags,
  toggleTag,
  clearTags,
}: {
  onClose: () => void;
  loading: boolean;
  items: DiagramListItem[];
  onOpen: (id: number) => void;
  onRename: (id: number, title: string, tags?: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  setLibQuery: (v: string) => void;
  libQuery: string;
  setLibType: (v: string) => void;
  libType: string;
  libTags: string;
  setLibLimit: (v: number) => void;
  libLimit: number;
  types: string[];
  typeLabels: Record<string, string>;
  availableTags: string[];
  toggleTag: (tag: string) => void;
  clearTags: () => void;
}) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingTags, setEditingTags] = useState("");
  const selected = useMemo(() => new Set(parseTagsCSV(libTags)), [libTags]);

  const startRename = (d: { id: number; title: string; source_text: string; tags?: string }) => {
    setEditingId(d.id);
    setEditingTitle(d.title || d.source_text || "");
    setEditingTags(d.tags || "");
  };

  const submitRename = async () => {
    if (!editingId) return;
    await onRename(editingId, editingTitle.trim(), editingTags.trim());
    setEditingId(null);
  };

  return (
    <Modal onClose={onClose}>
      <div className="w-[90vw] max-w-2xl bg-gray-800 p-4 rounded-lg max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-3 text-gray-200">Мои диаграммы</h3>

        {/* панель фильтров */}
        <div className="sticky top-0 z-10 bg-gray-800 pb-3">
          <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Поиск */}
            <input
              className="border rounded px-2 py-1 w-full"
              value={libQuery}
              onChange={e => setLibQuery(e.target.value)}
              placeholder="Поиск…"
            />
            {/* Тип + лимит */}
            <div className="flex gap-2">
              <select
                className="border rounded px-2 py-1 flex-1"
                value={libType}
                onChange={e => setLibType(e.target.value)}
              >
                <option value="">все типы</option>
                {types.map(t => (
                  <option key={t} value={t}>
                    {typeLabels[t] ?? t}
                  </option>
                ))}
              </select>
              <select
                className="border rounded px-2 py-1 w-[90px]"
                value={libLimit}
                onChange={e => setLibLimit(Number(e.target.value))}
              >
                {[5, 20, 50, 100, 200].map(n => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Теги (чипы) */}
          {availableTags.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-400">Теги:</span>
              {availableTags.map(tag => {
                const isOn = selected.has(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={
                      "px-2 py-1 rounded text-xs transition " +
                      (isOn
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-200 hover:bg-gray-600")
                    }
                    title={tag}
                  >
                    #{tag}
                  </button>
                );
              })}
              {selected.size > 0 && (
                <button
                  onClick={clearTags}
                  className="ml-1 px-2 py-1 rounded text-xs bg-gray-600 text-white hover:bg-gray-500"
                  title="Сбросить теги"
                >
                  сбросить
                </button>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="py-6 text-gray-500">Загрузка…</div>
        ) : items.length === 0 ? (
          <div className="py-6 text-gray-500">Пока пусто</div>
        ) : (
          <ul className="divide-y">
            {items.map(d => (
              <li
                key={d.id}
                className="py-2 grid grid-cols-1 sm:grid-cols-[1fr_auto] items-start gap-2 sm:gap-4"
              >
                {/* Левая колонка: текст */}
                <div className="min-w-0">
                  {editingId === d.id ? (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        className="border rounded px-2 py-1 flex-1"
                        value={editingTitle}
                        onChange={e => setEditingTitle(e.target.value)}
                        placeholder="Название"
                      />
                      <input
                        className="border rounded px-2 py-1 flex-1"
                        value={editingTags}
                        onChange={e => setEditingTags(e.target.value)}
                        placeholder="Теги (через запятую)"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={submitRename}
                          className="px-3 py-1 bg-green-600 text-white rounded"
                        >
                          Сохранить
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 bg-gray-600 text-white rounded"
                        >
                          Отмена
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        className="font-medium block truncate max-w-[18ch] sm:max-w-[44ch]"
                        title={d.title || d.source_text}
                      >
                        {d.title || d.source_text}
                      </div>
                      <div className="text-xs text-gray-500">
                        {d.type} · {new Date(d.updated_at).toLocaleString()}
                        {d.tags ? <> · теги: {d.tags}</> : null}
                      </div>
                    </>
                  )}
                </div>

                {/* Правая колонка: кнопки (уходят на вторую строку на мобильном) */}
                {editingId !== d.id && (
                  <div className="flex flex-wrap justify-end sm:justify-start gap-2 sm:gap-2">
                    <button
                      onClick={() => onOpen(d.id)}
                      className="px-3 py-1 text-sm bg-gray-900 text-white rounded whitespace-nowrap"
                    >
                      Открыть
                    </button>
                    <button
                      onClick={() => startRename(d)}
                      className="px-3 py-1 text-sm bg-gray-700 text-white rounded whitespace-nowrap"
                    >
                      Переименовать
                    </button>
                    <button
                      onClick={() => onDelete(d.id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded whitespace-nowrap"
                    >
                      Удалить
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}
