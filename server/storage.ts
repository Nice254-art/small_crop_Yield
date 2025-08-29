import {
  users,
  fields,
  satelliteData,
  weatherData,
  yieldPredictions,
  alerts,
  type User,
  type UpsertUser,
  type Field,
  type InsertField,
  type SatelliteData,
  type InsertSatelliteData,
  type WeatherData,
  type InsertWeatherData,
  type YieldPrediction,
  type InsertYieldPrediction,
  type Alert,
  type InsertAlert,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Field operations
  createField(field: InsertField): Promise<Field>;
  getFieldsByUserId(userId: string): Promise<Field[]>;
  getField(id: string): Promise<Field | undefined>;
  updateField(id: string, field: Partial<InsertField>): Promise<Field>;
  deleteField(id: string): Promise<void>;
  
  // Satellite data operations
  createSatelliteData(data: InsertSatelliteData): Promise<SatelliteData>;
  getLatestSatelliteData(fieldId: string): Promise<SatelliteData | undefined>;
  getSatelliteDataByField(fieldId: string): Promise<SatelliteData[]>;
  
  // Weather data operations
  createWeatherData(data: InsertWeatherData): Promise<WeatherData>;
  getLatestWeatherData(fieldId: string): Promise<WeatherData | undefined>;
  getWeatherDataByField(fieldId: string): Promise<WeatherData[]>;
  
  // Yield prediction operations
  createYieldPrediction(prediction: InsertYieldPrediction): Promise<YieldPrediction>;
  getLatestYieldPrediction(fieldId: string): Promise<YieldPrediction | undefined>;
  getYieldPredictionsByField(fieldId: string): Promise<YieldPrediction[]>;
  
  // Alert operations
  createAlert(alert: InsertAlert): Promise<Alert>;
  getAlertsByUserId(userId: string): Promise<Alert[]>;
  getUnreadAlerts(userId: string): Promise<Alert[]>;
  markAlertAsRead(id: string): Promise<void>;
  getActiveAlerts(userId: string): Promise<Alert[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Field operations
  async createField(field: InsertField): Promise<Field> {
    const [newField] = await db.insert(fields).values(field).returning();
    return newField;
  }

  async getFieldsByUserId(userId: string): Promise<Field[]> {
    return await db.select().from(fields).where(eq(fields.userId, userId)).orderBy(asc(fields.name));
  }

  async getField(id: string): Promise<Field | undefined> {
    const [field] = await db.select().from(fields).where(eq(fields.id, id));
    return field;
  }

  async updateField(id: string, fieldData: Partial<InsertField>): Promise<Field> {
    const [updatedField] = await db
      .update(fields)
      .set({ ...fieldData, updatedAt: new Date() })
      .where(eq(fields.id, id))
      .returning();
    return updatedField;
  }

  async deleteField(id: string): Promise<void> {
    await db.delete(fields).where(eq(fields.id, id));
  }

  // Satellite data operations
  async createSatelliteData(data: InsertSatelliteData): Promise<SatelliteData> {
    const [newData] = await db.insert(satelliteData).values(data).returning();
    return newData;
  }

  async getLatestSatelliteData(fieldId: string): Promise<SatelliteData | undefined> {
    const [data] = await db
      .select()
      .from(satelliteData)
      .where(eq(satelliteData.fieldId, fieldId))
      .orderBy(desc(satelliteData.date))
      .limit(1);
    return data;
  }

  async getSatelliteDataByField(fieldId: string): Promise<SatelliteData[]> {
    return await db
      .select()
      .from(satelliteData)
      .where(eq(satelliteData.fieldId, fieldId))
      .orderBy(desc(satelliteData.date));
  }

  // Weather data operations
  async createWeatherData(data: InsertWeatherData): Promise<WeatherData> {
    const [newData] = await db.insert(weatherData).values(data).returning();
    return newData;
  }

  async getLatestWeatherData(fieldId: string): Promise<WeatherData | undefined> {
    const [data] = await db
      .select()
      .from(weatherData)
      .where(eq(weatherData.fieldId, fieldId))
      .orderBy(desc(weatherData.date))
      .limit(1);
    return data;
  }

  async getWeatherDataByField(fieldId: string): Promise<WeatherData[]> {
    return await db
      .select()
      .from(weatherData)
      .where(eq(weatherData.fieldId, fieldId))
      .orderBy(desc(weatherData.date));
  }

  // Yield prediction operations
  async createYieldPrediction(prediction: InsertYieldPrediction): Promise<YieldPrediction> {
    const [newPrediction] = await db.insert(yieldPredictions).values(prediction).returning();
    return newPrediction;
  }

  async getLatestYieldPrediction(fieldId: string): Promise<YieldPrediction | undefined> {
    const [prediction] = await db
      .select()
      .from(yieldPredictions)
      .where(eq(yieldPredictions.fieldId, fieldId))
      .orderBy(desc(yieldPredictions.predictionDate))
      .limit(1);
    return prediction;
  }

  async getYieldPredictionsByField(fieldId: string): Promise<YieldPrediction[]> {
    return await db
      .select()
      .from(yieldPredictions)
      .where(eq(yieldPredictions.fieldId, fieldId))
      .orderBy(desc(yieldPredictions.predictionDate));
  }

  // Alert operations
  async createAlert(alert: InsertAlert): Promise<Alert> {
    const [newAlert] = await db.insert(alerts).values(alert).returning();
    return newAlert;
  }

  async getAlertsByUserId(userId: string): Promise<Alert[]> {
    return await db
      .select()
      .from(alerts)
      .where(eq(alerts.userId, userId))
      .orderBy(desc(alerts.createdAt));
  }

  async getUnreadAlerts(userId: string): Promise<Alert[]> {
    return await db
      .select()
      .from(alerts)
      .where(and(eq(alerts.userId, userId), eq(alerts.isRead, false)))
      .orderBy(desc(alerts.createdAt));
  }

  async markAlertAsRead(id: string): Promise<void> {
    await db.update(alerts).set({ isRead: true }).where(eq(alerts.id, id));
  }

  async getActiveAlerts(userId: string): Promise<Alert[]> {
    return await db
      .select()
      .from(alerts)
      .where(and(eq(alerts.userId, userId), eq(alerts.isActive, true)))
      .orderBy(desc(alerts.createdAt));
  }
}

export const storage = new DatabaseStorage();
