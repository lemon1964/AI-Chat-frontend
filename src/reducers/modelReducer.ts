// src/reducers/modelReducer.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModelState {
  modelType: ModelType;
  selectedModel: string;
}

const initialState: ModelState = {
  modelType: "text",
  selectedModel: "",
};

const modelSlice = createSlice({
  name: "model",
  initialState,
  reducers: {
    setModelType: (state, action: PayloadAction<ModelState["modelType"]>) => {
      state.modelType = action.payload;
    },
    setModel: (state, action: PayloadAction<string>) => {
      state.selectedModel = action.payload;
    },
  },
});

export const modelActions = modelSlice.actions;
export default modelSlice.reducer;