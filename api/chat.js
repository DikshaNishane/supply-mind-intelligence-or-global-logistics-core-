import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

// Load local environment variables when running locally
dotenv.config({ path: ".env.local" });

export default async function handler(req, res) {
  const buildFallbackResponse = (messages = []) => {
    const lastUserMessage = [...messages].reverse().find((msg) => msg?.role === 'user');
    const prompt = Array.isArray(lastUserMessage?.parts)
      ? String(lastUserMessage.parts.map((p) => p?.text ?? '').join(' ')).trim()
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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, systemInstruction } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Neural Engine Key (GEMINI_API_KEY) not configured." });
  }

  try {
    const genAI = new GoogleGenAI({ apiKey });

    const modelsToTry = ["gemini-2.5-flash", "gemini-1.5-flash"];
    let lastError = null;

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

        return res.status(200).json({ text: response.text });
      } catch (error) {
        lastError = error;
        console.warn(`[NEURAL WARN] Model ${model} failed, trying fallback.`, error);
      }
    }

    console.warn('[NEURAL WARN] All Gemini models failed; serving fallback response.', lastError);
    return res.status(200).json({ text: buildFallbackResponse(messages) });
  } catch (error) {
    console.error("[NEURAL ERROR]", error);
    const message = error instanceof Error ? error.message : "Neural core link failure.";
    res.status(500).json({ error: message });
  }
}
