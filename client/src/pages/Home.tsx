import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchWeather } from "@/lib/api";
import { WeatherData } from "@/types/weather";
import { useToast } from "@/hooks/use-toast";

import SearchBar from "@/components/SearchBar";
import WeatherDisplay from "@/components/WeatherDisplay";
import LoadingIndicator from "@/components/LoadingIndicator";
import ErrorMessage from "@/components/ErrorMessage";
import WeatherAPIGuide from "@/components/WeatherAPIGuide";
import SearchHistory from "@/components/SearchHistory";

export default function Home() {
  const [city, setCity] = useState("");
  const { toast } = useToast();
  
  const { 
    data: weather,
    isLoading,
    error,
    refetch
  } = useQuery<WeatherData, Error>({
    queryKey: ['/api/weather', city],
    enabled: false,
  });

  const handleSearch = async (searchCity: string) => {
    setCity(searchCity);
    try {
      await refetch();
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to fetch weather data",
        variant: "destructive",
      });
    }
  };

  const errorMessage = error?.message;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-blue-600 dark:text-blue-400">
          <i className="fas fa-cloud-sun mr-2"></i>WeatherNow
        </h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
          Get real-time weather updates for any city
        </p>
      </header>

      <SearchBar onSearch={handleSearch} isLoading={isLoading} />
      
      {errorMessage && <ErrorMessage message={errorMessage} />}
      
      {isLoading && <LoadingIndicator />}
      
      {weather && !error && <WeatherDisplay weather={weather} />}
      
      {!weather && !isLoading && <WeatherAPIGuide />}
      
      {/* Search History */}
      <SearchHistory />
      
      <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} WeatherNow App. Powered by OpenWeatherMap API.</p>
      </footer>
    </div>
  );
}
