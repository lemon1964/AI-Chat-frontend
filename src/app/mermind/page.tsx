// src/app/mermind/page.tsx
"use client";

import Script from "next/script";
import MermindContainer from "@features/mermind/MermindContainer";
import { ErrorBoundary } from "@ui/common/ErrorBoundary";

export default function Page() {
  return (
    <>
      {/* Глобальный mermaid из CDN, только на этой странице */}
      <Script
        id="mermaid-cdn"
        src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"
        strategy="afterInteractive"
      />
      <ErrorBoundary>
        <MermindContainer />
      </ErrorBoundary>
    </>
  );
}

// import MermindContainer from "@features/mermind/MermindContainer";

// export default function Page() {
//   return(
//   <MermindContainer />
//   )
// }
