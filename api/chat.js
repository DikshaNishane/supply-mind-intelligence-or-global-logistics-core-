import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

// Load local environment variables when running locally
dotenv.config({ path: ".env.local" });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, systemInstruction } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Neural Engine Key (GEMINI_API_KEY) not configured." });
  }

  try {
    // Construct using an options object so the library receives the API key
    const genAI = new GoogleGenAI({ apiKey });
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const response = await model.generateContent({
      contents: messages,
      generationConfig: {
        temperature: 0.7,
      },
      systemInstruction: systemInstruction
    });

    res.status(200).json({ text: response.response.text() });
  } catch (error) {
    console.error("[NEURAL ERROR]", error);
    res.status(500).json({ error: "Neural core link failure." });
  }
}
