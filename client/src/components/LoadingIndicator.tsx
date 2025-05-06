import { CloudSunRain } from "lucide-react";

export default function LoadingIndicator() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-16 h-16 mb-4 text-blue-500">
        <CloudSunRain className="h-16 w-16 animate-[spin_3s_linear_infinite]" />
      </div>
      <p className="text-gray-600 dark:text-gray-300">Fetching weather data...</p>
    </div>
  );
}
