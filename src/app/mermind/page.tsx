// app/mermind/page.tsx
"use client";
import MermindContainer from "@features/mermind/MermindContainer";
import { ErrorBoundary } from "@ui/common/ErrorBoundary";

export default function Page() {
  return(
    <ErrorBoundary>
      <MermindContainer />
    </ErrorBoundary>
  )
  // <MermindContainer />;
}
