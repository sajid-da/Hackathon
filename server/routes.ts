import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { categorizeEmergency } from "./gemini";
import { insertUserSchema, insertAlertSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
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

  // Find nearby responders endpoint
  app.get("/api/emergency/responders", async (req, res) => {
    try {
      const { lat, lng, type } = req.query;

      if (!lat || !lng) {
        return res.status(400).json({ error: "Location is required" });
      }

      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lng as string);
      const category = type as string || "medical";

      const responderRecords = await storage.getRespondersByType(category, latitude, longitude, 3);

      const responders = responderRecords.map((record, index) => ({
        name: record.name,
        address: record.address,
        distance: record.distance,
        type: record.type,
        placeId: record.id,
        location: record.location,
        phone: record.phone,
        rating: record.rating ? parseFloat(record.rating) : undefined,
        priority: index === 0 ? 1 : index + 1,
        hours: record.hours,
      }));

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
