# Flower Assistant

A React + Vite web app with an Express backend for plant/flower identification and AI-powered chat.

## Architecture

- **Frontend**: React 19 + Vite, runs on port 5000 (dev)
- **Backend**: Express.js server, runs on port 3001
- **Dev workflow**: `npm run dev` starts both via `npm-run-all --parallel`

## Key Features

- Plant/flower identification via PlantNet API (image upload)
- AI chat assistant powered by Qwen (通义千问) API
- AI care tips and taxonomy translation via Qwen
- Feedback collection (stored in `feedback.json`)

## Environment Variables

Copy `.env.example` to `.env` and fill in:
- `VITE_QWEN_API_KEY` — Qwen/通义千问 API key (required for AI chat)
- `PLANTNET_API_KEY` — PlantNet API key (optional, for photo plant ID)

## Development

```bash
npm install
npm run dev
```

## Deployment

Build + serve via Express:
- Build: `npm run build` (generates `dist/`)
- Run: `node server.js` (serves static `dist/` + API on port 3001)
- Deployment target: autoscale

## Project Structure

```
src/           React frontend source
server.js      Express backend (API proxy + static file serving)
vite.config.ts Vite config (port 5000, proxy /api → localhost:3001)
feedback.json  Persistent feedback storage
```
