
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { Problem } from "../types";

export class GeminiService {
  private getClient() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  private async withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> {
    try {
      return await fn();
    } catch (e: any) {
      const errorStr = e.message?.toLowerCase() || "";
      const isQuotaError = errorStr.includes('429') || errorStr.includes('quota') || errorStr.includes('limit');
      
      if (isQuotaError && retries > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.withRetry(fn, retries - 1, delay * 2);
      }
      throw e;
    }
  }

  async generateDailyProblems(topic: string, currentRating: number): Promise<Problem[]> {
    return this.withRetry(async () => {
      const ai = this.getClient();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        // Qat'iy 1000-1500 oralig'ini so'raymiz
        contents: `Mavzu: ${topic}. Codeforcesdan REYTINGI 1000 va 1500 ORASIDA BO'LGAN 5 ta qiyin va sifatli masalani JSON formatda (id, title, rating) qaytar. Masalalar oson bo'lmasligi shart.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                rating: { type: Type.NUMBER }
              },
              required: ["id", "title", "rating"]
            }
          }
        }
      });
      return JSON.parse(response.text);
    });
  }

  async getMentorResponse(history: { role: 'user' | 'model', parts: { text: string }[] }[], userInput: string) {
    return this.withRetry(async () => {
      const ai = this.getClient();
      const limitedHistory = history.slice(-10);

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...limitedHistory, { role: 'user', parts: [{ text: userInput }] }],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.9, // Yanada "blunt" va kutilmagan tanqidlar uchun 0.9
        }
      });
      return response.text;
    });
  }
}

export const gemini = new GeminiService();
