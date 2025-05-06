import { pgTable, text, serial, integer, boolean, timestamp, pgEnum, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Define database tables and schemas for users and search history

// Schema for daily forecast item
export const forecastItemSchema = z.object({
  date: z.string(),
  day: z.string(),
  temp: z.number(),
  tempMin: z.number(),
  tempMax: z.number(),
  condition: z.string(),
  icon: z.string(),
  precipitation: z.number(),
  humidity: z.number(),
  wind: z.number(),
});

// Schema for hourly forecast item
export const hourlyForecastItemSchema = z.object({
  time: z.string(),
  temp: z.number(),
  condition: z.string(),
  icon: z.string(),
  precipitation: z.number(),
});

// Schema for historical temperature data used in charts
export const temperatureHistoryItemSchema = z.object({
  date: z.string(),
  temperature: z.number(),
});

// Weather stats for dashboard
export const weatherStatsSchema = z.object({
  averageTemp: z.number(),
  highestTemp: z.number(),
  lowestTemp: z.number(),
  averageHumidity: z.number(),
  averageWindSpeed: z.number(),
});

// Main weather response schema
export const weatherResponseSchema = z.object({
  city: z.string(),
  country: z.string(),
  condition: z.string(),
  description: z.string(),
  icon: z.string(),
  temp: z.number(),
  feelsLike: z.number(),
  tempMin: z.number(),
  tempMax: z.number(),
  humidity: z.number(),
  pressure: z.number(),
  wind: z.number(),
  visibility: z.number(),
  sunrise: z.string(),
  sunset: z.string(),
  date: z.string(),
  forecast: z.array(forecastItemSchema).optional(),
  hourlyForecast: z.array(hourlyForecastItemSchema).optional(),
  temperatureHistory: z.array(temperatureHistoryItemSchema).optional(),
  stats: weatherStatsSchema.optional(),
  airQuality: z.number().optional(),
  uvIndex: z.number().optional(),
});

export type WeatherResponse = z.infer<typeof weatherResponseSchema>;
export type ForecastItem = z.infer<typeof forecastItemSchema>;
export type HourlyForecastItem = z.infer<typeof hourlyForecastItemSchema>;
export type TemperatureHistoryItem = z.infer<typeof temperatureHistoryItemSchema>;
export type WeatherStats = z.infer<typeof weatherStatsSchema>;

// Database schema for users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Database schema for search history table
export const searchHistory = pgTable("search_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  temperature: integer("temperature").notNull(),
  condition: varchar("condition", { length: 50 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  favorite: boolean("favorite").default(false).notNull(),
});

// Relations between users and search history
export const usersRelations = relations(users, ({ many }) => ({
  searches: many(searchHistory),
}));

export const searchHistoryRelations = relations(searchHistory, ({ one }) => ({
  user: one(users, {
    fields: [searchHistory.userId],
    references: [users.id],
  }),
}));

// Create insert schemas using drizzle-zod
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertSearchHistorySchema = createInsertSchema(searchHistory).omit({ id: true });

// Create types from the schemas
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type SearchHistory = typeof searchHistory.$inferSelect;
export type InsertSearchHistory = typeof searchHistory.$inferInsert;
