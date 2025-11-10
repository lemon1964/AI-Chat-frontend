// src/components/features/layout/Layout.tsx
import { FC, ReactNode, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { audioService } from "@/services/audioService";
import { MobileHeader } from "@features/layout/MobileHeader";
import { DesktopHeader } from "@features/layout/DesktopHeader";
import CategoryContainer from "@features/chat/CategoryContainer";

export type LayoutProps = {
  children: ReactNode;
  onCategorySelect: (id: string, name: string) => void;
};

export const Layout: FC<LayoutProps> = ({ children, onCategorySelect }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const modelType = useSelector((state: RootState) => state.model.modelType);
  const selectedModel = useSelector((state: RootState) => state.model.selectedModel);

  useEffect(() => {
    audioService.playMusic("/music/track.mp3");
    return () => audioService.stopMusic();
  }, []);

  const handleCategory = (id: string, name: string) => {
    onCategorySelect(id, name);
    setMenuOpen(false);
  };

  return (
    <div className="flex flex-col h-screen">
      <MobileHeader
        onMenuToggle={() => setMenuOpen(o => !o)}
        modelType={modelType}
        selectedModel={selectedModel}
      />
      <DesktopHeader modelType={modelType} selectedModel={selectedModel} />
      <div className="flex flex-1 overflow-hidden min-h-0">
        <aside className="hidden md:block md:w-1/5 border-r overflow-y-auto p-4">
          <CategoryContainer onSelect={handleCategory} />
        </aside>
        {isMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
            <aside className="absolute left-0 top-0 w-3/4 h-full bg-gray-900 p-4">
              <CategoryContainer onSelect={handleCategory} />
            </aside>
          </div>
        )}
        <main className="flex-1 flex flex-col">{children}</main>
      </div>
    </div>
  );
};