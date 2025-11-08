import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  medicalInfo: text("medical_info"),
  emergencyContacts: jsonb("emergency_contacts").$type<EmergencyContact[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  message: text("message").notNull(),
  category: text("category").notNull(),
  location: jsonb("location").$type<Location>().notNull(),
  responders: jsonb("responders").$type<Responder[]>().default([]),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface Responder {
  name: string;
  address: string;
  distance: number;
  type: string;
  placeId: string;
  location: Location;
  phone?: string;
  rating?: number;
}

export interface EmergencyCategorization {
  category: "medical" | "police" | "mental_health" | "disaster" | "general";
  severity: "low" | "medium" | "high" | "critical";
  keywords: string[];
  suggestedAction: string;
  detectedLanguage?: string;
  translatedMessage?: string;
}

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
}).extend({
  emergencyContacts: z.array(z.object({
    name: z.string().min(1),
    phone: z.string().min(1),
    relationship: z.string().min(1),
  })).optional(),
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
  status: true,
}).extend({
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string().optional(),
  }),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alerts.$inferSelect;
