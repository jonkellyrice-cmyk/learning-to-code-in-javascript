# Roadmap — Desktop Sync → First OpenAI Streaming Test

This roadmap covers the concrete steps from syncing the repo on desktop
to the first successful end-to-end OpenAI API test (SSE streaming).

—

## 1) Sync desktop with GitHub (authoritative source)
- Open the repo folder on your desktop.
- Ensure you are on the correct branch (`main`).
- Pull latest changes from GitHub.

Goal:
- Desktop working tree exactly matches GitHub HEAD.
- No local divergence or missing files.

—

## 2) Verify core Next.js toolchain exists in repo
Confirm these files exist at repo root (tracked in git):
- `package.json`
- `tsconfig.json`
- `next.config.*` (if used)

If they exist locally but not in GitHub:
- Commit + push them AFTER pulling.

Goal:
- Any fresh clone can install and run the app.

—

## 3) Install dependencies and run dev (smoke test)
On desktop:
- `npm install`
- `npm run dev`
- Open `http://localhost:3000`

Expected:
- No 404
- App renders the stub UI
- No runtime crashes

Goal:
- System boots cleanly.

—

## 4) Add local OpenAI API key (never committed)
Create a file at repo root:
- `.env.local` (gitignored)

Add:
- `OPENAI_API_KEY=your_key_here`

Goal:
- Server-side OpenAI provider can read the key via `process.env`.

—

## 5) Sanity check API route before OpenAI
With dev server running:
- Send a POST request to `/api/chat`
- Confirm:
  - Route resolves
  - Response returns (even if stub)
  - No secrets leaked

Goal:
- Route wiring is correct.

—

## 6) Wire API route → engine → LLM → OpenAI (SSE)
Update `/api/chat` handler to:
- Call engine
- Engine calls LLM streaming function
- OpenAI provider emits SSE tokens

Confirm:
- Response headers are SSE-compatible
- Tokens stream incrementally

Goal:
- `/api/chat` streams responses.

—

## 7) First official OpenAI test (milestone)
### Test A: API-only
- POST to `/api/chat`
- Observe streamed tokens
- Confirm clean termination event

### Test B: UI-driven
- Load UI
- Send a message
- Confirm:
  - Message persists
  - Assistant response streams
  - No page reload

Goal:
- End-to-end streaming chat works.

—

## Success Criteria (v0.1 complete)
- `npm run dev` works on desktop
- `.env.local` supplies API key
- `/api/chat` streams via SSE
- UI sends and receives streaming responses

This marks the first operational orchestrator milestone.