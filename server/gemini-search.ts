import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

interface ResponderSearchResult {
  name: string;
  address: string;
  phone?: string;
  distance?: number;
  rating?: number;
  hours?: string;
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

/**
 * Use Gemini AI to find real emergency responders near user's location
 * This is used as a fallback when Google Places API is unavailable
 */
export async function searchRespondersWithGemini(
  category: string,
  latitude: number,
  longitude: number,
  cityName?: string,
  limit: number = 3
): Promise<ResponderSearchResult[]> {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error("Gemini API key not configured");
    }

    // Determine city name from coordinates if not provided
    const locationDescription = cityName 
      ? cityName 
      : `coordinates ${latitude.toFixed(4)}, ${longitude.toFixed(4)} in India`;

    // Category-specific search queries
    const categoryQueries: Record<string, string> = {
      medical: `emergency hospitals medical centers ${locationDescription}`,
      police: `police stations ${locationDescription}`,
      mental_health: `mental health crisis centers counseling helpline ${locationDescription}`,
      disaster: `fire stations disaster response ${locationDescription}`,
      finance: `financial consumer protection helpline ${locationDescription}`
    };

    const searchQuery = categoryQueries[category] || categoryQueries.medical;

    console.log(`[Gemini Search] 🔍 Searching for: ${searchQuery}`);

    const prompt = `Find the ${limit} nearest REAL ${category} emergency responders near ${locationDescription}. Search your knowledge base and return ONLY actual facilities that exist with:
- Full official name
- Complete address with city/state
- Phone number (with +91 country code for India)
- Approximate distance in km
- Operating hours

Return as a valid JSON array with this exact format (no markdown, no backticks, just pure JSON):
[
  {
    "name": "Official Name",
    "address": "Full Address, City, State",
    "phone": "+91-XXX-XXX-XXXX",
    "distance": 2.5,
    "hours": "24/7 or specific hours"
  }
]

IMPORTANT RULES:
- Return ONLY facilities in ${locationDescription}, NOT Delhi unless that's the user location
- If user is in Bangalore, return Bangalore hospitals
- If user is in Mumbai, return Mumbai hospitals  
- Include phone numbers with +91 country code
- Calculate approximate distance in km
- Return ${limit} responders maximum
- Return ONLY the JSON array, no other text, no markdown formatting`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = response.text || "";
    console.log(`[Gemini Search] Raw response (first 400 chars): ${text.substring(0, 400)}...`);

    // Extract JSON from response (handle markdown code blocks)
    let jsonText = text.trim();
    
    // Remove markdown code blocks if present
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Find JSON array
    const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error("[Gemini Search] ❌ No JSON array found in response");
      console.error("[Gemini Search] Full response:", text);
      return [];
    }

    const responders = JSON.parse(jsonMatch[0]);
    
    if (!Array.isArray(responders) || responders.length === 0) {
      console.warn("[Gemini Search] ⚠️ Empty or invalid responders array");
      return [];
    }

    console.log(`[Gemini Search] ✅ Found ${responders.length} responders in ${locationDescription}`);
    console.log(`[Gemini Search] First responder: ${responders[0]?.name || 'N/A'}`);

    return responders;
  } catch (error) {
    console.error("[Gemini Search] ❌ Error:", error);
    return [];
  }
}

/**
 * Get city name from coordinates using Gemini
 */
export async function getCityFromCoordinates(
  latitude: number,
  longitude: number
): Promise<string> {
  try {
    if (!GEMINI_API_KEY) {
      return "India";
    }

    const prompt = `What is the city/town name at coordinates ${latitude}, ${longitude} in India? Return ONLY the city and state in format: "City, State". For example: "Bangalore, Karnataka" or "Mumbai, Maharashtra". Return ONLY the city name, nothing else.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const cityName = (response.text || "India").trim().replace(/["'`]/g, '');
    
    console.log(`[Gemini] 📍 Location ${latitude}, ${longitude} = ${cityName}`);
    
    return cityName;
  } catch (error) {
    console.error("[Gemini] Error getting city:", error);
    return "India";
  }
}
