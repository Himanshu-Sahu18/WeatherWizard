import { WeatherData } from "../types/weather";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Cloud, Droplets, Thermometer, Wind } from "lucide-react";

interface WeatherDashboardProps {
  weather: WeatherData;
}

const WeatherDashboard = ({ weather }: WeatherDashboardProps) => {
  const stats = weather.stats;
  
  if (!stats) return null;

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600 dark:text-blue-400">
        Weather Dashboard
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageTemp}°C</div>
            <p className="text-xs text-muted-foreground">
              Calculated from forecast data
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Highest Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.highestTemp}°C</div>
            <p className="text-xs text-muted-foreground">
              {Math.round(stats.highestTemp - weather.temp)}°C warmer than current
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Humidity</CardTitle>
            <Droplets className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageHumidity}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.averageHumidity < 30 ? "Dry" : stats.averageHumidity > 70 ? "Humid" : "Moderate"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Wind Speed</CardTitle>
            <Wind className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageWindSpeed} m/s</div>
            <p className="text-xs text-muted-foreground">
              {stats.averageWindSpeed < 3 ? "Light breeze" : stats.averageWindSpeed > 7 ? "Strong wind" : "Moderate wind"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WeatherDashboard;