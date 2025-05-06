import axios from "axios";
import { WeatherResponse } from "@shared/schema";

if (!process.env.OPENWEATHERMAP_API_KEY) {
  console.warn("OPENWEATHERMAP_API_KEY environment variable not set. Weather API will not work properly.");
}

const API_KEY = process.env.OPENWEATHERMAP_API_KEY || "";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// Format temperature from Kelvin to Celsius
const formatTimestamp = (timestamp: number, timezone: number): string => {
  const date = new Date((timestamp + timezone) * 1000);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
  return `${formattedHours}:${formattedMinutes} ${period}`;
};

// Format date for display
const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'short' 
  });
};

// Format weather data from API response
const formatWeatherData = (data: any): WeatherResponse => {
  return {
    city: data.name,
    country: data.sys.country,
    condition: data.weather[0].main,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    temp: data.main.temp,
    feelsLike: data.main.feels_like,
    tempMin: data.main.temp_min,
    tempMax: data.main.temp_max,
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    wind: data.wind.speed,
    visibility: data.visibility,
    sunrise: formatTimestamp(data.sys.sunrise, data.timezone),
    sunset: formatTimestamp(data.sys.sunset, data.timezone),
    date: formatDate(data.dt),
  };
};

// Fetch weather data by city name
export const fetchWeatherData = async (city: string): Promise<WeatherResponse> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
    );
    return formatWeatherData(response.data);
  } catch (error) {
    console.error("Error in fetchWeatherData:", error);
    throw error;
  }
};

// Fetch weather data by coordinates
export const fetchWeatherByCoordinates = async (
  lat: number, 
  lon: number
): Promise<WeatherResponse> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    return formatWeatherData(response.data);
  } catch (error) {
    console.error("Error in fetchWeatherByCoordinates:", error);
    throw error;
  }
};
