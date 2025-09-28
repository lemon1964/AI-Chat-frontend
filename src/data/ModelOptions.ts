// src/data/ModelOptions.ts
export type ModelType = "text" | "code" | "image";

export const MODEL_OPTIONS: Record<ModelType, { id: string; name: string }[]> = {
  text: [
    { id: "deepseek_qwen3", name: "DeepSeek Qwen3" },
    { id: "mistral_devstral", name: "Mistral" },
    { id: "deephermes", name: "DeepHermes" },
  ],
  code: [
    { id: "openai/o4-mini", name: "OpenAI" },
    { id: "deepseek_prover", name: "DeepSeek Prover" },
    { id: "qwen3_coder", name: "Qwen3" },
  ],
  image: [
    { id: "flux_schnell_free", name: "Flux.1" },
  ],
};