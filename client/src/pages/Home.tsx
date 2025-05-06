import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchWeather } from "@/lib/api";
import { WeatherData, ForecastItem, HourlyForecastItem } from "@/types/weather";
import { useToast } from "@/hooks/use-toast";

import {
  Search,
  CloudRain,
  Thermometer,
  Droplets,
  Wind,
  Compass,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingIndicator from "@/components/LoadingIndicator";
import ErrorMessage from "@/components/ErrorMessage";
import { cn } from "@/lib/utils";

// Temperature graph component
const TemperatureGraph = ({ hourlyData }: { hourlyData: HourlyForecastItem[] }) => {
  if (!hourlyData || hourlyData.length === 0) return null;
  
  // Find min and max temp for scaling
  const temps = hourlyData.map(hour => hour.temp);
  const minTemp = Math.floor(Math.min(...temps)) - 1;
  const maxTemp = Math.ceil(Math.max(...temps)) + 1;
  const range = maxTemp - minTemp;

  return (
    <div className="mt-4 relative h-40">
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between text-xs text-gray-500">
        <div>{maxTemp}°</div>
        <div>{Math.round((maxTemp + minTemp) / 2)}°</div>
        <div>{minTemp}°</div>
      </div>
      
      {/* Graph */}
      <div className="ml-10 h-full flex items-end">
        <svg className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="tempGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          
          {/* Line */}
          <polyline
            points={hourlyData.map((hour, i) => {
              const x = (i / (hourlyData.length - 1)) * 100 + "%";
              const y = 100 - ((hour.temp - minTemp) / range) * 100 + "%";
              return `${x},${y}`;
            }).join(" ")}
            fill="none"
            stroke="url(#tempGradient)"
            strokeWidth="2"
          />
          
          {/* Points */}
          {hourlyData.map((hour, i) => {
            const x = (i / (hourlyData.length - 1)) * 100 + "%";
            const y = 100 - ((hour.temp - minTemp) / range) * 100 + "%";
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                fill="white"
                stroke="#3b82f6"
                strokeWidth="1"
              />
            );
          })}
        </svg>
      </div>
      
      {/* X-axis labels */}
      <div className="ml-10 mt-1 flex justify-between text-xs text-gray-500">
        {hourlyData.map((hour, i) => (
          <div key={i}>{hour.time.split(" ")[0]}</div>
        ))}
      </div>
      
      {/* Precipitation percentages */}
      <div className="ml-10 mt-2 flex justify-between text-xs text-gray-500">
        {hourlyData.map((hour, i) => (
          <div key={i} className="text-center">
            {hour.precipitation}%
          </div>
        ))}
      </div>
    </div>
  );
};

const ForecastDay = ({ day, isFirst }: { day: ForecastItem; isFirst: boolean }) => {
  return (
    <div className={cn(
      "flex items-center justify-between py-3",
      !isFirst && "border-t border-gray-200"
    )}>
      <div className="flex-1">
        <div className="font-medium">{day.day}</div>
        <div className="text-sm text-gray-500">{day.date}</div>
      </div>
      <div className="flex-1 flex justify-center">
        <img
          src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
          alt={day.condition}
          className="w-10 h-10"
        />
      </div>
      <div className="flex-1 text-right">
        <div className="flex items-center justify-end gap-2">
          <span className="font-bold">{Math.round(day.tempMax)}°</span>
          <span className="text-gray-500">{Math.round(day.tempMin)}°</span>
        </div>
        <div className="text-sm text-gray-500">{day.condition}</div>
      </div>
    </div>
  );
};

