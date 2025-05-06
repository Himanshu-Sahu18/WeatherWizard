import { WeatherData } from "../types/weather";
import { getWeatherIcon, getWeatherBackground } from "../lib/utils/weather";

interface WeatherCardProps {
  weather: WeatherData;
}

export default function WeatherCard({ weather }: WeatherCardProps) {
  const WeatherIcon = getWeatherIcon(weather.condition);
  const backgroundClass = getWeatherBackground(weather.condition);

  return (
    <div 
      className={`max-w-md mx-auto mb-8 rounded-3xl overflow-hidden shadow-lg text-white ${backgroundClass}`}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">{weather.city}</h2>
            <p className="text-sm opacity-90">{weather.date}</p>
          </div>
          <div className="text-right">
            <span className="text-5xl font-bold">{Math.round(weather.temp)}°</span>
            <div className="flex items-center justify-end mt-1">
              <span className="text-sm mr-1">Feels like</span>
              <span className="text-sm font-medium">{Math.round(weather.feelsLike)}°</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <WeatherIcon className="text-4xl mr-2 h-8 w-8" />
            <span className="text-xl">{weather.condition}</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm mr-2">H: {Math.round(weather.tempMax)}°</span>
            <span className="text-sm">L: {Math.round(weather.tempMin)}°</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-2 bg-white/20 rounded-lg">
            <i className="fas fa-wind mb-1"></i>
            <p className="text-xs">Wind</p>
            <p className="font-medium">{weather.wind} m/s</p>
          </div>
          <div className="p-2 bg-white/20 rounded-lg">
            <i className="fas fa-tint mb-1"></i>
            <p className="text-xs">Humidity</p>
            <p className="font-medium">{weather.humidity}%</p>
          </div>
          <div className="p-2 bg-white/20 rounded-lg">
            <i className="fas fa-compress-arrows-alt mb-1"></i>
            <p className="text-xs">Pressure</p>
            <p className="font-medium">{weather.pressure} hPa</p>
          </div>
        </div>
      </div>
    </div>
  );
}
