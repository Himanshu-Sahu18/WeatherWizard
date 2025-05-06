import { WeatherData, HourlyForecastItem } from "../types/weather";
import { getWeatherIcon } from "../lib/utils/weather";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

interface HourlyForecastProps {
  weather: WeatherData;
}

const HourlyForecast = ({ weather }: HourlyForecastProps) => {
  if (!weather.hourlyForecast || weather.hourlyForecast.length === 0) {
    return null;
  }

  return (
    <Card className="my-8">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center text-blue-600 dark:text-blue-400">Hourly Forecast</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-4 pb-1">
            {weather.hourlyForecast.map((hour, index) => (
              <HourlyItem key={index} hour={hour} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

interface HourlyItemProps {
  hour: HourlyForecastItem;
}

const HourlyItem = ({ hour }: HourlyItemProps) => {
  const WeatherIcon = getWeatherIcon(hour.condition);
  
  return (
    <div className="flex flex-col items-center space-y-2 w-20">
      <span className="text-sm font-medium">{hour.time}</span>
      <WeatherIcon className="h-8 w-8 text-blue-500" />
      <span className="font-bold">{Math.round(hour.temp)}°C</span>
      <div className="flex items-center text-xs text-blue-500">
        <span>☔ {Math.round(hour.precipitation)}%</span>
      </div>
    </div>
  );
};

export default HourlyForecast;