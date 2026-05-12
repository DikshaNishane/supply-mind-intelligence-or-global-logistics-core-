import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const buildFallbackResponse = (messages: any[] = []) => {
    const lastUserMessage = [...messages].reverse().find((msg) => msg?.role === 'user');
    const prompt = Array.isArray(lastUserMessage?.parts)
      ? String(lastUserMessage.parts.map((p: any) => p?.text ?? '').join(' ')).trim()
      : '';

    const lower = prompt.toLowerCase();
    if (lower.includes('fuel')) {
      return `### Fuel Price Analysis\n- Global bunker prices are likely to stay volatile near major chokepoints.\n- Consider dynamic surcharge rules for Red Sea and Hormuz routes.\n- Prioritize fuel-efficient routing and slow-steaming on non-urgent shipments.`;
    }

    if (lower.includes('hormuz') || lower.includes('reroute')) {
      return `### Route Mitigation Plan\n- Reroute high-value cargo away from the Strait of Hormuz where possible.\n- Increase ETA buffers and insurance coverage for exposed lanes.\n- Maintain real-time vessel monitoring for alternative ports of call.`;
    }

    return `### Neural Core Offline Mode\n- The Gemini model is currently busy, so I’m using a local fallback analysis.\n- Review active risk streams, then prioritize rerouting, ETA buffering, and fuel-cost controls.\n- If you want, I can refine this answer once the model is available again.`;
  };

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
      const genAI = new GoogleGenAI({ apiKey });

      const modelsToTry = ["gemini-2.5-flash", "gemini-1.5-flash"];
      let lastError: unknown = null;

      for (const model of modelsToTry) {
        try {
          const response = await genAI.models.generateContent({
            model,
            contents: messages,
            config: {
              temperature: 0.7,
              systemInstruction,
            },
          });

          return res.json({ text: response.text });
        } catch (error) {
          lastError = error;
          console.warn(`[NEURAL WARN] Model ${model} failed, trying fallback.`, error);
        }
      }

      console.warn("[NEURAL WARN] All Gemini models failed; serving fallback response.", lastError);
      return res.json({ text: buildFallbackResponse(messages) });
    } catch (error) {
      console.error("[NEURAL ERROR]", error);
      const message = error instanceof Error ? error.message : "Neural core link failure.";
      res.status(500).json({ error: message });
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
