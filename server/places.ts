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

// Mock fallback data for when Places API fails
const getMockResponders = (category: string, latitude: number, longitude: number, limit: number): PlaceResult[] => {
  const mockData: Record<string, PlaceResult[]> = {
    medical: [
      {
        name: "All India Institute of Medical Sciences (AIIMS)",
        address: "Sri Aurobindo Marg, Ansari Nagar East, Delhi, 110029",
        location: { lat: 28.5672, lng: 77.2100 },
        phone: "+91-11-26588500",
        rating: 4.2,
        distance: calculateDistance(latitude, longitude, 28.5672, 77.2100),
        hours: "24/7",
        placeId: "mock-aiims-delhi"
      },
      {
        name: "Safdarjung Hospital",
        address: "Ring Road, Safdarjung Enclave, Delhi, 110029",
        location: { lat: 28.5646, lng: 77.2029 },
        phone: "+91-11-26165060",
        rating: 3.8,
        distance: calculateDistance(latitude, longitude, 28.5646, 77.2029),
        hours: "24/7",
        placeId: "mock-safdarjung"
      },
      {
        name: "Max Super Speciality Hospital",
        address: "Press Enclave Road, Saket, Delhi, 110017",
        location: { lat: 28.5244, lng: 77.2066 },
        phone: "+91-11-26515050",
        rating: 4.0,
        distance: calculateDistance(latitude, longitude, 28.5244, 77.2066),
        hours: "24/7",
        placeId: "mock-max-saket"
      }
    ],
    police: [
      {
        name: "Delhi Police Headquarters",
        address: "Jai Singh Road, Connaught Place, Delhi, 110001",
        location: { lat: 28.6304, lng: 77.2177 },
        phone: "100",
        rating: 3.5,
        distance: calculateDistance(latitude, longitude, 28.6304, 77.2177),
        hours: "24/7",
        placeId: "mock-police-hq"
      },
      {
        name: "Connaught Place Police Station",
        address: "Inner Circle, Connaught Place, Delhi, 110001",
        location: { lat: 28.6315, lng: 77.2195 },
        phone: "+91-11-23412323",
        rating: 3.3,
        distance: calculateDistance(latitude, longitude, 28.6315, 77.2195),
        hours: "24/7",
        placeId: "mock-cp-police"
      },
      {
        name: "Saket Police Station",
        address: "Saket, Delhi, 110017",
        location: { lat: 28.5244, lng: 77.2081 },
        phone: "+91-11-26856000",
        rating: 3.4,
        distance: calculateDistance(latitude, longitude, 28.5244, 77.2081),
        hours: "24/7",
        placeId: "mock-saket-police"
      }
    ],
    mental_health: [
      {
        name: "NIMHANS (Mental Health Helpline)",
        address: "National Helpline Number",
        location: { lat: 28.6139, lng: 77.2090 },
        phone: "08046110007",
        rating: 4.5,
        distance: calculateDistance(latitude, longitude, 28.6139, 77.2090),
        hours: "24/7",
        placeId: "mock-nimhans"
      },
      {
        name: "Delhi Psychiatry Centre",
        address: "Green Park, Delhi, 110016",
        location: { lat: 28.5503, lng: 77.2066 },
        phone: "+91-11-26562666",
        rating: 4.1,
        distance: calculateDistance(latitude, longitude, 28.5503, 77.2066),
        hours: "9 AM - 6 PM",
        placeId: "mock-delhi-psych"
      },
      {
        name: "Vandrevala Foundation Helpline",
        address: "Mental Health Support Helpline",
        location: { lat: 28.6139, lng: 77.2090 },
        phone: "1860-2662-345",
        rating: 4.3,
        distance: calculateDistance(latitude, longitude, 28.6139, 77.2090),
        hours: "24/7",
        placeId: "mock-vandrevala"
      }
    ],
    disaster: [
      {
        name: "National Disaster Response Force (NDRF)",
        address: "East Arjun Nagar, Delhi, 110051",
        location: { lat: 28.6497, lng: 77.2847 },
        phone: "011-24363260",
        rating: 4.6,
        distance: calculateDistance(latitude, longitude, 28.6497, 77.2847),
        hours: "24/7",
        placeId: "mock-ndrf"
      },
      {
        name: "Delhi Fire Service HQ",
        address: "Connaught Place, Delhi, 110001",
        location: { lat: 28.6315, lng: 77.2167 },
        phone: "101",
        rating: 3.9,
        distance: calculateDistance(latitude, longitude, 28.6315, 77.2167),
        hours: "24/7",
        placeId: "mock-fire-hq"
      },
      {
        name: "Delhi Disaster Management Authority",
        address: "I.P. Estate, Delhi, 110002",
        location: { lat: 28.6279, lng: 77.2426 },
        phone: "+91-11-23221275",
        rating: 3.7,
        distance: calculateDistance(latitude, longitude, 28.6279, 77.2426),
        hours: "9 AM - 6 PM",
        placeId: "mock-ddma"
      }
    ],
    finance: [
      {
        name: "RBI Consumer Education Centre",
        address: "Sansad Marg, New Delhi, 110001",
        location: { lat: 28.6173, lng: 77.2088 },
        phone: "1800-114-101",
        rating: 4.0,
        distance: calculateDistance(latitude, longitude, 28.6173, 77.2088),
        hours: "10 AM - 5 PM",
        placeId: "mock-rbi-helpline"
      },
      {
        name: "National Consumer Disputes Redressal Commission",
        address: "Janpath, New Delhi, 110001",
        location: { lat: 28.6219, lng: 77.2186 },
        phone: "+91-11-23382928",
        rating: 3.8,
        distance: calculateDistance(latitude, longitude, 28.6219, 77.2186),
        hours: "9 AM - 5 PM",
        placeId: "mock-ncdrc"
      },
      {
        name: "Financial Literacy Centre",
        address: "Connaught Place, New Delhi, 110001",
        location: { lat: 28.6289, lng: 77.2065 },
        phone: "+91-11-23415050",
        rating: 3.9,
        distance: calculateDistance(latitude, longitude, 28.6289, 77.2065),
        hours: "10 AM - 6 PM",
        placeId: "mock-fin-literacy"
      }
    ]
  };

  const responders = mockData[category] || mockData.medical;
  return responders
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
};

export async function findNearbyResponders(
  category: string,
  latitude: number,
  longitude: number,
  limit: number = 3
): Promise<PlaceResult[]> {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      console.warn("[Places API] Google Maps API key not configured, using mock data");
      return getMockResponders(category, latitude, longitude, limit);
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
      console.log("[Places API] Falling back to mock data");
      return getMockResponders(category, latitude, longitude, limit);
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
    console.log("[Places API] Using mock fallback data");
    return getMockResponders(category, latitude, longitude, limit);
  }
}
