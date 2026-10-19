import { GoogleGenAI } from "@google/genai";
import { AppError } from "./error";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const MODEL = "gemini-3.5-flash-lite"; // exact string docs se verify kar

type Opts = { maxTokens?: number; temperature?: number; json?: boolean };

export const generate = async (
  prompt: string,
  { maxTokens = 300, temperature = 0.5, json = false }: Opts = {},
): Promise<string> => {
  const res = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      temperature,
      maxOutputTokens: maxTokens,
      thinkingConfig: { thinkingBudget: 0 }, // hidden thinking tokens band
      ...(json && { responseMimeType: "application/json" }),
    },
  });

  const text = res.text?.trim();
  if (!text) throw new AppError("Gemini returned an empty response", 502);
  return text;
};