export default function Home() {
  const [city, setCity] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [units, setUnits] = useState("metric"); // metric or imperial
  const { toast } = useToast();
  
  const { 
    data: weather,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['/api/weather', city],
    queryFn: () => searchWeather(city),
    enabled: city.length > 0,
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    
    setCity(searchInput.trim());
  };

  const errorMessage = error instanceof Error ? error.message : "";
  
  // Get current date and format it
  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const timeString = currentDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const toggleUnits = () => {
    setUnits(units === "metric" ? "imperial" : "metric");
  };
  
  // Convert temperature based on units
  const convertTemp = (tempC: number): number => {
    if (units === "imperial") {
      return Math.round((tempC * 9/5) + 32);
    }
    return Math.round(tempC);
  };
  
  // Convert wind speed based on units
  const convertWindSpeed = (speedMS: number): string => {
    if (units === "imperial") {
      // Convert m/s to mph
      return (speedMS * 2.237).toFixed(1);
    }
    return speedMS.toFixed(1);
  };
  
  // Get wind speed unit
  const windSpeedUnit = units === "imperial" ? "mph" : "m/s";

  // Temperature unit
  const tempUnit = units === "imperial" ? "°F" : "°C";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header/Search bar */}
      <div className="bg-white dark:bg-gray-800 shadow-sm py-3 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <form onSubmit={handleSearch} className="flex-1 max-w-md flex">
            <Input
              placeholder="Search city"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="rounded-r-none border-r-0"
            />
            <Button type="submit" className="rounded-l-none">
              Search
            </Button>
          </form>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // Use geolocation to get current location
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      toast({
                        title: "Location detected",
                        description: "Fetching weather for your location",
                      });
                      // In a real app, you would call a function to get weather by coordinates
                      // For now, we'll just show this toast
                    },
                    (error) => {
                      toast({
                        title: "Error",
                        description: "Could not get your location: " + error.message,
                        variant: "destructive",
                      });
                    }
                  );
                } else {
                  toast({
                    title: "Error",
                    description: "Geolocation is not supported by your browser",
                    variant: "destructive",
                  });
                }
              }}
            >
              <MapPin className="w-4 h-4 mr-1" /> Different Weather?
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleUnits}
            >
              {units === "metric" ? "Metric: °C, m/s" : "Imperial: °F, mph"}
            </Button>
          </div>
        </div>
      </div>

      {errorMessage && <ErrorMessage message={errorMessage} />}
      
      {isLoading && <LoadingIndicator />}
      
      {/* Main content */}
      {weather && !error && (
        <div className="max-w-6xl mx-auto px-4 py-4">
          {/* Location and current conditions */}
          <div className="mb-4">
            <div className="text-gray-600 dark:text-gray-300">
              {dateString}, {timeString}
            </div>
            <h1 className="text-2xl font-bold flex items-center gap-1">
              {weather.city}, {weather.country}
            </h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left column */}
            <div>
              {/* Current weather card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
                <div className="flex items-start">
                  <div className="flex-1">
                    {/* Temperature with icon */}
                    <div className="flex items-center">
                      <span className="text-6xl font-bold">
                        {convertTemp(weather.temp)}{tempUnit}
                      </span>
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 mt-1">
                      Feels like {convertTemp(weather.feelsLike)}{tempUnit}. {weather.description}.
                    </div>
                    
                    {/* Weather details */}
                    <div className="flex flex-wrap mt-4 gap-x-6 gap-y-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Wind className="w-4 h-4" />
                        <span>{convertWindSpeed(weather.wind)} {windSpeedUnit} {weather.wind > 0 ? 'W' : ''}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Droplets className="w-4 h-4" />
                        <span>Humidity: {weather.humidity}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Compass className="w-4 h-4" />
                        <span>Pressure: {weather.pressure}hPa</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Thermometer className="w-4 h-4" />
                        <span>Dew point: 10°C</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CloudRain className="w-4 h-4" />
                        <span>UV: {weather.uvIndex || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12a5 5 0 0 0 5 5 5 5 0 0 0 5-5 5 5 0 0 0 5 5 5 5 0 0 1 5-5"/>
                          <path d="M19 6V4"/>
                          <path d="M19 10V8"/>
                          <path d="M19 14v-2"/>
                          <path d="M19 18v-2"/>
                          <path d="M19 22v-2"/>
                          <path d="M12 22v-2"/>
                          <path d="M5 22v-2"/>
                        </svg>
                        <span>Visibility: {(weather.visibility / 1000).toFixed(1)}km</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Weather icon */}
                  <div>
                    <img
                      src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
                      alt={weather.condition}
                      className="w-24 h-24"
                    />
                  </div>
                </div>
              </div>

              {/* No precipitation notice */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
                <h3 className="font-medium">No precipitation within an hour</h3>
                <div className="mt-2 flex flex-col">
                  <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-1 w-0"></div>
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-gray-500">
                    {weather.hourlyForecast?.slice(0, 5).map((hour, index) => (
                      <div key={index}>{hour.time}</div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Hourly forecast */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                <h3 className="font-medium mb-3">Hourly forecast</h3>
                
                {weather.hourlyForecast && weather.hourlyForecast.length > 0 && (
                  <TemperatureGraph hourlyData={weather.hourlyForecast} />
                )}
                
                <div className="flex justify-between items-center text-sm mt-4">
                  {weather.hourlyForecast?.slice(0, 8).map((hour, index) => (
                    <div key={index} className="text-center">
                      <div>{hour.time.split(' ')[0]}</div>
                      <img 
                        src={`https://openweathermap.org/img/wn/${hour.icon}.png`}
                        alt={hour.condition}
                        className="w-10 h-10 mx-auto"
                      />
                      <div className="font-medium">{Math.round(hour.temp)}°</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right column */}
            <div>
              {/* Map */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="h-64 bg-gray-200">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    scrolling="no" 
                    marginHeight={0} 
                    marginWidth={0} 
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${weather.city}&amp;layer=mapnik`} 
                    style={{ border: '1px solid #ddd' }}
                  ></iframe>
                  <div className="text-xs text-right p-1">
                    © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>
                  </div>
                </div>
              </div>
              
              {/* 8-day forecast */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                <h3 className="font-medium mb-3">8-day forecast</h3>
                
                <div>
                  {weather.forecast?.map((day, index) => (
                    <ForecastDay key={index} day={day} isFirst={index === 0} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!weather && !isLoading && !city && (
        <div className="max-w-6xl mx-auto px-4 py-10 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
          </svg>
          <h3 className="mt-4 text-xl font-medium">Search for a location</h3>
          <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
            Enter a city name in the search box above to get detailed weather information
          </p>
        </div>
      )}
      
      <footer className="mt-auto py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} Weather App. Powered by OpenWeatherMap API.</p>
      </footer>
    </div>
  );
}
