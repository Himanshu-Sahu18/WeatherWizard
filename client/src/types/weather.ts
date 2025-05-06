export interface ForecastItem {
  date: string;
  day: string;
  temp: number;
  tempMin: number;
  tempMax: number;
  condition: string;
  icon: string;
  precipitation: number;
  humidity: number;
  wind: number;
}

export interface HourlyForecastItem {
  time: string;
  temp: number;
  condition: string;
  icon: string;
  precipitation: number;
}

export interface TemperatureHistoryItem {
  date: string;
  temperature: number;
}

export interface WeatherStats {
  averageTemp: number;
  highestTemp: number;
  lowestTemp: number;
  averageHumidity: number;
  averageWindSpeed: number;
}

export interface WeatherData {
  city: string;
  country: string;
  condition: string;
  description: string;
  icon: string;
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  pressure: number;
  wind: number;
  visibility: number;
  sunrise: string;
  sunset: string;
  date: string;
  forecast?: ForecastItem[];
  hourlyForecast?: HourlyForecastItem[];
  temperatureHistory?: TemperatureHistoryItem[];
  stats?: WeatherStats;
  airQuality?: number;
  uvIndex?: number;
}
