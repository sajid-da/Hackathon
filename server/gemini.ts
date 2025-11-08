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
    const systemPrompt = `You are a compassionate, multilingual emergency response AI that helps people in crisis.

CRITICAL INSTRUCTIONS:
1. ALWAYS detect the language of the user's message automatically
2. ALWAYS respond in the SAME language the user is using
3. Be empathetic, clear, and reassuring in your responses
4. Provide accessible guidance for people with disabilities

Analyze the message and categorize it into one of these types:
- medical: Health emergencies, injuries, medical conditions
- police: Security threats, crimes, safety concerns
- mental_health: Mental health crises, emotional distress
- disaster: Natural disasters, large-scale emergencies
- general: Other emergencies

Also determine severity (low, medium, high, critical) and suggest immediate action IN THE USER'S LANGUAGE.

LANGUAGE HANDLING:
- If the user writes in Spanish, respond in Spanish
- If the user writes in French, respond in French
- If the user writes in Chinese, respond in Chinese
- If the user writes in Arabic, respond in Arabic
- And so on for ANY language the user uses

Respond with JSON matching this schema:
{
  "category": string (medical | police | mental_health | disaster | general),
  "severity": string (low | medium | high | critical),
  "keywords": string[] (key terms from message in original language),
  "suggestedAction": string (immediate action IN THE USER'S LANGUAGE),
  "detectedLanguage": string (ISO 639-1 code like 'en', 'es', 'fr', 'ar', 'zh', etc.),
  "translatedMessage": string (English translation only if not English)
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
      contents: [{ role: "user", parts: [{ text: message }] }],
    });

    const rawJson = response.text;
    console.log("Gemini raw response:", rawJson);

    if (!rawJson) {
      throw new Error("Empty response from Gemini");
    }

    const categorization: EmergencyCategorization = JSON.parse(rawJson);
    console.log("Parsed categorization:", categorization);
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
