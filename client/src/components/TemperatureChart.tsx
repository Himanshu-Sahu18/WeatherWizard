import { WeatherData, TemperatureHistoryItem } from "../types/weather";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

interface TemperatureChartProps {
  weather: WeatherData;
}

const TemperatureChart = ({ weather }: TemperatureChartProps) => {
  if (!weather.temperatureHistory || weather.temperatureHistory.length === 0) {
    return null;
  }

  const temperatureData = [...weather.temperatureHistory];
  
  // Add today's temperature as the last point
  temperatureData.push({
    date: "Today",
    temperature: weather.temp
  });

  // Find min and max for the y-axis domain
  const minTemp = Math.floor(Math.min(...temperatureData.map(d => d.temperature))) - 2;
  const maxTemp = Math.ceil(Math.max(...temperatureData.map(d => d.temperature))) + 2;

  // Calculate the average temperature
  const avgTemp = temperatureData.reduce((sum, item) => sum + item.temperature, 0) / temperatureData.length;

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded shadow-md">
          <p className="text-gray-700 dark:text-gray-300 font-bold">{`${label}`}</p>
          <p className="text-gray-700 dark:text-gray-300">
            <span className="text-blue-500">{`${payload[0].value}°C`}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="my-8">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center text-blue-600 dark:text-blue-400">Temperature Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={temperatureData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis domain={[minTemp, maxTemp]} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={avgTemp} stroke="#FF7C43" strokeDasharray="3 3" strokeWidth={2} />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#0ea5e9"
                strokeWidth={3}
                activeDot={{ r: 6 }}
                dot={{ r: 4, fill: "#0ea5e9" }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex justify-center items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center mr-4">
              <div className="w-3 h-0.5 bg-[#0ea5e9] mr-1"></div>
              <span>Temperature</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-0.5 bg-[#FF7C43] mr-1 dashed"></div>
              <span>Average ({avgTemp.toFixed(1)}°C)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemperatureChart;