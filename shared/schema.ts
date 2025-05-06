import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Since we're using in-memory storage for this app and not a DB,
// we can define types only for our API responses.

export const weatherResponseSchema = z.object({
  city: z.string(),
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
  country: z.string(),
  date: z.string(),
});

export type WeatherResponse = z.infer<typeof weatherResponseSchema>;
