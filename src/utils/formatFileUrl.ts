// src/utils/formatFileUrl.ts

// В будущем BASE_URL будет задаваться через .env
const BASE_URL = "http://localhost:8000";

export const formatFileUrl = (fileUrl: string) => {
  if (!fileUrl) return "/images/empty.png";       // Покажем пустую заглушку
  if (fileUrl.startsWith("http")) return fileUrl; // Абсолютный URL
  if (fileUrl.startsWith("/")) return fileUrl;    // Локальный public-файл
  return `${BASE_URL}${fileUrl}`;                 // Относительный путь от бэкенда
};