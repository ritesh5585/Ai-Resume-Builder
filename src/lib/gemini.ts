import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export const  generate = async (prompt: string) => {
    const interaction = await ai.interactions.create({
  model: "gemini-3.8-flash",
  input: prompt,
});
console.log(interaction.output_text);
return interaction.output_text
}