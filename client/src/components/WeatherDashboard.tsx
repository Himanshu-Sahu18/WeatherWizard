import { WeatherData } from "../types/weather";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Clock, Wind, Droplets, Thermometer, Eye, Umbrella } from "lucide-react";
import { getVisibilityDescription } from "../lib/utils/weather";

interface WeatherDashboardProps {
  weather: WeatherData;
}

const WeatherDashboard = ({ weather }: WeatherDashboardProps) => {
  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600 dark:text-blue-400">
        Current Conditions
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Wind Speed Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-blue-500">
              <Wind className="h-4 w-4 mr-2" /> Wind Speed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weather.wind} <span className="text-sm font-normal">m/s</span></div>
            <p className="text-xs text-muted-foreground mt-1">
              {weather.wind < 0.5 ? "Calm" : 
               weather.wind < 1.5 ? "Light Air" :
               weather.wind < 3.3 ? "Light Breeze" :
               weather.wind < 5.5 ? "Gentle Breeze" :
               weather.wind < 7.9 ? "Moderate Breeze" :
               weather.wind < 10.7 ? "Fresh Breeze" :
               weather.wind < 13.8 ? "Strong Breeze" :
               weather.wind < 17.1 ? "High Wind" :
               weather.wind < 24.4 ? "Gale" : "Storm"}
            </p>
          </CardContent>
        </Card>

        {/* Humidity Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-blue-500">
              <Droplets className="h-4 w-4 mr-2" /> Humidity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weather.humidity}<span className="text-sm font-normal">%</span></div>
            <p className="text-xs text-muted-foreground mt-1">
              {weather.humidity < 30 ? "Low humidity - dry conditions" :
               weather.humidity < 60 ? "Comfortable humidity levels" :
               "High humidity - feels muggy"}
            </p>
          </CardContent>
        </Card>

        {/* Pressure Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-blue-500">
              <Thermometer className="h-4 w-4 mr-2" /> Pressure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weather.pressure} <span className="text-sm font-normal">hPa</span></div>
            <p className="text-xs text-muted-foreground mt-1">
              {weather.pressure < 1000 ? "Low pressure - potential for unsettled weather" :
               weather.pressure > 1020 ? "High pressure - typically fair weather" :
               "Normal atmospheric pressure"}
            </p>
          </CardContent>
        </Card>

        {/* Visibility Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-blue-500">
              <Eye className="h-4 w-4 mr-2" /> Visibility
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(weather.visibility / 1000).toFixed(1)} <span className="text-sm font-normal">km</span></div>
            <p className="text-xs text-muted-foreground mt-1">
              {getVisibilityDescription(weather.visibility)}
            </p>
          </CardContent>
        </Card>

        {/* Sunrise Sunset Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-blue-500">
              <Clock className="h-4 w-4 mr-2" /> Sun Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-xs text-muted-foreground">Sunrise</div>
                <div className="text-base font-medium">{weather.sunrise}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Sunset</div>
                <div className="text-base font-medium">{weather.sunset}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feels Like Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-blue-500">
              <Thermometer className="h-4 w-4 mr-2" /> Feels Like
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(weather.feelsLike)}°C</div>
            <p className="text-xs text-muted-foreground mt-1">
              {weather.feelsLike < weather.temp - 3 ? "Feels colder than actual temperature" :
               weather.feelsLike > weather.temp + 3 ? "Feels warmer than actual temperature" :
               "Feels similar to actual temperature"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WeatherDashboard;