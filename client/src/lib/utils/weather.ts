import { 
  Cloud, 
  CloudRain, 
  Sun, 
  Snowflake, 
  CloudFog, 
  Cloud as CloudIcon,
  Zap
} from "lucide-react";

// Get the appropriate icon component based on the weather condition
export const getWeatherIcon = (condition: string) => {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower === 'clear') return Sun;
  if (conditionLower === 'clouds') return CloudIcon;
  if (conditionLower === 'rain' || conditionLower === 'drizzle') return CloudRain;
  if (conditionLower === 'snow') return Snowflake;
  if (conditionLower === 'mist' || conditionLower === 'fog' || conditionLower === 'haze') return CloudFog;
  if (conditionLower === 'thunderstorm') return Zap;
  
  // Default to cloud if condition is not recognized
  return Cloud;
};

// Get the background class based on the weather condition
export const getWeatherBackground = (condition: string): string => {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower === 'clear') return 'bg-gradient-to-b from-[#4da0ff] to-[#86c6ff]';
  if (conditionLower === 'clouds') return 'bg-gradient-to-b from-[#7f8c8d] to-[#bdc3c7]';
  if (conditionLower === 'rain' || conditionLower === 'drizzle') return 'bg-gradient-to-b from-[#515c69] to-[#7f8c8d]';
  if (conditionLower === 'snow') return 'bg-gradient-to-b from-[#e6f5fd] to-[#d0e9fa]';
  if (conditionLower === 'mist' || conditionLower === 'fog' || conditionLower === 'haze') return 'bg-gradient-to-b from-[#7590a8] to-[#a4bcce]';
  if (conditionLower === 'thunderstorm') return 'bg-gradient-to-b from-[#2c3e50] to-[#4a627a]';
  
  // Default background if condition is not recognized
  return 'bg-gradient-to-b from-[#4da0ff] to-[#86c6ff]';
};

// Get visibility description based on value in meters
export const getVisibilityDescription = (visibility: number): string => {
  if (visibility >= 10000) return 'Clear visibility';
  if (visibility >= 5000) return 'Good visibility';
  return 'Limited visibility';
};

// Get UV index description (simulated since OpenWeather free tier doesn't provide UV index)
export const getUvIndex = (): { value: string, description: string } => {
  // In a real app, this would come from the API, but we're simulating for now
  const randomUvIndex = Math.floor(Math.random() * 5) + 1;
  
  if (randomUvIndex <= 2) return { value: `${randomUvIndex} (Low)`, description: 'No protection needed' };
  if (randomUvIndex <= 5) return { value: `${randomUvIndex} (Moderate)`, description: 'Some protection required' };
  if (randomUvIndex <= 7) return { value: `${randomUvIndex} (High)`, description: 'Protection essential' };
  return { value: `${randomUvIndex} (Very High)`, description: 'Extra protection needed' };
};
