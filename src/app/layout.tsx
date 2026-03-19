// Stub layout.tsx -- minimal Next.js App Router shell
// Thin shell only.
// MDV_BLOCK:BEGIN id="APP.LAYOUT.001" intent="Minimal App Router layout stub to enable UI rendering; thin shell only" kind="ui-shell" tags="nextjs,layout,stub"

import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

// MDV_BLOCK:END id="APP.LAYOUT.001"