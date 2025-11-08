import { type User, type InsertUser, type Alert, type InsertAlert } from "@shared/schema";
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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private alerts: Map<string, Alert>;

  constructor() {
    this.users = new Map();
    this.alerts = new Map();
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
}

export const storage = new MemStorage();
