# RepFlow

RepFlow is a React workout planner that lets users enter available gym equipment and generate a custom 3-day training plan using Claude (Anthropic API).

## What this project does

- Collects equipment input from the user (for example: dumbbells, cable, kettlebells).
- Sends that equipment list to a local API route.
- Uses Claude to generate a structured workout plan.
- Displays the generated plan in a clean card layout by training day.

## Tech stack

- React + Vite
- TailwindCSS (via Vite plugin) + custom CSS
- Claude API (`/v1/messages`) through a Vite dev-server middleware route (`/api/workout-plan`)

## Prerequisites

- Node.js 18+ (recommended)
- npm
- Anthropic API key

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create/update `.env` in the project root:

```bash
CLAUDE_API_KEY=your_anthropic_api_key_here
CLAUDE_MODEL=claude-sonnet-4-20250514
```

Notes:
- `CLAUDE_API_KEY` is required.
- `CLAUDE_MODEL` is optional. If a model is unavailable, the app includes fallback logic to retry with an available model from your account.

## Run locally

Start the dev server:

```bash
npm run dev
```

Open the local URL shown in your terminal (usually `http://localhost:5173`).

## Other scripts

- Lint:

```bash
npm run lint
```

- Build for production:

```bash
npm run build
```

- Preview production build:

```bash
npm run preview
```

## Security note

The Claude key is read on the server side (Vite middleware) and is not sent directly from browser code. Do not commit `.env` with real secrets.

## Troubleshooting

- `Missing CLAUDE_API_KEY in .env`
  - Add your key to `.env` and restart `npm run dev`.
- `not_found_error` for a model
  - Use a valid model in `.env` or let fallback logic choose one automatically.
- Port already in use
  - Vite will choose the next available port and print it in terminal.
