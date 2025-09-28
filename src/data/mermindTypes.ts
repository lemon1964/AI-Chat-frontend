// ai-chat-next/src/data/mermindTypes.ts
export const TYPES: DiagramType[] = [
  "auto",
  "flowchart",
  "sequence",
  "state",
  "er",
  "class",
  "journey",
  "gantt",
  "timeline",
  "pie",
  "mindmap",
  "gitGraph",
  "quadrant",
];

export const TYPE_LABEL: Record<DiagramType, string> = {
  auto: "авто",
  flowchart: "блок-схема",
  sequence: "последовательность",
  state: "состояния",
  er: "ER-диаграмма",
  class: "классы",
  journey: "путь пользователя",
  gantt: "Гантт",
  timeline: "хронология",
  pie: "круговая",
  mindmap: "майнд-мэп",
  gitGraph: "git-граф",
  quadrant: "квадранты",
};