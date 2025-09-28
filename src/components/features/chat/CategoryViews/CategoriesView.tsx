// src/components/features/chat/CategoryViews/CategoriesView.tsx
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CategoryForm from "./CategoryForm";
import { localizationService } from "@/services/localizationService";
import InfoMessages from "./InfoMessages";

interface CategoriesViewProps {
  categories?: Array<{ id: string; name: string }>;
  isLoading: boolean;
  error: unknown;
  newName: string;
  setNewName: (value: string) => void;
  onSelect: (id: string, name: string) => void;
  onAdd: () => void;
  onRetry: () => void;
}

export default function CategoriesView({
  categories,
  isLoading,
  error,
  newName,
  setNewName,
  onSelect,
  onAdd,
  onRetry,
}: CategoriesViewProps) {
  const [expandedInfo, setExpandedInfo] = useState(false);

  if (isLoading) {
    return <div className="p-4">{localizationService.get("LoadingCategories")}</div>;
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 text-center text-red-400 space-y-2"
      >
        <p>{localizationService.get("ServerUnavailable")}</p>
        <button
          onClick={onRetry}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {localizationService.get("Retry")}
        </button>
      </motion.div>
    );
  }

  // Создаем копию и реверсируем порядок
  const reversedCategories = categories ? [...categories].reverse() : [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <CategoryForm newName={newName} setNewName={setNewName} onAdd={onAdd} />
      <div className="mt-4 text-white space-y-4">
        {/* Общий прокручиваемый блок: и категории, и сообщения */}
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-1 custom-scrollbar space-y-4">
          {/* Список категорий */}
          <div>
            {reversedCategories.map(cat => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="block w-full text-left px-3 py-2 mb-2 border rounded hover:bg-gray-100"
                onClick={() => onSelect(cat.id, cat.name)}
              >
                {cat.name}
              </motion.button>
            ))}
          </div>
          {/* Информационные блоки только для реальных пользователей */}
          <div className="mt-6">
            <div className="mt-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="border border-green-500 rounded-2xl p-4 text-green-500 italic text-sm"
              >
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setExpandedInfo(!expandedInfo)}
                    className="text-white hover:text-green-500 text-base font-medium transition-colors duration-200"
                  >
                    {expandedInfo
                      ? localizationService.get("HideInfo")
                      : localizationService.get("ShowInfo")}
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {expandedInfo && (
                    <motion.div
                      className="mt-4"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <InfoMessages type="auth" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}