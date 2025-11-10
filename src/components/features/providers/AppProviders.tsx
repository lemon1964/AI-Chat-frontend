// src/components/features/providers/AppProviders.tsx
"use client";
import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import store from "@store/store";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Provider store={store}>{children}</Provider>
    </SessionProvider>
  );
}
