import { WeatherData } from "../types/weather";
import WeatherCard from "./WeatherCard";
import WeatherInfo from "./WeatherInfo";
import WeatherDashboard from "./WeatherDashboard";
import TemperatureChart from "./TemperatureChart";
import ForecastSection from "./ForecastSection";
import HourlyForecast from "./HourlyForecast";
import AirQualityInfo from "./AIrQualityInfo";

interface WeatherDisplayProps {
  weather: WeatherData;
}

export default function WeatherDisplay({ weather }: WeatherDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Main weather card */}
      <WeatherCard weather={weather} />
      
      {/* Hourly forecast */}
      <HourlyForecast weather={weather} />
      
      {/* 5-day forecast */}
      <ForecastSection weather={weather} />
      
      {/* Dashboard */}
      <WeatherDashboard weather={weather} />
      
      {/* Temperature chart */}
      <TemperatureChart weather={weather} />
      
      {/* Air quality and UV index */}
      <AirQualityInfo weather={weather} />
      
      {/* Sun schedule & visibility */}
      <WeatherInfo weather={weather} />
    </div>
  );
}
