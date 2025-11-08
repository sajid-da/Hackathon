import axios from "axios";

const GOOGLE_MAPS_API_KEY = process.env.VITE_GOOGLE_MAPS_API_KEY || "";

// Map emergency categories to Google Places types
const categoryToPlaceTypes: Record<string, string[]> = {
  medical: ["hospital", "doctor", "pharmacy"],
  police: ["police"],
  mental_health: ["hospital", "doctor"],
  disaster: ["fire_station", "hospital"],
  finance: ["bank", "atm", "accounting"],
};

// Map emergency categories to search keywords for better results
const categoryToKeywords: Record<string, string> = {
  medical: "hospital emergency",
  police: "police station",
  mental_health: "mental health clinic counseling",
  disaster: "fire station emergency",
  finance: "bank consumer protection financial assistance",
};

export interface PlaceResult {
  name: string;
  address: string;
  location: { lat: number; lng: number };
  phone?: string;
  rating?: number;
  distance: number;
  hours?: string;
  placeId: string;
}

// Haversine formula to calculate distance
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function findNearbyResponders(
  category: string,
  latitude: number,
  longitude: number,
  limit: number = 3
): Promise<PlaceResult[]> {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      console.error("Google Maps API key not configured");
      throw new Error("Google Maps API key not configured");
    }

    const placeTypes = categoryToPlaceTypes[category] || ["hospital"];
    const keyword = categoryToKeywords[category] || "";
    
    console.log(`[Places API] Searching for ${category} near ${latitude}, ${longitude}`);
    console.log(`[Places API] Types: ${placeTypes.join(", ")}, Keyword: ${keyword}`);

    // Use Places API Nearby Search
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
      {
        params: {
          location: `${latitude},${longitude}`,
          radius: 20000, // 20km radius
          type: placeTypes[0], // Primary type
          keyword: keyword,
          key: GOOGLE_MAPS_API_KEY,
          region: "in", // India region bias
        },
      }
    );

    if (response.data.status !== "OK" && response.data.status !== "ZERO_RESULTS") {
      console.error("[Places API] Error:", response.data.status, response.data.error_message);
      throw new Error(`Places API error: ${response.data.status}`);
    }

    const places = response.data.results || [];
    console.log(`[Places API] Found ${places.length} results`);

    if (places.length === 0) {
      console.log("[Places API] No results found, returning empty array");
      return [];
    }

    // Map and enrich results
    const results: PlaceResult[] = await Promise.all(
      places.slice(0, limit * 2).map(async (place: any) => {
        const distance = calculateDistance(
          latitude,
          longitude,
          place.geometry.location.lat,
          place.geometry.location.lng
        );

        // Get place details for phone number and hours
        let phone: string | undefined;
        let hours: string | undefined;

        try {
          const detailsResponse = await axios.get(
            "https://maps.googleapis.com/maps/api/place/details/json",
            {
              params: {
                place_id: place.place_id,
                fields: "formatted_phone_number,opening_hours",
                key: GOOGLE_MAPS_API_KEY,
              },
            }
          );

          if (detailsResponse.data.status === "OK") {
            phone = detailsResponse.data.result.formatted_phone_number;
            const openingHours = detailsResponse.data.result.opening_hours;
            
            if (openingHours) {
              hours = openingHours.open_now 
                ? "Open now" 
                : openingHours.weekday_text?.[new Date().getDay()]?.replace(/\w+: /, "") || "Hours unavailable";
            }
          }
        } catch (error) {
          console.error(`[Places API] Failed to get details for ${place.name}:`, error);
        }

        return {
          name: place.name,
          address: place.vicinity || place.formatted_address || "Address unavailable",
          location: {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
          },
          phone,
          rating: place.rating,
          distance: Math.round(distance * 10) / 10, // Round to 1 decimal
          hours: hours || "24/7",
          placeId: place.place_id,
        };
      })
    );

    // Sort by distance and return top results
    const sorted = results
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);

    console.log(`[Places API] Returning ${sorted.length} sorted results`);
    return sorted;
  } catch (error) {
    console.error("[Places API] Error finding responders:", error);
    throw error;
  }
}
