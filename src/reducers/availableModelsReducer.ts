// src/reducers/availableModelsReducer.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AvailableModelsState {
  text: Array<{ id: string; name: string }>;
  code: Array<{ id: string; name: string }>;
  image: Array<{ id: string; name: string }>;
}

const initialState: AvailableModelsState = {
  text: [],
  code: [],
  image: [{ id: "flux_schnell_free", name: "Flux" }],
};

export const availableModelsSlice = createSlice({
  name: "availableModels",
  initialState,
  reducers: {
    setAvailableModels: (state, action: PayloadAction<{
      text_models: Array<{ brand: string; model_id: string }>;
      code_models: Array<{ brand: string; model_id: string }>;
    }>) => {
      state.text = action.payload.text_models.map(m => ({
        id: m.model_id,
        name: m.brand.charAt(0).toUpperCase() + m.brand.slice(1),
      }));
      state.code = action.payload.code_models.map(m => ({
        id: m.model_id,
        name: m.brand.charAt(0).toUpperCase() + m.brand.slice(1),
      }));
    },
  },
});

export const { setAvailableModels } = availableModelsSlice.actions;
export default availableModelsSlice.reducer;
