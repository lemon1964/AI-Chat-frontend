// src/@types/mermind.ts
type DiagramType =
  | "auto"
  | "flowchart"
  | "sequence"
  | "state"
  | "er"
  | "class"
  | "journey"
  | "gantt"
  | "timeline"
  | "pie"
  | "mindmap"
  | "gitGraph"
  | "quadrant";


type Diagram = {
  id: number;
  title: string;
  tags?: string | undefined;

  source_text: string;
  type: string;
  code: string;
  model_used?: string;
  language?: string;
  created_at: string;
  updated_at: string;
}


type DiagramListItem = {
  id: number;
  title: string;
  source_text: string;
  tags?: string | undefined;
  type: string;
  updated_at: string;
  // model_used?: string;
}

// type DiagramListItem = {
//   id: number;
//   title: string;
//   source_text: string;
//   type: string;
//   updated_at: string;
//   model_used?: string;
// };

