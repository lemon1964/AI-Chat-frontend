// src/components/features/chat/ChatWindowViews/ChatHeader.tsx
import ModalAudio from "@ui/common/ModalAudio";
import SoundVolume from "../../common/SoundVolume";
import { localizationService } from "@/services/localizationService";

interface ChatHeaderProps {
  categoryName: string;
  audioModalOpen: boolean;
  setAudioModalOpen: (value: boolean) => void;
}

export const ChatHeader = ({
  categoryName,
  audioModalOpen,
  setAudioModalOpen,
}: ChatHeaderProps) => (
  <>
    <div className="p-4 border-b flex items-center justify-between bg-black">
      <h2 className="text-2xl font-bold break-words max-w-[70%] whitespace-normal line-clamp-2 text-white">
        {categoryName}
      </h2>
      <button
        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-blue-600 whitespace-nowrap"
        onClick={() => setAudioModalOpen(true)}
      >
        🔊 {localizationService.get("AudioSettings")}
      </button>
    </div>

    {audioModalOpen && (
      <ModalAudio
        title={localizationService.get("AudioSettings")}
        onClose={() => setAudioModalOpen(false)}
      >
        <SoundVolume />
      </ModalAudio>
    )}
  </>
);
