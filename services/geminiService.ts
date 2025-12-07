/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI } from "@google/genai";
import { VisualPromptState } from "../types";

const API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Helper to sanitize JSON
const cleanJson = (text: string) => {
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!API_KEY) throw new Error("API Key missing");

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: message,
    config: {
      systemInstruction: "You are LUMI, a helpful AI assistant for a music festival. Keep your answers brief, energetic, and helpful.",
    }
  });

  return response.text || "I'm having trouble connecting to the network right now.";
};