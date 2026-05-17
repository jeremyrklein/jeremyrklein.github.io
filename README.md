# Game Night Hall of Fame

Private, GitHub-only hall-of-fame site for your friend group.

## Stack

- React + Vite frontend
- GitHub repository as source of truth
- GitHub Pages hosting
- JSON data files in `public/data`
- Photos in `public/photos`
- Optional client-side shared password for detailed stats

## Local development

1. Install dependencies
	- `npm install`
2. Run the app
	- `npm run dev`
3. Build production output
	- `npm run build`

## Data structure

All content is editable through GitHub web UI, VS Code, Copilot, or normal git workflows.

- `public/data/players.json`
- `public/data/events.json`
- `public/data/games.json`
- `public/data/achievements.json`
- `public/data/gameTypes.json`

## Photo workflow

1. Add images under:
	- `public/photos/players/`
	- `public/photos/events/`
2. Reference image paths in JSON as absolute public paths, for example:
	- `/photos/players/alex.jpg`
3. Commit and push.

## Shared password gating

Detailed stats are hidden behind a shared password gate in the browser.

- This is privacy-through-obscurity only, not real security.
- Set password in local env:
  - create `.env` with `VITE_SHARED_PASSWORD=your-shared-password`

If not provided, the default password is `game-night`.

## Deploy to GitHub Pages

1. Push this repository to GitHub (default branch `main`).
2. In GitHub repository settings, enable Pages with source set to **GitHub Actions**.
3. Push to `main` and the deploy workflow publishes automatically.

You can still deploy manually with:
- `npm run deploy`

## Preview locally

- Development preview: `npm run dev`
- Production preview: `npm run build && npm run preview`

## Notes

- No Airtable, Supabase, Firebase, Vercel, or external DB/SaaS dependencies.
- Data loading is dynamic from `/public/data` using a reusable loader layer.
- Event recaps support Markdown via `react-markdown`.
