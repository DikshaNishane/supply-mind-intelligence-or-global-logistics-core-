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

## 🛠 Technical Architecture

- **Frontend:** React 18+ with TypeScript
- **State Management:** React Hooks & Memoization for high-frequency data updates
- **Visualization:** 
  - **3D Geospatial:** `Globe.gl` (Three.js 기반) & 3D Mapping Engines
  - **Analytics:** `Recharts` for time-series and risk radar charts
- **Animation:** `Motion` (Framer Motion) for fluid UI transitions
- **Styling:** Tailwind CSS with high-contrast "Dark Ops" aesthetic
- **Real-time:** Socket.io-client for simulated neural pulses and state updates

---

## 🔄 System Flow & Mechanism

### Data Ingestion Layer
The system processes simulated telemetry from over 1,100 active vessels and maritime nodes. This includes tracking IDs, vessel names, origin/destination coordinates, and current status (In-Transit, Delayed, Diverted).

### Intelligence Layer (Neural Core)
A central simulation engine (`useSimulation`) maintains the global "Threat Level." When a scenario is triggered (e.g., a blockade):
1. The **Threat Level** and **Active Alerts** scale dynamically.
2. The **Predictive Logic** recalculates ETAs and risk scores across the entire dataset.
3. The **AI Copilot** updates its system context to prioritize event-specific mitigations.

### Visualization & Interaction Layer
- The **3D Globe** projects data markers and arcs.
- **KPI Cards** react to neural pulses with "Glow" effects for critical deviations.
- **Shipment Tables** perform live sorting based on calculated risk scores.

---

## 📁 Technical Project Structure

```text
/src
  /components        # Reusable UI Atoms & Dashboard Widgets
    /dashboard       # KPI Cards, Maps, Tables, Chokepoint widgets
    /layout          # Sidebar, TopBar, and Layout Framework
  /hooks             # useSimulation (Neural pulse state)
  /lib               # Mock data generators and utility functions
  /pages             # Core Application Modules
    AICopilot.tsx    # Neural Chat Interface
    DigitalTwin.tsx  # 3D Simulation Environment
    CommandCenter.tsx # Main Operational Dashboard
    RiskIntel.tsx    # Threat Assessment Radar
  /services          # External API integrations
```

### 🚀 Vercel Deployment

This project is configured for seamless deployment on Vercel:

1. **Connect to GitHub:** Import your repository into the Vercel Dashboard.
2. **Configure Environment Variables:** Add the following variables in the **Vercel Project Settings > Environment Variables**:
   - `GEMINI_API_KEY`: Your Neural Engine API Key (from Google AI Studio).
   - `VITE_GOOGLE_MAPS_PLATFORM_KEY`: Your Google Maps Platform API Key.
3. **Deploy:** Vercel will automatically detect the configuration and deploy your app.

### 💻 Local Development (VS Code)

To run this locally and fix the 3D Mapping errors:

1. **Create a `.env.local` file** in the root directory.
2. **Add your keys** in this format:
   ```env
   GEMINI_API_KEY=your_gemini_key_here
   VITE_GOOGLE_MAPS_PLATFORM_KEY=your_google_maps_key_here
   ```
3. **Restart the dev server:** `npm run dev`

*Note: Variable names must match exactly. The `VITE_` prefix is required for the browser to see the Maps key.*

---

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- NPM

### Local Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd supplymind-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add your keys:
   ```env
   VITE_API_KEY=your_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```
