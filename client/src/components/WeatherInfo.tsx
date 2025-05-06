import { WeatherData } from "../types/weather";
import InfoCard from "./InfoCard";
import { Sunrise, Sunset, Eye, Sun } from "lucide-react";
import { getVisibilityDescription, getUvIndex } from "../lib/utils/weather";

interface WeatherInfoProps {
  weather: WeatherData;
}

export default function WeatherInfo({ weather }: WeatherInfoProps) {
  const uvIndex = getUvIndex();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
      {/* Sunrise & Sunset */}
      <InfoCard title="Sun Schedule">
        <div className="flex justify-between items-center">
          <div className="text-center">
            <Sunrise className="h-6 w-6 mx-auto text-orange-500 mb-1" />
            <p className="text-xs text-gray-500 dark:text-gray-400">Sunrise</p>
            <p className="font-medium">{weather.sunrise}</p>
          </div>
          <div className="h-px w-1/3 bg-gray-200 dark:bg-gray-700"></div>
          <div className="text-center">
            <Sunset className="h-6 w-6 mx-auto text-orange-600 mb-1" />
            <p className="text-xs text-gray-500 dark:text-gray-400">Sunset</p>
            <p className="font-medium">{weather.sunset}</p>
          </div>
        </div>
      </InfoCard>

      {/* Visibility */}
      <InfoCard title="Visibility">
        <div className="flex items-center">
          <Eye className="h-8 w-8 text-blue-500 mr-3" />
          <div>
            <p className="text-2xl font-medium">{(weather.visibility / 1000).toFixed(1)} km</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {getVisibilityDescription(weather.visibility)}
            </p>
          </div>
        </div>
      </InfoCard>

      {/* UV Index */}
      <InfoCard title="UV Index">
        <div className="flex items-center">
          <Sun className="h-8 w-8 text-yellow-500 mr-3" />
          <div>
            <p className="text-2xl font-medium">{uvIndex.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {uvIndex.description}
            </p>
          </div>
        </div>
      </InfoCard>
    </div>
  );
}
