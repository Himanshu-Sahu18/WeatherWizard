import { WeatherData } from "../types/weather";

export const searchWeather = async (city: string): Promise<WeatherData> => {
  const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch weather data");
  }
  
  return response.json();
};

export const searchWeatherByCoordinates = async (lat: number, lon: number): Promise<WeatherData> => {
  const response = await fetch(`/api/weather/coordinates?lat=${lat}&lon=${lon}`);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch weather data");
  }
  
  return response.json();
};

export const getCitySuggestions = async (query: string): Promise<string[]> => {
  try {
    const response = await fetch(`/api/cities/suggestions?query=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching city suggestions:", error);
    return [];
  }
};
