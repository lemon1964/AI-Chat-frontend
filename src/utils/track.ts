// ai-chat-next/src/utils/track.ts
const TRACK_BASE = "https://lemon1964.pythonanywhere.com/t.gif";
const TRACK_KEY = process.env.NEXT_PUBLIC_TRACK_KEY as string;

export const track = (event: string, src: string) => {
  if (!TRACK_KEY) return;
  const url =
    `${TRACK_BASE}?` +
    `e=${encodeURIComponent(event)}` +
    `&src=${encodeURIComponent(src)}` +
    `&k=${encodeURIComponent(TRACK_KEY)}` +
    `&t=${Date.now()}`; // чтобы не кэшировалось

  // fallback: пиксель через Image()
  const img = new Image();
  img.src = url;
};
