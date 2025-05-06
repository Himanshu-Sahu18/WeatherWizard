import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { getCitySuggestions } from "@/lib/api";

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch suggestions when user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (city.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      
      const results = await getCitySuggestions(city);
      setSuggestions(results);
    };

    const timeoutId = setTimeout(() => {
      fetchSuggestions();
    }, 300); // Debounce to avoid too many API calls

    return () => clearTimeout(timeoutId);
  }, [city]);

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) && 
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
      setShowSuggestions(false);
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCity(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
  };

  return (
    <div className="max-w-md mx-auto mb-8">
      <form className="flex flex-col sm:flex-row gap-2" onSubmit={handleSubmit}>
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </div>
          <Input
            ref={inputRef}
            type="text"
            value={city}
            onChange={handleCityChange}
            onClick={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Enter city name..."
            className="pl-10 py-6 text-gray-900 bg-white rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            disabled={isLoading}
            autoComplete="off"
          />
          
          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div 
              ref={suggestionsRef}
              className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden"
            >
              <ul className="max-h-60 overflow-auto">
                {suggestions.map((suggestion, index) => (
                  <li 
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <Search className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <Button 
          type="submit" 
          className="h-12 px-5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          disabled={isLoading || !city}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Search"
          )}
        </Button>
      </form>
    </div>
  );
}
