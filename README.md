# SupplyMind AI — Global Logistics Command Center

<p align="center">
  <a href="https://supply-mind-intelligence-or-global.vercel.app/">
    <img src="https://img.shields.io/badge/Live%20Demo-Vercel-brightgreen?style=for-the-badge&logo=vercel" alt="Vercel Deploy" />
  </a>
  <a href="https://github.com/DikshaNishane/supply-mind-intelligence-or-global-logistics-core-">
    <img src="https://img.shields.io/github/stars/DikshaNishane/supply-mind-intelligence-or-global-logistics-core-?style=for-the-badge&logo=github" alt="GitHub stars" />
  </a>
  <img src="https://img.shields.io/badge/Status-Prototype-blue?style=for-the-badge" alt="status" />
</p>

<p align="center">
  <em>Developed with ❤️ and care by <strong>Diksha Nishane</strong></em>
</p>

## Overview

SupplyMind AI is a command-center prototype for maritime logistics: a real-time dashboard, 3D digital twin, and an LLM-powered Copilot for operational intelligence and risk mitigation.

This repository contains a Vite + React (TypeScript) frontend and a small Express-based Node server used during development as an API proxy to Google GenAI (Gemini).

Key capabilities

- Real-time simulated telemetry and threat scoring
- 3D mapping (Google Maps Platform 3D) for visual digital twin
- Neural Copilot (GenAI) proxy for natural language summaries and suggestions
- Interactive KPIs, shipment tables, and visualization widgets

---

## Live demo

Try the deployed demo on Vercel:

- https://supply-mind-intelligence-or-global.vercel.app/

---

## Table of contents

- [Features](#features)
- [Architecture](#architecture)
- [Quickstart (local)](#quickstart-local)
- [Environment variables](#environment-variables)
- [Vercel deployment](#vercel-deployment)
- [Project structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- Real-time simulation engine (neural pulses)
- 3D globe and Google Maps Platform integration
- LLM-powered Copilot (server proxied GenAI)
- KPI cards, charts, and interactive shipment table

---

## Architecture

The app uses a small Express server during local development (`server.ts`) to proxy AI calls and serve Vite middleware. In production (Vercel) the front end is built to static assets and serverless `api/*.js` routes are used for API calls.

---

## Quickstart (local)

Prerequisites: Node.js 18+, npm

```bash
git clone https://github.com/DikshaNishane/supply-mind-intelligence-or-global-logistics-core-.git
cd supplymind-ai
npm install
# create .env.local from .env.example and fill keys
npm run dev
```

Open http://localhost:3000

---

## Environment variables

Create a `.env.local` in the repository root (do NOT commit it). Required variables:

- `GEMINI_API_KEY` — Server-side GenAI key (private)
- `VITE_GOOGLE_MAPS_PLATFORM_KEY` — Client-side Google Maps key (prefixed with `VITE_`)

Example `.env.local` (DO NOT commit):

```env
GEMINI_API_KEY=your_gemini_api_key_here
VITE_GOOGLE_MAPS_PLATFORM_KEY=your_google_maps_key_here
```

---

## Vercel deployment

1. Import the GitHub repository into Vercel.
2. In Vercel dashboard add environment variables (`GEMINI_API_KEY`, `VITE_GOOGLE_MAPS_PLATFORM_KEY`).
3. Vercel will build with `vite build` and serve static assets; API routes in `/api` become serverless functions.

Note: server-side long-running features (sockets, persistent processes) are not supported in serverless functions.

---

## Project structure

```
.
├─ api/                # serverless API endpoints (used in production)
├─ src/                # React app
├─ server.ts           # Dev Express server (vite middleware + proxy)
├─ vite.config.ts
├─ vercel.json         # Vercel configuration
```

---

## Contributing

- Open issues and PRs on GitHub.
- Run `npm run lint` and `npm run build` before opening PRs.

---

## License

Add a LICENSE file if you wish to publish this repository under an open-source license.

---

If you'd like, I'll commit this README and push it to the repository now.
