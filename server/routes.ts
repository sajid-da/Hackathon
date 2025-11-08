import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { categorizeEmergency } from "./gemini";
import { findNearbyResponders } from "./places";
import { searchRespondersWithGemini, getCityFromCoordinates } from "./gemini-search";
import { insertUserSchema, insertAlertSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Test endpoint to verify Google Places API is working
  app.get("/api/test-places", async (req, res) => {
    try {
      const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        return res.json({ 
          status: "error", 
          message: "API key not configured",
          solution: "Set VITE_GOOGLE_MAPS_API_KEY in Secrets"
        });
      }

      console.log("[Test] Testing Places API with key:", apiKey.substring(0, 10) + "...");
      
      // Test with Delhi coordinates for a hospital search
      const testLat = 28.6139;
      const testLng = 77.2090;
      
      const axios = (await import("axios")).default;
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
        {
          params: {
            location: `${testLat},${testLng}`,
            radius: 5000,
            type: "hospital",
            key: apiKey,
          },
        }
      );

      console.log("[Test] Places API response status:", response.data.status);
      console.log("[Test] Results count:", response.data.results?.length || 0);
      
      if (response.data.status === "REQUEST_DENIED") {
        return res.json({
          status: "error",
          apiStatus: response.data.status,
          message: "Places API not enabled or billing not configured",
          error: response.data.error_message,
          solution: "Enable Places API in Google Cloud Console and set up billing"
        });
      }

      res.json({
        status: "success",
        apiStatus: response.data.status,
        resultsCount: response.data.results?.length || 0,
        sampleResults: response.data.results?.slice(0, 3).map((r: any) => ({
          name: r.name,
          address: r.vicinity,
          rating: r.rating
        })) || [],
        message: "Places API is working! You'll see real responders now."
      });
    } catch (error: any) {
      console.error("[Test] Error:", error.message);
      res.json({ 
        status: "error", 
        message: error.message,
        solution: "Check API key and enable Places API"
      });
    }
  });

  // Emergency categorization endpoint
  app.post("/api/emergency/categorize", async (req, res) => {
    try {
      const { message } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }

      const categorization = await categorizeEmergency(message);
      res.json(categorization);
    } catch (error) {
      console.error("Categorization error:", error);
      res.status(500).json({ error: "Failed to categorize emergency" });
    }
  });

  // Find nearby responders endpoint - uses Google Places API, then Gemini web search as fallback
  app.get("/api/emergency/responders", async (req, res) => {
    try {
      const { lat, lng, type } = req.query;

      if (!lat || !lng) {
        return res.status(400).json({ error: "Location is required" });
      }

      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lng as string);
      const category = type as string || "medical";

      console.log(`[API] Finding ${category} responders near ${latitude}, ${longitude}`);

      // Try Google Places API first
      let placeResults = await findNearbyResponders(category, latitude, longitude, 3);

      // If Places API failed or returned no results, use Gemini AI web search
      if (placeResults.length === 0) {
        console.log("[API] 🤖 Places API returned no results, using Gemini web search...");
        
        // Get city name from coordinates for better search
        const cityName = await getCityFromCoordinates(latitude, longitude);
        console.log(`[API] Searching for ${category} responders in ${cityName}`);
        
        const geminiResults = await searchRespondersWithGemini(
          category, 
          latitude, 
          longitude, 
          cityName,
          3
        );

        if (geminiResults.length > 0) {
          const responders = geminiResults.map((result, index) => ({
            name: result.name,
            address: result.address,
            distance: result.distance || 0,
            type: category,
            placeId: `gemini-${index}`,
            location: { lat: latitude, lng: longitude },
            phone: result.phone,
            rating: result.rating,
            priority: index === 0 ? 1 : index + 1,
            hours: result.hours || "Call for hours",
          }));

          console.log(`[API] ✅ Returning ${responders.length} responders from Gemini web search`);
          return res.json(responders);
        }
      }

      const responders = placeResults.map((place, index) => ({
        name: place.name,
        address: place.address,
        distance: place.distance,
        type: category,
        placeId: place.placeId,
        location: place.location,
        phone: place.phone,
        rating: place.rating,
        priority: index === 0 ? 1 : index + 1,
        hours: place.hours,
      }));

      console.log(`[API] Returning ${responders.length} responders`);
      res.json(responders);
    } catch (error) {
      console.error("Responders error:", error);
      res.status(500).json({ error: "Failed to find responders" });
    }
  });

  // Create alert endpoint
  app.post("/api/alerts", async (req, res) => {
    try {
      const validatedData = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(validatedData);
      res.json(alert);
    } catch (error) {
      console.error("Create alert error:", error);
      res.status(400).json({ error: "Invalid alert data" });
    }
  });

  // Get all alerts endpoint
  app.get("/api/alerts", async (_req, res) => {
    try {
      const alerts = await storage.getAllAlerts();
      res.json(alerts);
    } catch (error) {
      console.error("Get alerts error:", error);
      res.status(500).json({ error: "Failed to get alerts" });
    }
  });

  // Get user alerts endpoint
  app.get("/api/alerts/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const alerts = await storage.getAlertsByUser(userId);
      res.json(alerts);
    } catch (error) {
      console.error("Get user alerts error:", error);
      res.status(500).json({ error: "Failed to get user alerts" });
    }
  });

  // Update alert status endpoint
  app.patch("/api/alerts/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }

      const alert = await storage.updateAlertStatus(id, status);
      if (!alert) {
        return res.status(404).json({ error: "Alert not found" });
      }

      res.json(alert);
    } catch (error) {
      console.error("Update alert status error:", error);
      res.status(500).json({ error: "Failed to update alert status" });
    }
  });

  // User endpoints
  app.post("/api/users", async (req, res) => {
    try {
      console.log("[POST /api/users] Request body:", JSON.stringify(req.body, null, 2));
      const validatedData = insertUserSchema.parse(req.body);
      console.log("[POST /api/users] Validated data:", JSON.stringify(validatedData, null, 2));
      const user = await storage.createUser(validatedData);
      console.log("[POST /api/users] Created user:", JSON.stringify(user, null, 2));
      res.json(user);
    } catch (error) {
      console.error("[POST /api/users] Error:", error);
      if (error instanceof Error) {
        console.error("[POST /api/users] Error message:", error.message);
        console.error("[POST /api/users] Error stack:", error.stack);
      }
      res.status(400).json({ error: "Invalid user data", details: error instanceof Error ? error.message : String(error) });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const user = await storage.getUser(id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const user = await storage.updateUser(id, req.body);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
