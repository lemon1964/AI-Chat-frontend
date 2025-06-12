import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../store/store";

interface NotificationState {
  message: string;
  type: "success" | "error" | "info" | "";
}

const initialState: NotificationState = { message: "", type: "" };

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotification: (_, action: PayloadAction<NotificationState>) => action.payload,
    clearNotification: () => initialState,
  },
});

export const { setNotification, clearNotification } = notificationSlice.actions;

export const showNotification =
  (message: string, type: "success" | "error" | "info" | "", duration = 3) =>
  (dispatch: AppDispatch) => {
    dispatch(setNotification({ message, type }));
    setTimeout(() => {
      dispatch(clearNotification());
    }, duration * 1000);
  };

export default notificationSlice.reducer;
