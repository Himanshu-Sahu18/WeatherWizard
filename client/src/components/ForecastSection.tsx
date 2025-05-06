import { WeatherData, ForecastItem } from "../types/weather";
import { Card, CardContent } from "./ui/card";
import { getWeatherIcon } from "../lib/utils/weather";

interface ForecastSectionProps {
  weather: WeatherData;
}

const ForecastSection = ({ weather }: ForecastSectionProps) => {
  if (!weather.forecast || weather.forecast.length === 0) {
    return null;
  }

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600 dark:text-blue-400">
        5-Day Forecast
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {weather.forecast.map((day, index) => (
          <ForecastCard key={index} day={day} />
        ))}
      </div>
    </div>
  );
};

interface ForecastCardProps {
  day: ForecastItem;
}

const ForecastCard = ({ day }: ForecastCardProps) => {
  const WeatherIcon = getWeatherIcon(day.condition);
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col items-center">
          <div className="text-lg font-bold">{day.day}</div>
          <div className="text-sm text-gray-500 mb-2">{day.date}</div>
          
          <div className="my-2">
            <WeatherIcon className="h-10 w-10 text-blue-500" />
          </div>
          
          <div className="text-xl font-bold mb-1">{Math.round(day.temp)}°C</div>
          
          <div className="flex justify-between w-full text-xs text-gray-500">
            <span>L: {Math.round(day.tempMin)}°C</span>
            <span>H: {Math.round(day.tempMax)}°C</span>
          </div>
          
          <div className="w-full border-t border-gray-200 dark:border-gray-700 my-2"></div>
          
          <div className="flex justify-between w-full text-xs">
            <div>
              <span className="text-blue-500">💦 </span>
              <span>{day.humidity}%</span>
            </div>
            <div>
              <span className="text-blue-500">💨 </span>
              <span>{day.wind} m/s</span>
            </div>
          </div>
          
          <div className="flex justify-center w-full text-xs mt-1">
            <div>
              <span className="text-blue-500">☔ </span>
              <span>{Math.round(day.precipitation)}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastSection;