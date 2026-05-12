# SupplyMind AI: Global Logistics Intelligence Platform

SupplyMind AI is a next-generation supply chain command center designed for real-time maritime logistics monitoring, predictive risk assessment, and autonomous route optimization.

## 🚀 Core Capabilities

### 1. Unified Command Center
A high-density dashboard providing real-time telemetry on fleet health, global risk indices, and operational KPIs. It integrates live data streams with predictive modeling to provide a single source of truth for global logistics operations.

### 2. Autonomous Digital Twin
Powered by 3D geospatial engines, the Digital Twin provides a real-time virtual representation of the global maritime network. It enables users to:
- **Simulate "What-if" Scenarios:** Model the impact of port blockages, fuel price shocks, or weather disruptions.
- **Dynamic Rerouting:** Automatically calculate alternative paths (e.g., Cape of Good Hope bypass) during maritime choke-point closures.

### 3. Neural Intel Copilot
A sophisticated LLM-integrated interface that acts as the "AI Brain" of the platform. It processes natural language queries to provide technical logistics intelligence, executive summaries, and tactical mitigation plans.

### 4. Predictive Risk Intelligence
Utilizes multi-variant analysis to track global threats, from geopolitical instability in trade lanes to tropical storm impacts. Features include:
- **Threat Radar:** Visualizing intensity and proximity of risks.
- **Impact Quantification:** Real-time estimation of delay days and financial exposure.

---

# SupplyMind AI — Global Logistics Command Center

SupplyMind AI is a prototype command center for maritime logistics: a dashboard, 3D digital twin, and an LLM-driven assistant for operational intelligence and risk mitigation.

This repository contains a full-stack TypeScript/React app with a small Node server used to proxy requests to a generative model and serve the Vite front end during development.

Key features
- Real-time simulation engine driving telemetry and threat scores
- 3D mapping integration (Google Maps Platform 3D) for a live digital twin
- Neural Copilot (Google GenAI/Gemini) API proxy for LLM-driven summaries and recommendations
- Interactive KPIs, tables, and charts for operational situational awareness

## Quick start — run locally

Prerequisites
- Node.js 18+ (or compatible) and npm

Install and run

```bash
git clone https://github.com/DikshaNishane/supply-mind-intelligence-or-global-logistics-core-.git
cd supplymind-ai
npm install
# copy .env.example -> .env.local and fill values, or create .env.local
npm run dev
```

Open: http://localhost:3000

## Environment variables

The app uses both server-side and client-side environment variables. For local development create a `.env.local` file in the project root (this repo already contains an example `.env.example`):

Required variables
- `GEMINI_API_KEY` — Server-side key for Google GenAI (kept private)
- `VITE_GOOGLE_MAPS_PLATFORM_KEY` — Client-side Google Maps Platform key (must start with `VITE_` to be available in the browser)

Example `.env.local`

```env
GEMINI_API_KEY=your_gemini_api_key_here
VITE_GOOGLE_MAPS_PLATFORM_KEY=your_google_maps_key_here
```

Notes
- Do not commit `.env.local` to git. The `.gitignore` already excludes `env*` files.

## Deployment (Vercel)

This project is ready for Vercel. To deploy:

1. Import the GitHub repository into Vercel.
2. In the Vercel project settings, set the Environment Variables above for the Production and Preview environments.
3. Set the Root Directory to the repository root (this project serves via `server.ts` during dev, Vercel will run the build command `vite build`).
4. Deploy — Vercel will run the build and serve static assets.

Tip: Keep server-only secrets (like `GEMINI_API_KEY`) configured in the Vercel dashboard and do not expose them in client env variables.

## Project structure

High level

```
/
  server.ts            # Node server used for local dev + API proxy to GenAI
  vite.config.ts       # Vite configuration (exposes selected env vars to client)
  src/                 # React + TypeScript frontend
    components/        # UI components and map integration
    pages/             # App pages (CommandCenter, DigitalTwin, AICopilot)
  api/                 # Serverless-style API route used by some deployments
```

## Contributing

- Open an issue for bugs or feature requests.
- Create PRs against `main`.

## License

This repository is provided as-is for demonstration purposes. Add a license file if you intend to publish or share widely.

---

If you want, I can now:

- push this README change to GitHub (I will commit and push), or
- add a Vercel configuration / deployment script for automatic deployments.
