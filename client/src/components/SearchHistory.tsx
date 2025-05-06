import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Heart, Star, Clock, History } from "lucide-react";
import { getWeatherIcon } from "../lib/utils/weather";
import { useToast } from "@/hooks/use-toast";

// Type for search history item
interface SearchHistoryItem {
  id: number;
  city: string;
  country: string;
  temperature: number;
  condition: string;
  timestamp: string;
  favorite: boolean;
}

export default function SearchHistory() {
  const [activeTab, setActiveTab] = useState<"recent" | "favorites">("recent");
  const { toast } = useToast();

  // Fetch search history
  const { 
    data: historyData,
    isLoading: historyLoading,
    refetch: refetchHistory
  } = useQuery<SearchHistoryItem[]>({
    queryKey: ["/api/history"],
  });

  // Fetch favorites
  const { 
    data: favoritesData,
    isLoading: favoritesLoading,
    refetch: refetchFavorites
  } = useQuery<SearchHistoryItem[]>({
    queryKey: ["/api/favorites"],
  });

  // Handle toggling a search as favorite
  const toggleFavorite = async (id: number) => {
    try {
      const response = await fetch(`/api/history/${id}/favorite`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to update favorite status");
      }

      // Refetch both history and favorites
      refetchHistory();
      refetchFavorites();

      toast({
        title: "Success",
        description: "Favorite status updated!",
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive",
      });
    }
  };

  // Format timestamp to readable date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Determine which data to display based on active tab
  const displayData = activeTab === "recent" ? historyData : favoritesData;
  const isLoading = activeTab === "recent" ? historyLoading : favoritesLoading;

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <History className="mr-2 h-5 w-5" />
            Search History
          </div>
          <div className="flex space-x-2">
            <Button 
              variant={activeTab === "recent" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("recent")}
              className="flex items-center"
            >
              <Clock className="mr-1 h-4 w-4" /> Recent
            </Button>
            <Button 
              variant={activeTab === "favorites" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("favorites")}
              className="flex items-center"
            >
              <Star className="mr-1 h-4 w-4" /> Favorites
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : displayData && displayData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {displayData.map((item) => {
              const WeatherIcon = getWeatherIcon(item.condition);
              return (
                <Card key={item.id} className="overflow-hidden bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{item.city}, {item.country}</h3>
                        <div className="text-sm text-gray-500">{formatDate(item.timestamp)}</div>
                      </div>
                      <button 
                        onClick={() => toggleFavorite(item.id)}
                        className="text-gray-400 hover:text-red-500 focus:outline-none transition-colors"
                        aria-label={item.favorite ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Heart className={`h-5 w-5 ${item.favorite ? "fill-red-500 text-red-500" : ""}`} />
                      </button>
                    </div>
                    <div className="flex items-center">
                      <WeatherIcon className="h-8 w-8 mr-2 text-blue-500" />
                      <div>
                        <span className="text-xl font-bold">{item.temperature}°C</span>
                        <Badge variant="outline" className="ml-2">{item.condition}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            {activeTab === "recent" ? "No search history yet" : "No favorite searches yet"}
          </div>
        )}
      </CardContent>
    </Card>
  );
}