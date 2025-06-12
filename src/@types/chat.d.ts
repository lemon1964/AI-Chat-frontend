// frontend/src/@types/chat.d.ts
interface Answer {
  id: string;
  question: string;
  content: string;
  tokens_used: number | null;
  created_at: string;
}
interface Question {
  id: string;
  category: string;
  user: number;
  prompt: string;
  created_at: string;
  answers: Answer[];
  model: string;
  language: string;
}
interface Category {
  id: string;
  name: string;
  owner: number;
  questions: Question[];
}

interface Message {
  id: string;
  prompt: string;
  answers: { id: string; content: string }[];
}

interface ChatWindowProps {
  categoryId: string;
  categoryName: string;
}


interface ISpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onstart?: () => void;
  onend?: () => void;
}

interface Window {
  webkitSpeechRecognition: new () => ISpeechRecognition;
  SpeechRecognition: new () => ISpeechRecognition;
}

type ModelType = 'text' | 'code' | 'image';

interface ModelOption {
  id: string;
  name: string;
}

interface ModelState {
  modelType: ModelType;
  selectedModel: string;
}

interface ModelMapping {
  text: ModelOption[];
  code: ModelOption[];
  image: ModelOption[];
}

interface RateState {
  start: string; // ISO-строка времени начала периода
  counts: {
    text: number;
    code: number;
    image: number;
  };
}
