"use client";
import { useCallback, useMemo, useState } from "react";
import { useDebouncedEffect } from "@/hooks/useDebouncedEffect";
import * as api from "@services/mermindClient";
import { parseTagsCSV, toTagsCSV, uniqSorted } from "@/utils/tags";

export type DiagramListItem = {
  id: number; title: string; source_text: string; tags?: string; type: string; updated_at: string;
};

export function useMermindLibrary() {
  const [isOpen, setOpen] = useState(false);
  const [items, setItems] = useState<DiagramListItem[]>([]);
  const [loading, setLoading] = useState(false);

  // фильтры
  const [q, setQ] = useState("");
  const [type, setType] = useState<string>("");
  const [tags, setTags] = useState("");
  const [limit, setLimit] = useState(50);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.listDiagrams({ q, type, tags, limit });
      setItems(data || []);
    } finally { setLoading(false); }
  }, [q, type, tags, limit]);

  const open = async () => { setOpen(true); await fetchList(); };
  const close = () => setOpen(false);

  useDebouncedEffect(() => { if (isOpen) fetchList(); }, [isOpen, q, type, tags, limit], 350);

  // теги
  const availableTags = useMemo(() => {
    const raw = new Set<string>();
    items.forEach(it => parseTagsCSV(it.tags || "").forEach(t => raw.add(t)));
    parseTagsCSV(tags).forEach(t => raw.add(t)); // держим выбранные видимыми
    return uniqSorted(Array.from(raw));
  }, [items, tags]);

  const selected = useMemo(() => new Set(parseTagsCSV(tags)), [tags]);
  const toggleTag = (tag: string) => {
    const next = new Set(selected);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    next.has(tag) ? next.delete(tag) : next.add(tag);
    setTags(toTagsCSV(Array.from(next)));
  };
  const clearTags = () => setTags("");

  // CRUD
  const loadOne = async (id: number) => api.getDiagram(id);
  const renameOne = async (id: number, title: string, tags?: string) => {
    await api.patchDiagram(id, { title, tags });
    setItems(list => list.map(d => (d.id === id ? { ...d, title, tags } : d)));
  };
  const deleteOne = async (id: number) => {
    await api.deleteDiagram(id);
    setItems(list => list.filter(d => d.id !== id));
  };

  return {
    // modal
    isOpen, open, close,
    // list
    items, loading,
    // filters
    q, setQ, type, setType, tags, setTags, limit, setLimit,
    availableTags, toggleTag, clearTags,
    // crud
    fetchList, loadOne, renameOne, deleteOne,
  };
}
