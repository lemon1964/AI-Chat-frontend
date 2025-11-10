// src/reducers/flagsReducer.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Limits = { text:number; code:number; image:number; diagram:number };
type FlagsState = {
  loaded: boolean;
  isAuthenticated: boolean;
  isPremium: boolean;
  limits: Limits | null;
  tier: string;
};

const initialState: FlagsState = {
  loaded: false,
  isAuthenticated: false,
  isPremium: false,
  limits: null,
  tier: "guest",
};

const flagsSlice = createSlice({
  name: "flags",
  initialState,
  reducers: {
    setFlags(state, action: PayloadAction<{isAuthenticated:boolean; isPremium:boolean; limits:Limits}>) {
      state.loaded = true;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.isPremium = action.payload.isPremium;
      state.limits = action.payload.limits;
      state.tier = action.payload.isPremium ? "premium" : action.payload.isAuthenticated ? "free" : "guest";
    },
    resetFlags() { return initialState; }
  }
});

export const flagsActions = flagsSlice.actions;
export default flagsSlice.reducer;
