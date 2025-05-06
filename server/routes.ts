import type { Express } from "express";
import { createServer, type Server } from "http";
import { fetchWeatherData, fetchWeatherByCoordinates } from "./api/weather";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route to get weather data by city name
  app.get("/api/weather", async (req, res) => {
    try {
      const { city } = req.query;
      
      if (!city || typeof city !== "string") {
        return res.status(400).json({ message: "City name is required" });
      }
      
      const weatherData = await fetchWeatherData(city);
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
      return res.json(weatherData);
    } catch (error) {
      console.error("Error fetching weather data by coordinates:", error);
      return res.status(500).json({ 
        message: "Failed to fetch weather data. Please try again later." 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
