import { sql, relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  decimal,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  userType: varchar("user_type").default('farmer'), // farmer, cooperative, policymaker
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Fields table - stores farmer field information
export const fields = pgTable("fields", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  userId: varchar("user_id").notNull().references(() => users.id),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  size: decimal("size", { precision: 10, scale: 2 }), // in acres
  cropType: varchar("crop_type").default('maize'),
  plantingDate: timestamp("planting_date"),
  expectedHarvestDate: timestamp("expected_harvest_date"),
  location: text("location"), // descriptive location
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Satellite data table - stores vegetation indices
export const satelliteData = pgTable("satellite_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fieldId: varchar("field_id").notNull().references(() => fields.id),
  date: timestamp("date").notNull(),
  ndvi: decimal("ndvi", { precision: 5, scale: 3 }),
  evi: decimal("evi", { precision: 5, scale: 3 }),
  sarvi: decimal("sarvi", { precision: 5, scale: 3 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Weather data table
export const weatherData = pgTable("weather_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fieldId: varchar("field_id").notNull().references(() => fields.id),
  date: timestamp("date").notNull(),
  temperature: decimal("temperature", { precision: 5, scale: 2 }),
  humidity: decimal("humidity", { precision: 5, scale: 2 }),
  rainfall: decimal("rainfall", { precision: 7, scale: 2 }),
  windSpeed: decimal("wind_speed", { precision: 5, scale: 2 }),
  condition: varchar("condition"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Yield predictions table
export const yieldPredictions = pgTable("yield_predictions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fieldId: varchar("field_id").notNull().references(() => fields.id),
  predictionDate: timestamp("prediction_date").notNull(),
  predictedYield: decimal("predicted_yield", { precision: 10, scale: 2 }),
  confidence: decimal("confidence", { precision: 5, scale: 2 }),
  modelVersion: varchar("model_version"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Alerts table
export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  fieldId: varchar("field_id").references(() => fields.id),
  type: varchar("type").notNull(), // health, weather, yield
  priority: varchar("priority").notNull(), // low, medium, high, critical
  title: text("title").notNull(),
  description: text("description"),
  isRead: boolean("is_read").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  fields: many(fields),
  alerts: many(alerts),
}));

export const fieldsRelations = relations(fields, ({ one, many }) => ({
  user: one(users, {
    fields: [fields.userId],
    references: [users.id],
  }),
  satelliteData: many(satelliteData),
  weatherData: many(weatherData),
  yieldPredictions: many(yieldPredictions),
  alerts: many(alerts),
}));

export const satelliteDataRelations = relations(satelliteData, ({ one }) => ({
  field: one(fields, {
    fields: [satelliteData.fieldId],
    references: [fields.id],
  }),
}));

export const weatherDataRelations = relations(weatherData, ({ one }) => ({
  field: one(fields, {
    fields: [weatherData.fieldId],
    references: [fields.id],
  }),
}));

export const yieldPredictionsRelations = relations(yieldPredictions, ({ one }) => ({
  field: one(fields, {
    fields: [yieldPredictions.fieldId],
    references: [fields.id],
  }),
}));

export const alertsRelations = relations(alerts, ({ one }) => ({
  user: one(users, {
    fields: [alerts.userId],
    references: [users.id],
  }),
  field: one(fields, {
    fields: [alerts.fieldId],
    references: [fields.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFieldSchema = createInsertSchema(fields).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSatelliteDataSchema = createInsertSchema(satelliteData).omit({
  id: true,
  createdAt: true,
});

export const insertWeatherDataSchema = createInsertSchema(weatherData).omit({
  id: true,
  createdAt: true,
});

export const insertYieldPredictionSchema = createInsertSchema(yieldPredictions).omit({
  id: true,
  createdAt: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;
export type Field = typeof fields.$inferSelect;
export type InsertField = z.infer<typeof insertFieldSchema>;
export type SatelliteData = typeof satelliteData.$inferSelect;
export type InsertSatelliteData = z.infer<typeof insertSatelliteDataSchema>;
export type WeatherData = typeof weatherData.$inferSelect;
export type InsertWeatherData = z.infer<typeof insertWeatherDataSchema>;
export type YieldPrediction = typeof yieldPredictions.$inferSelect;
export type InsertYieldPrediction = z.infer<typeof insertYieldPredictionSchema>;
export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
