// frontend/src/Components/chat/CategoryList.tsx
"use client";
import { FC, useState } from "react";
import { useGetCategoriesQuery, useCreateCategoryMutation } from "@/services/chatApi";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { showNotification } from "@/reducers/notificationReducer";
import { localizationService } from "@/services/localizationService";
import { demoCategories } from "@/lib/demoChat";


interface CategoryListProps {
  onSelect: (id: string, name: string) => void;
}

export const CategoryList: FC<CategoryListProps> = ({ onSelect }) => {
  const { data: session } = useSession();
  const dispatch = useDispatch<AppDispatch>();
  const [newName, setNewName] = useState("");

  // Запрашиваем рубрики, но только если пользователь залогинен
  const {
    data: categories,
    isLoading,
    error,
    refetch,
  } = useGetCategoriesQuery(undefined, {
    skip: !session,
  });

  const [createCategory] = useCreateCategoryMutation();

  const add = async () => {
    if (!newName.trim()) return;

    try {
      await createCategory({ name: newName.trim() }).unwrap();
      setNewName("");
      dispatch(showNotification(localizationService.get("CategoryCreatedSuccess"), "success", 3));
    } catch {
      // Во всех прочих случаях (401 уже разлогинил, или любая другая ошибка)
      dispatch(showNotification(localizationService.get("CategoryCreatedError"), "error", 3));
    }
  };

  if (!session) {
    return (
      <>
        <div className="p-4 text-gray-600">
          {localizationService.get("Please")}{" "}
          <a href="/api/auth/signin" className="text-blue-600 hover:underline">
            {localizationService.get("LogIn")}
          </a>{" "}
          {localizationService.get("OrRegister")}
        </div>

        {demoCategories.map(cat => (
          <button
            key={cat.id}
            className="block w-full text-left px-3 py-2 mb-2 border rounded hover:bg-gray-100"
            onClick={() => onSelect(cat.id, cat.name)}
          >
            {cat.name}
          </button>
        ))}
      </>
    );
  }

  if (isLoading) {
    return <div className="p-4">{localizationService.get("LoadingCategories")}</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-400 space-y-2">
        <p>{localizationService.get("ErrorLoadingCategories")}</p>
        <p className="text-sm text-red-300">{localizationService.get("ServerUnavailable")}</p>
        <button
          onClick={() => refetch()}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {localizationService.get("Retry")}
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Форма создания новой рубрики */}
      <div className="mt-4">
        <input
          type="text"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder={localizationService.get("NewCategory")}
          className="w-full px-3 py-2 text-gray-700 border rounded mb-2 focus:outline-none"
        />
        <button
          onClick={add}
          className="w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {localizationService.get("CreateCategory")}
        </button>
      </div>
      {/* Список существующих рубрик (новые наверху) */}
      {categories
        ?.slice() // создаём поверхностную копию, чтобы не мутировать оригинал
        .reverse() // теперь порядок обратный (новые будут первыми)
        .map((cat: { id: string; name: string }) => (
          <button
            key={cat.id}
            className="block w-full text-left px-3 py-2 mb-2 border rounded hover:bg-gray-100"
            onClick={() => onSelect(cat.id, cat.name)}
          >
            {cat.name}
          </button>
        ))}
    </div>
  );
};
