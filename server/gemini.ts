import { GoogleGenAI } from "@google/genai";
import type { EmergencyCategorization } from "@shared/schema";

// DON'T DELETE THIS COMMENT
// Using Gemini AI blueprint for emergency categorization
// Model: gemini-2.5-flash for fast responses

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function categorizeEmergency(
  message: string
): Promise<EmergencyCategorization> {
  try {
    const systemPrompt = `You are an emergency response AI that categorizes emergency situations.
Analyze the message and categorize it into one of these types:
- medical: Health emergencies, injuries, medical conditions
- police: Security threats, crimes, safety concerns
- mental_health: Mental health crises, emotional distress
- disaster: Natural disasters, large-scale emergencies
- general: Other emergencies

Also determine severity (low, medium, high, critical) and suggest immediate action.
Detect the language if not English and provide translation.

Respond with JSON matching this schema:
{
  "category": string (medical | police | mental_health | disaster | general),
  "severity": string (low | medium | high | critical),
  "keywords": string[] (key terms from message),
  "suggestedAction": string (immediate action to take),
  "detectedLanguage": string (optional, if not English),
  "translatedMessage": string (optional, English translation)
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              enum: ["medical", "police", "mental_health", "disaster", "general"],
            },
            severity: {
              type: "string",
              enum: ["low", "medium", "high", "critical"],
            },
            keywords: {
              type: "array",
              items: { type: "string" },
            },
            suggestedAction: { type: "string" },
            detectedLanguage: { type: "string" },
            translatedMessage: { type: "string" },
          },
          required: ["category", "severity", "keywords", "suggestedAction"],
        },
      },
      contents: message,
    });

    const rawJson = response.text;

    if (!rawJson) {
      throw new Error("Empty response from Gemini");
    }

    const categorization: EmergencyCategorization = JSON.parse(rawJson);
    return categorization;
  } catch (error) {
    console.error("Gemini categorization error:", error);
    return {
      category: "general",
      severity: "medium",
      keywords: [],
      suggestedAction: "Contact emergency services immediately",
    };
  }
}
