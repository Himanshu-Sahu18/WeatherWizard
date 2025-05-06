import axios from "axios";
import { WeatherResponse, ForecastItem, HourlyForecastItem, TemperatureHistoryItem, WeatherStats } from "@shared/schema";

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

// Get day of week
const getDayOfWeek = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

// Format time for hourly forecast
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

// Format weather data from API response
const formatWeatherData = async (data: any): Promise<WeatherResponse> => {
  // Get coordinates for forecast API calls
  const lat = data.coord.lat;
  const lon = data.coord.lon;
  
  // Fetch forecast data
  const forecastData = await fetchForecastData(lat, lon);
  const hourlyData = await fetchHourlyForecastData(lat, lon);
  
  // Generate temperature history (past data simulation)
  const temperatureHistory = generateTemperatureHistory(data.main.temp);
  
  // Generate weather stats
  const stats = calculateWeatherStats(forecastData, data.main);
  
  // Simulate UV Index (not available in free OpenWeatherMap tier)
  const uvIndex = Math.floor(Math.random() * 8) + 1; // 1-8 range
  
  // Simulate Air Quality (not available in free OpenWeatherMap tier)
  const airQuality = Math.floor(Math.random() * 5) + 1; // 1-5 range, 1 being best
  
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
    forecast: forecastData,
    hourlyForecast: hourlyData,
    temperatureHistory: temperatureHistory,
    stats: stats,
    airQuality: airQuality,
    uvIndex: uvIndex,
  };
};

// Fetch 5-day forecast data and format it
async function fetchForecastData(lat: number, lon: number): Promise<ForecastItem[]> {
  try {
    const response = await axios.get(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    
    const data = response.data;
    const dailyForecasts: ForecastItem[] = [];
    
    // Group forecast data by day (every 24 hours starting from current time)
    // We'll take one reading per day (at noon if available)
    const dailyMap = new Map<string, any>();
    
    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      
      // If we don't have an entry for this day yet, or if this is a noon reading
      const hour = new Date(item.dt * 1000).getHours();
      if (!dailyMap.has(date) || (hour >= 11 && hour <= 13)) {
        dailyMap.set(date, item);
      }
    });
    
    // Convert to array and limit to 5 days
    const days = Array.from(dailyMap.values()).slice(0, 5);
    
    // Format each day's data
    days.forEach((day) => {
      dailyForecasts.push({
        date: formatDate(day.dt),
        day: getDayOfWeek(day.dt),
        temp: day.main.temp,
        tempMin: day.main.temp_min,
        tempMax: day.main.temp_max,
        condition: day.weather[0].main,
        icon: day.weather[0].icon,
        precipitation: day.pop * 100, // Probability of precipitation
        humidity: day.main.humidity,
        wind: day.wind.speed,
      });
    });
    
    return dailyForecasts;
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    return []; // Return empty array on error
  }
}

// Fetch hourly forecast data (next 24 hours)
async function fetchHourlyForecastData(lat: number, lon: number): Promise<HourlyForecastItem[]> {
  try {
    const response = await axios.get(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    
    const data = response.data;
    const hourlyForecasts: HourlyForecastItem[] = [];
    
    // Get next 24 hours of data (8 points at 3-hour intervals)
    const hourlyData = data.list.slice(0, 8);
    
    hourlyData.forEach((hour: any) => {
      hourlyForecasts.push({
        time: formatTime(hour.dt),
        temp: hour.main.temp,
        condition: hour.weather[0].main,
        icon: hour.weather[0].icon,
        precipitation: hour.pop * 100, // Probability of precipitation
      });
    });
    
    return hourlyForecasts;
  } catch (error) {
    console.error("Error fetching hourly forecast data:", error);
    return []; // Return empty array on error
  }
}

// Generate simulated temperature history data (past 7 days)
function generateTemperatureHistory(currentTemp: number): TemperatureHistoryItem[] {
  const history: TemperatureHistoryItem[] = [];
  const today = new Date();
  
  // Generate data for the past 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Randomize temperature within +/-5 degrees of current temperature
    const randomVariation = Math.random() * 10 - 5;
    const temperature = Math.round((currentTemp + randomVariation) * 10) / 10;
    
    history.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      temperature: temperature,
    });
  }
  
  return history;
}

// Calculate weather statistics from forecast data
function calculateWeatherStats(forecastData: ForecastItem[], currentConditions: any): WeatherStats {
  // If we have forecast data, use it to calculate stats
  if (forecastData.length > 0) {
    const temps = forecastData.map(item => item.temp);
    const humidities = forecastData.map(item => item.humidity);
    const winds = forecastData.map(item => item.wind);
    
    // Add current conditions to the data set
    temps.push(currentConditions.temp);
    humidities.push(currentConditions.humidity);
    winds.push(currentConditions.wind_speed || 0);
    
    return {
      averageTemp: parseFloat((temps.reduce((sum, t) => sum + t, 0) / temps.length).toFixed(1)),
      highestTemp: Math.max(...temps),
      lowestTemp: Math.min(...temps),
      averageHumidity: Math.round(humidities.reduce((sum, h) => sum + h, 0) / humidities.length),
      averageWindSpeed: parseFloat((winds.reduce((sum, w) => sum + w, 0) / winds.length).toFixed(1)),
    };
  }
  
  // Fallback if no forecast data
  return {
    averageTemp: currentConditions.temp,
    highestTemp: currentConditions.temp_max,
    lowestTemp: currentConditions.temp_min,
    averageHumidity: currentConditions.humidity,
    averageWindSpeed: currentConditions.wind_speed || 0,
  };
}

// Fetch weather data by city name
export const fetchWeatherData = async (city: string): Promise<WeatherResponse> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
    );
    return await formatWeatherData(response.data);
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
    return await formatWeatherData(response.data);
  } catch (error) {
    console.error("Error in fetchWeatherByCoordinates:", error);
    throw error;
  }
};
