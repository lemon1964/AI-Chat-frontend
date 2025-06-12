// frontend/src/reducers/modelReducer.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ModelState = {
  modelType: 'text',
  selectedModel: 'deepseek_qwen3',
};

function getDefaultModelForType(type: ModelType): string {
  const models = {
    text: 'deepseek_qwen3',
    code: 'llama3_coder',
    image: 'flux_schnell_free'
  };
  return models[type];
}

const modelSlice = createSlice({
  name: "model",
  initialState,
  reducers: {
    setModelType: (state, action: PayloadAction<ModelType>) => {
      state.modelType = action.payload;
      state.selectedModel = getDefaultModelForType(action.payload);
    },
    setModel: (state, action: PayloadAction<string>) => {
      state.selectedModel = action.payload;
    },
  },
});

// Экспортируем все actions
export const modelActions = modelSlice.actions;
export default modelSlice.reducer;
