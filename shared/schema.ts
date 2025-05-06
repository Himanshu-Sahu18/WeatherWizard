import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Since we're using in-memory storage for this app and not a DB,
// we can define types only for our API responses.

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
export type WeatherStats = z.infer<typeof weatherStatsSchema>;}
