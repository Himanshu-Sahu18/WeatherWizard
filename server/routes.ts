import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { fetchWeatherData, fetchWeatherByCoordinates, getCitySuggestions } from "./api/weather";
import { storage } from "./storage";
import { insertSearchHistorySchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";

// Example user ID to use until we implement authentication
const DEFAULT_USER_ID = 1;

export async function registerRoutes(app: Express): Promise<Server> {
  // Ensure a default user exists
  await ensureDefaultUser();

  // API route to get weather data by city name (with history tracking)
  app.get("/api/weather", async (req, res) => {
    try {
      const { city } = req.query;
      
      if (!city || typeof city !== "string") {
        return res.status(400).json({ message: "City name is required" });
      }
      
      const weatherData = await fetchWeatherData(city);
      
      // Save search to history
      try {
        await storage.saveSearchHistory({
          userId: DEFAULT_USER_ID,
          city: weatherData.city,
          country: weatherData.country,
          temperature: Math.round(weatherData.temp),
          condition: weatherData.condition,
          timestamp: new Date(),
          favorite: false,
        });
      } catch (historyError) {
        console.error("Error saving search history:", historyError);
        // Continue even if saving history fails
      }
      
      return res.json(weatherData);
    } catch (error: any) {
      console.error("Error fetching weather data:", error);
      
      if (error.response && error.response.status === 404) {
        return res.status(404).json({ message: "City not found. Please check the spelling and try again." });
      }
      
      return res.status(500).json({ 
        message: "Failed to fetch weather data. Please try again later." 
      });
    }
  });

  // API route to get weather data by coordinates
  app.get("/api/weather/coordinates", async (req, res) => {
    try {
      const { lat, lon } = req.query;
      
      if (!lat || !lon || typeof lat !== "string" || typeof lon !== "string") {
        return res.status(400).json({ message: "Latitude and longitude are required" });
      }
      
      const weatherData = await fetchWeatherByCoordinates(
        parseFloat(lat), 
        parseFloat(lon)
      );
      
      // Save search to history
      try {
        await storage.saveSearchHistory({
          userId: DEFAULT_USER_ID,
          city: weatherData.city,
          country: weatherData.country,
          temperature: Math.round(weatherData.temp),
          condition: weatherData.condition,
          timestamp: new Date(),
          favorite: false,
        });
      } catch (historyError) {
        console.error("Error saving search history:", historyError);
        // Continue even if saving history fails
      }
      
      return res.json(weatherData);
    } catch (error) {
      console.error("Error fetching weather data by coordinates:", error);
      return res.status(500).json({ 
        message: "Failed to fetch weather data. Please try again later." 
      });
    }
  });

  // Get search history for the user
  app.get("/api/history", async (req, res) => {
    try {
      const history = await storage.getSearchHistory(DEFAULT_USER_ID);
      return res.json(history);
    } catch (error) {
      console.error("Error fetching search history:", error);
      return res.status(500).json({ message: "Failed to fetch search history" });
    }
  });
  
  // Get favorite searches for the user
  app.get("/api/favorites", async (req, res) => {
    try {
      const favorites = await storage.getFavoriteSearches(DEFAULT_USER_ID);
      return res.json(favorites);
    } catch (error) {
      console.error("Error fetching favorite searches:", error);
      return res.status(500).json({ message: "Failed to fetch favorite searches" });
    }
  });
  
  // Toggle favorite status of a search history item
  app.post("/api/history/:id/favorite", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const updatedItem = await storage.toggleFavorite(id);
      if (!updatedItem) {
        return res.status(404).json({ message: "History item not found" });
      }
      
      return res.json(updatedItem);
    } catch (error) {
      console.error("Error toggling favorite status:", error);
      return res.status(500).json({ message: "Failed to update favorite status" });
    }
  });

  // Get city name suggestions for autocomplete
  app.get("/api/cities/suggestions", (req, res) => {
    try {
      const { query } = req.query;
      
      if (!query || typeof query !== "string") {
        return res.json(["London", "New York", "Tokyo", "Paris", "Berlin"]);
      }
      
      const suggestions = getCitySuggestions(query);
      return res.json(suggestions);
    } catch (error) {
      console.error("Error getting city suggestions:", error);
      return res.status(500).json({ message: "Failed to get city suggestions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to ensure a default user exists in the database
async function ensureDefaultUser() {
  try {
    let user = await storage.getUser(DEFAULT_USER_ID);
    
    if (!user) {
      console.log("Creating default user...");
      user = await storage.createUser({
        username: "default_user", 
        createdAt: new Date()
      });
      console.log(`Default user created with ID: ${user.id}`);
    }
  } catch (error) {
    console.error("Error ensuring default user exists:", error);
  }
}
