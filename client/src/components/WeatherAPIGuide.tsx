export default function WeatherAPIGuide() {
  return (
    <div className="max-w-lg mx-auto mt-12 p-5 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Getting Started</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Try searching for your city to see current weather conditions. Our app provides:
      </p>
      <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 mb-4">
        <li>Current temperature and feels-like temperature</li>
        <li>Weather conditions (sunny, cloudy, rainy, etc.)</li>
        <li>Wind speed, humidity, and pressure</li>
        <li>Sunrise and sunset times</li>
        <li>Visibility information</li>
      </ul>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Data provided by OpenWeatherMap API
      </p>
    </div>
  );
}
