// src/components/features/common/SoundVolume.tsx
"use client";
import { FC, useState, useEffect } from "react";
import { localizationService } from "@/services/localizationService";
import { audioService } from "@/services/audioService";

const SoundVolume: FC = () => {
  const [musicVol, setMusicVol] = useState<number>(audioService.getMusicVolume());
  const [speechVol, setSpeechVol] = useState<number>(audioService.getSpeechVolume());

  useEffect(() => {
    setMusicVol(audioService.getMusicVolume());
    setSpeechVol(audioService.getSpeechVolume());
  }, []);

  useEffect(() => {
    setMusicVol(audioService.getMusicVolume());
  }, []);

  return (
    <div className="space-y-6 p-4">
      {/* Музыка */}
      <div className="flex gap-2">
        <button
          onClick={() => audioService.playMusic("/music/track.mp3")}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {localizationService.get("Play")}
        </button>
        <button
          onClick={() => audioService.stopMusic()}
          className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          {localizationService.get("Stop")}
        </button>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          {localizationService.get("MusicVolume")}
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={musicVol}
          onChange={e => {
            const v = parseFloat(e.target.value);
            setMusicVol(v);
            audioService.setMusicVolume(v);
          }}
          className="w-full"
        />
      </div>
      {/* Речь */}
      <div>
        <label className="block text-sm font-medium mb-1">
          {localizationService.get("TTSVolume")}
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={speechVol}
          onChange={e => {
            const v = parseFloat(e.target.value);
            setSpeechVol(v);
            audioService.setSpeechVolume(v);
          }}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default SoundVolume;
