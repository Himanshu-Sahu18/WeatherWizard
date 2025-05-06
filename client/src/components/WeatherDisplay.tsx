import { WeatherData } from "../types/weather";
import WeatherCard from "./WeatherCard";
import WeatherInfo from "./WeatherInfo";

interface WeatherDisplayProps {
  weather: WeatherData;
}

export default function WeatherDisplay({ weather }: WeatherDisplayProps) {
  return (
    <div>
      <WeatherCard weather={weather} />
      <WeatherInfo weather={weather} />
    </div>
  );
}
