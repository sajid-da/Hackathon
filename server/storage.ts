import { type User, type InsertUser, type Alert, type InsertAlert, type ResponderRecord, type InsertResponder } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  
  createAlert(alert: InsertAlert): Promise<Alert>;
  getAlert(id: string): Promise<Alert | undefined>;
  getAlertsByUser(userId: string): Promise<Alert[]>;
  getAllAlerts(): Promise<Alert[]>;
  updateAlertStatus(id: string, status: string): Promise<Alert | undefined>;
  
  getRespondersByType(type: string, lat: number, lng: number, limit?: number): Promise<ResponderRecord[]>;
  createResponder(responder: InsertResponder): Promise<ResponderRecord>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private alerts: Map<string, Alert>;
  private responders: Map<string, ResponderRecord>;

  constructor() {
    this.users = new Map();
    this.alerts = new Map();
    this.responders = new Map();
    this.seedMockResponders();
  }

  private seedMockResponders() {
    const mockResponders: InsertResponder[] = [
      {
        name: "City General Hospital",
        type: "medical",
        address: "123 Main Street, Downtown",
        location: { lat: 40.7128, lng: -74.0060 },
        phone: "+1-555-0101",
        rating: "4.5",
        hours: "24/7 Emergency Services"
      },
      {
        name: "St. Mary's Medical Center",
        type: "medical",
        address: "456 Oak Avenue, Midtown",
        location: { lat: 40.7580, lng: -73.9855 },
        phone: "+1-555-0102",
        rating: "4.7",
        hours: "24/7 Emergency Services"
      },
      {
        name: "Memorial Hospital",
        type: "medical",
        address: "789 Pine Road, Uptown",
        location: { lat: 40.7489, lng: -73.9680 },
        phone: "+1-555-0103",
        rating: "4.3",
        hours: "24/7 Emergency Services"
      },
      {
        name: "Downtown Police Station",
        type: "police",
        address: "100 Justice Boulevard, Downtown",
        location: { lat: 40.7128, lng: -74.0060 },
        phone: "911",
        rating: "4.2",
        hours: "24/7"
      },
      {
        name: "Central Police Precinct",
        type: "police",
        address: "200 Safety Street, Central District",
        location: { lat: 40.7589, lng: -73.9851 },
        phone: "911",
        rating: "4.0",
        hours: "24/7"
      },
      {
        name: "North Side Police Station",
        type: "police",
        address: "300 Peace Avenue, North Side",
        location: { lat: 40.7794, lng: -73.9632 },
        phone: "911",
        rating: "4.1",
        hours: "24/7"
      },
      {
        name: "Hope Mental Health Clinic",
        type: "mental_health",
        address: "150 Wellness Way, Healthcare District",
        location: { lat: 40.7282, lng: -73.9942 },
        phone: "+1-555-0201",
        rating: "4.8",
        hours: "Mon-Fri 8AM-8PM, Sat-Sun 10AM-6PM"
      },
      {
        name: "Serenity Counseling Center",
        type: "mental_health",
        address: "250 Calm Street, Therapy Row",
        location: { lat: 40.7589, lng: -73.9851 },
        phone: "+1-555-0202",
        rating: "4.6",
        hours: "24/7 Crisis Hotline"
      },
      {
        name: "Mindful Care Institute",
        type: "mental_health",
        address: "350 Recovery Road, Health Campus",
        location: { lat: 40.7489, lng: -73.9680 },
        phone: "+1-555-0203",
        rating: "4.7",
        hours: "Mon-Sun 7AM-10PM"
      },
      {
        name: "Emergency Management Office",
        type: "disaster",
        address: "500 Response Center, City Hall",
        location: { lat: 40.7128, lng: -74.0060 },
        phone: "+1-555-0301",
        rating: "4.4",
        hours: "24/7 Emergency Response"
      },
      {
        name: "Fire & Rescue Department",
        type: "disaster",
        address: "600 Rescue Lane, Safety Zone",
        location: { lat: 40.7580, lng: -73.9855 },
        phone: "911",
        rating: "4.9",
        hours: "24/7"
      },
      {
        name: "Red Cross Disaster Relief",
        type: "disaster",
        address: "700 Aid Avenue, Relief Center",
        location: { lat: 40.7489, lng: -73.9680 },
        phone: "+1-555-0302",
        rating: "4.6",
        hours: "24/7 Emergency Assistance"
      }
    ];

    mockResponders.forEach(responder => {
      const id = randomUUID();
      const record: ResponderRecord = {
        ...responder,
        id,
        createdAt: new Date()
      };
      this.responders.set(id, record);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updated = { ...user, ...updates };
    this.users.set(id, updated);
    return updated;
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const id = randomUUID();
    const alert: Alert = {
      ...insertAlert,
      id,
      status: "active",
      createdAt: new Date(),
    };
    this.alerts.set(id, alert);
    return alert;
  }

  async getAlert(id: string): Promise<Alert | undefined> {
    return this.alerts.get(id);
  }

  async getAlertsByUser(userId: string): Promise<Alert[]> {
    return Array.from(this.alerts.values()).filter(
      (alert) => alert.userId === userId
    );
  }

  async getAllAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values());
  }

  async updateAlertStatus(id: string, status: string): Promise<Alert | undefined> {
    const alert = this.alerts.get(id);
    if (!alert) return undefined;
    
    const updated = { ...alert, status };
    this.alerts.set(id, updated);
    return updated;
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  async getRespondersByType(type: string, lat: number, lng: number, limit: number = 3): Promise<(ResponderRecord & { distance: number })[]> {
    const respondersByType = Array.from(this.responders.values()).filter(
      (responder) => responder.type === type
    );

    const respondersWithDistance = respondersByType.map(responder => ({
      ...responder,
      distance: this.calculateDistance(lat, lng, responder.location.lat, responder.location.lng)
    }));

    respondersWithDistance.sort((a, b) => a.distance - b.distance);

    return respondersWithDistance.slice(0, limit);
  }

  async createResponder(insertResponder: InsertResponder): Promise<ResponderRecord> {
    const id = randomUUID();
    const responder: ResponderRecord = {
      ...insertResponder,
      id,
      createdAt: new Date()
    };
    this.responders.set(id, responder);
    return responder;
  }
}

export const storage = new MemStorage();
