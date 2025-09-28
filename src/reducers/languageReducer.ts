import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LanguageState {
  current: "ru" | "en";
}

const initialState: LanguageState = { current: "ru" };

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<"ru" | "en">) => {
      state.current = action.payload;
    },
  },
});

export const languageActions = languageSlice.actions;
export default languageSlice.reducer;