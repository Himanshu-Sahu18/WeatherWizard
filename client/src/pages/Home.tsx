import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchWeather } from "@/lib/api";
import { WeatherData } from "@/types/weather";
import { useToast } from "@/hooks/use-toast";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import LoadingIndicator from "@/components/LoadingIndicator";
import ErrorMessage from "@/components/ErrorMessage";
import { cn } from "@/lib/utils";

export default function Home() {
  const [city, setCity] = useState("");
  const [searchInput, setSearchInput] = useState("");
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-start py-8 px-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold flex items-center justify-center gap-2 text-gray-800 dark:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
          </svg>
          <span>Climate Pulse</span>
        </h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mt-2">
          Real-time weather updates from around the world, beautifully presented
        </p>
      </header>

      <div className="w-full max-w-md mx-auto mb-8">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="Enter city name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          />
          <Button type="submit" variant="default" size="icon" className="bg-blue-500 hover:bg-blue-600">
            <Search className="h-5 w-5" />
          </Button>
        </form>
      </div>
      
      {errorMessage && <ErrorMessage message={errorMessage} />}
      
      {isLoading && <LoadingIndicator />}
      
      {weather && !error && (
        <Card className="w-full max-w-md mx-auto p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg">
          <div className="flex flex-col items-start">
            <div className="flex items-start justify-between w-full">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{weather.city}</h2>
                <p className="text-gray-600 dark:text-gray-300">{weather.country} • {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              </div>
              <div className="flex flex-col items-center mt-2">
                <svg className="w-12 h-12 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
                </svg>
                <span className="text-sm font-medium text-gray-600">{weather.condition}</span>
              </div>
            </div>
            
            <div className="mt-6 w-full">
              <div className="flex items-center">
                <span className="text-6xl font-bold text-gray-900 dark:text-white flex items-start">
                  <svg className="w-6 h-6 text-red-500 mt-2 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>
                  </svg>
                  {Math.round(weather.temp)}°C
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Feels like {Math.round(weather.feelsLike)}°C</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full mt-6">
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Humidity</p>
                <p className="text-xl font-semibold text-gray-800 dark:text-white">{weather.humidity}%</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Wind Speed</p>
                <p className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                  <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/>
                    <path d="M9.6 4.6A2 2 0 1 1 11 8H2"/>
                    <path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>
                  </svg>
                  {(weather.wind * 3.6).toFixed(2)} m/s
                </p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Sunrise</p>
                <p className="text-xl font-semibold text-gray-800 dark:text-white">{weather.sunrise}</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Sunset</p>
                <p className="text-xl font-semibold text-gray-800 dark:text-white">{weather.sunset}</p>
              </div>
            </div>
          </div>
        </Card>
      )}
      
      {!weather && !isLoading && !city && (
        <div className="text-center w-full max-w-md mx-auto p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg">
          <svg className="w-16 h-16 mx-auto text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
          </svg>
          <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">Check the weather</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Enter a city name above to get the current weather conditions
          </p>
        </div>
      )}
      
      <footer className="mt-auto py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} Climate Pulse. Powered by OpenWeatherMap API.</p>
      </footer>
    </div>
  );
}
