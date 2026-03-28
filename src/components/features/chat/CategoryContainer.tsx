// src/components/features/chat/CategoryContainer.tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { showNotification } from "@/reducers/notificationReducer";
import { useGetCategoriesQuery, useCreateCategoryMutation } from "@/services/chatApi";
import AuthRequiredView from "./CategoryViews/AuthRequiredView";
import CategoriesView from "./CategoryViews/CategoriesView";
import { localizationService } from "@/services/localizationService";

interface CategoryContainerProps {
  onSelect: (id: string, name: string) => void;
}

const CategoryContainer = ({ onSelect }: CategoryContainerProps) => {
  const { data: session } = useSession();
  const dispatch = useDispatch<AppDispatch>();
  const [newName, setNewName] = useState("");

  const {
    data: categories,
    isLoading,
    error,
    refetch,
  } = useGetCategoriesQuery(undefined, {
    skip: !session,
  });

  const [createCategory] = useCreateCategoryMutation();

  const handleAddCategory = async () => {
    if (!newName.trim()) return;
    try {
      await createCategory({ name: newName.trim() }).unwrap();
      setNewName("");
      dispatch(showNotification(localizationService.get("CategoryCreatedSuccess"), "success", 3));
    } catch {
      dispatch(showNotification(localizationService.get("CategoryCreatedError"), "error", 3));
    }
  };

  if (!session) {
    return <AuthRequiredView onSelect={onSelect} />;
  }

  return (
    <CategoriesView
      categories={categories}
      isLoading={isLoading}
      error={error}
      newName={newName}
      setNewName={setNewName}
      onSelect={onSelect}
      onAdd={handleAddCategory}
      onRetry={refetch}
    />
  );
};

export default CategoryContainer;