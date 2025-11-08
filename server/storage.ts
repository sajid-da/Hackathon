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
        name: "All India Institute of Medical Sciences (AIIMS)",
        type: "medical",
        address: "Ansari Nagar, New Delhi, Delhi 110029",
        location: { lat: 28.5672, lng: 77.2100 },
        phone: "+91-11-2658-8500",
        rating: "4.8",
        hours: "24/7 Emergency Services"
      },
      {
        name: "Safdarjung Hospital",
        type: "medical",
        address: "Ansari Nagar West, New Delhi, Delhi 110029",
        location: { lat: 28.5677, lng: 77.2067 },
        phone: "+91-11-2673-0000",
        rating: "4.5",
        hours: "24/7 Emergency Services"
      },
      {
        name: "Apollo Hospital Delhi",
        type: "medical",
        address: "Sarita Vihar, New Delhi, Delhi 110076",
        location: { lat: 28.5355, lng: 77.2810 },
        phone: "+91-11-2692-5858",
        rating: "4.7",
        hours: "24/7 Emergency Services"
      },
      {
        name: "Connaught Place Police Station",
        type: "police",
        address: "Connaught Place, New Delhi, Delhi 110001",
        location: { lat: 28.6315, lng: 77.2167 },
        phone: "100",
        rating: "4.2",
        hours: "24/7"
      },
      {
        name: "Delhi Police Control Room",
        type: "police",
        address: "I.P. Estate, New Delhi, Delhi 110002",
        location: { lat: 28.6304, lng: 77.2411 },
        phone: "100",
        rating: "4.3",
        hours: "24/7"
      },
      {
        name: "Hauz Khas Police Station",
        type: "police",
        address: "Hauz Khas, New Delhi, Delhi 110016",
        location: { lat: 28.5494, lng: 77.2001 },
        phone: "100",
        rating: "4.1",
        hours: "24/7"
      },
      {
        name: "NIMHANS Delhi Branch",
        type: "mental_health",
        address: "Safdarjung Enclave, New Delhi, Delhi 110029",
        location: { lat: 28.5619, lng: 77.1907 },
        phone: "+91-11-2659-3104",
        rating: "4.8",
        hours: "Mon-Fri 9AM-5PM, Emergency 24/7"
      },
      {
        name: "Mind Well Mental Health Clinic",
        type: "mental_health",
        address: "Greater Kailash, New Delhi, Delhi 110048",
        location: { lat: 28.5494, lng: 77.2410 },
        phone: "+91-11-4165-2222",
        rating: "4.6",
        hours: "24/7 Crisis Hotline"
      },
      {
        name: "Mental Health Foundation India",
        type: "mental_health",
        address: "Lajpat Nagar, New Delhi, Delhi 110024",
        location: { lat: 28.5678, lng: 77.2431 },
        phone: "+91-11-2984-5679",
        rating: "4.7",
        hours: "Mon-Sun 8AM-8PM"
      },
      {
        name: "National Disaster Response Force (NDRF)",
        type: "disaster",
        address: "Vasant Kunj, New Delhi, Delhi 110070",
        location: { lat: 28.5244, lng: 77.1587 },
        phone: "+91-11-2671-9104",
        rating: "4.9",
        hours: "24/7 Emergency Response"
      },
      {
        name: "Delhi Fire Service Headquarters",
        type: "disaster",
        address: "Connaught Place, New Delhi, Delhi 110001",
        location: { lat: 28.6289, lng: 77.2065 },
        phone: "101",
        rating: "4.7",
        hours: "24/7"
      },
      {
        name: "Indian Red Cross Society Delhi",
        type: "disaster",
        address: "Red Cross Road, New Delhi, Delhi 110001",
        location: { lat: 28.6139, lng: 77.2090 },
        phone: "+91-11-2371-6441",
        rating: "4.6",
        hours: "24/7 Emergency Assistance"
      },
      {
        name: "Reserve Bank of India - Consumer Education",
        type: "finance",
        address: "Sansad Marg, New Delhi, Delhi 110001",
        location: { lat: 28.6139, lng: 77.2050 },
        phone: "+91-11-2306-6000",
        rating: "4.5",
        hours: "Mon-Fri 10AM-5PM, Emergency Hotline 24/7"
      },
      {
        name: "Delhi State Consumer Disputes Commission",
        type: "finance",
        address: "F-Block, Barkha Bhawan, Janakpuri, Delhi 110058",
        location: { lat: 28.6217, lng: 77.0851 },
        phone: "+91-11-2559-0103",
        rating: "4.3",
        hours: "Mon-Fri 10AM-5PM"
      },
      {
        name: "National Financial Literacy Centre",
        type: "finance",
        address: "Nehru Place, New Delhi, Delhi 110019",
        location: { lat: 28.5494, lng: 77.2501 },
        phone: "+91-11-2623-4567",
        rating: "4.4",
        hours: "Mon-Sat 9AM-6PM, Crisis Hotline 24/7"
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
