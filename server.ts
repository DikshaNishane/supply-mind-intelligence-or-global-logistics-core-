import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  // Load local environment variables (e.g. .env.local) during development
  dotenv.config({ path: ".env.local" });
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const PORT = 3000;

  // --- Logistics Simulation Engine ---
  let simulationState = {
    scenario: "normal",
    threatLevel: 12,
    activeAlerts: 0,
  };

  // Mock "Real-time" Ticker
  setInterval(() => {
    // Randomly fluctuate risk scores slightly to feel "alive"
    const riskFluctuation = (Math.random() - 0.5) * 0.5;
    simulationState.threatLevel = Math.max(5, Math.min(95, simulationState.threatLevel + riskFluctuation));
    
    io.emit("neural_pulse", {
      timestamp: new Date().toISOString(),
      ...simulationState
    });
  }, 3000);

  // --- API Routes ---
  app.get("/api/health", (req, res) => {
    res.json({ status: "Neural Core Active", version: "2.0.0-PROD" });
  });

  app.get("/api/simulation/status", (req, res) => {
    res.json(simulationState);
  });

  app.post("/api/ai/chat", express.json(), async (req, res) => {
    const { messages, systemInstruction } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Neural Engine Key (GEMINI_API_KEY) not configured on server." });
    }

    try {
      const { GoogleGenAI } = await import("@google/genai");
      // GoogleGenAI's constructor typings expect an options object; cast to any for flexibility
      const genAI = new (GoogleGenAI as any)({ apiKey });
      const model = (genAI as any).getGenerativeModel({ model: "gemini-1.5-flash" }); // Use flash for efficiency

      const response = await model.generateContent({
        contents: messages,
        generationConfig: {
          temperature: 0.7,
        },
        systemInstruction: systemInstruction
      });

      res.json({ text: response.response.text() });
    } catch (error) {
      console.error("[NEURAL ERROR]", error);
      res.status(500).json({ error: "Neural core link failure." });
    }
  });

  app.post("/api/simulation/trigger", express.json(), (req, res) => {
    const { scenario } = req.body;
    simulationState.scenario = scenario;
    
    // Impact Calculation Logic
    if (scenario === 'hormuz_blockade') {
        simulationState.threatLevel = 92;
        simulationState.activeAlerts = 5;
    } else {
        simulationState.threatLevel = 15;
        simulationState.activeAlerts = 0;
    }

    io.emit("simulation_update", simulationState);
    res.json({ success: true, newState: simulationState });
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`[NEURAL CORE] Server running on http://localhost:${PORT}`);
  });
}

startServer();
