// src/components/features/chat/CategoryViews/CategoryForm.tsx
import { localizationService } from "@/services/localizationService";

interface CategoryFormProps {
  newName: string;
  setNewName: (value: string) => void;
  onAdd: () => void;
}

export default function CategoryForm({ newName, setNewName, onAdd }: CategoryFormProps) {
  return (
    <div className="mt-4">
      <input
        type="text"
        value={newName}
        onChange={e => setNewName(e.target.value)}
        placeholder={localizationService.get("NewCategory")}
        className="w-full px-3 py-2 text-gray-700 bg-white border rounded mb-2 focus:outline-none"
      />
      <button
        onClick={onAdd}
        className="w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        {localizationService.get("CreateCategory")}
      </button>
    </div>
  );
}
