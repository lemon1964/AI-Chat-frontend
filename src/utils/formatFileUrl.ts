// frontend/src/utils/formatFileUrl.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
// const BASE_URL = "http://localhost:8000"; // Указываем API-бэкенд

export const formatFileUrl = (fileUrl: string) => {
  if (!fileUrl) return "/images/empty.png"; // или ваш плейсхолдер
  if (fileUrl.startsWith("http")) return fileUrl;
  if (fileUrl.startsWith("/")) return fileUrl;
  return `${BASE_URL}${fileUrl}`;
};
// export const formatFileUrl = (fileUrl: string) => {
//   if (!fileUrl) return `${BASE_URL}/media/images/unknown/empty.png`;
//   return fileUrl.startsWith("http") ? fileUrl : `${BASE_URL}${fileUrl}`;
// };
