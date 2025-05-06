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
