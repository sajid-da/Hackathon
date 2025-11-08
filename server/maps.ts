import type { Responder, Location } from "@shared/schema";

const GOOGLE_MAPS_API_KEY = process.env.VITE_GOOGLE_MAPS_API_KEY || "";

interface PlaceResult {
  name: string;
  vicinity: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  place_id: string;
  formatted_phone_number?: string;
  rating?: number;
}

function getPlaceType(category: string): string {
  switch (category) {
    case "medical":
      return "hospital";
    case "police":
      return "police";
    case "mental_health":
      return "hospital"; // Mental health facilities are often categorized as hospitals
    case "disaster":
      return "fire_station";
    default:
      return "hospital";
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function findNearbyResponders(
  location: Location,
  category: string
): Promise<Responder[]> {
  try {
    const placeType = getPlaceType(category);
    const radius = 10000; // 10km radius

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=${radius}&type=${placeType}&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Maps API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      console.error("Maps API error:", data.status, data.error_message);
      return [];
    }

    if (!data.results || data.results.length === 0) {
      return [];
    }

    const responders: Responder[] = data.results.slice(0, 9).map((place: PlaceResult) => {
      const distance = calculateDistance(
        location.lat,
        location.lng,
        place.geometry.location.lat,
        place.geometry.location.lng
      );

      return {
        name: place.name,
        address: place.vicinity,
        distance,
        type: placeType,
        placeId: place.place_id,
        location: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
        },
        phone: place.formatted_phone_number,
        rating: place.rating,
      };
    });

    responders.sort((a, b) => a.distance - b.distance);

    return responders;
  } catch (error) {
    console.error("Error finding responders:", error);
    return [];
  }
}

export async function getPlaceDetails(placeId: string): Promise<any> {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_phone_number,formatted_address,rating,opening_hours&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Place Details API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.result || null;
  } catch (error) {
    console.error("Error getting place details:", error);
    return null;
  }
}
