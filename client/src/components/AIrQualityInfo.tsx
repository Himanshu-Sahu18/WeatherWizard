import { WeatherData } from "../types/weather";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Wind } from "lucide-react";

interface AirQualityInfoProps {
  weather: WeatherData;
}

const AirQualityInfo = ({ weather }: AirQualityInfoProps) => {
  if (!weather.airQuality) return null;
  
  const airQuality = weather.airQuality;
  const uvIndex = weather.uvIndex || 0;
  
  // Get air quality description and color
  const getAirQualityInfo = (value: number) => {
    if (value === 1) return { text: "Excellent", color: "bg-green-500" };
    if (value === 2) return { text: "Good", color: "bg-green-400" };
    if (value === 3) return { text: "Moderate", color: "bg-yellow-400" };
    if (value === 4) return { text: "Poor", color: "bg-orange-500" };
    return { text: "Very Poor", color: "bg-red-500" };
  };
  
  // Get UV index description and color
  const getUVIndexInfo = (value: number) => {
    if (value <= 2) return { text: "Low", color: "bg-green-500" };
    if (value <= 5) return { text: "Moderate", color: "bg-yellow-400" };
    if (value <= 7) return { text: "High", color: "bg-orange-500" };
    return { text: "Very High", color: "bg-red-500" };
  };
  
  const airQualityInfo = getAirQualityInfo(airQuality);
  const uvIndexInfo = getUVIndexInfo(uvIndex);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Air Quality</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Quality Index</span>
              <span className="text-sm font-bold">{airQualityInfo.text}</span>
            </div>
            <Progress value={airQuality * 20} className="h-2" indicatorClassName={airQualityInfo.color} />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {airQualityInfo.text === "Excellent" || airQualityInfo.text === "Good" ?
                "Air quality is satisfactory and poses little or no risk." :
                "Air quality may be unhealthy for sensitive groups. Reduce outdoor activity."}
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">UV Index</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Current Index: {uvIndex}</span>
              <span className="text-sm font-bold">{uvIndexInfo.text}</span>
            </div>
            <Progress value={uvIndex * 10} className="h-2" indicatorClassName={uvIndexInfo.color} />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {uvIndexInfo.text === "Low" ?
                "No protection needed. You can safely stay outside." :
                uvIndexInfo.text === "Moderate" ?
                "Protection needed. Wear sunscreen and a hat." :
                "Extra protection required. Seek shade during midday hours."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AirQualityInfo;