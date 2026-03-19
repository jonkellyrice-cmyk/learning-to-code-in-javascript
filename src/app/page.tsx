// MDV_BLOCK:BEGIN id="APP.PAGE.001", intent="Thin page shell that renders the root UI surface via the UI adapter", kind="ui-shell", tags="nextjs,page,thin-shell"

export const dynamic = "force-dynamic";// MDV_BLOCK:BEGIN id="ENG.APP.PAGE.010" kind="module" type="imports" tags="module,imports"


import { AppUI } from "@/ui";
// MDV_BLOCK:END id="ENG.APP.PAGE.010" kind="module" type="imports" tags="module,imports"
 // adapter import (src/ui/index.tsx)

export default function Page() {
  return <AppUI />;
}

// MDV_BLOCK:END id="APP.PAGE.001"