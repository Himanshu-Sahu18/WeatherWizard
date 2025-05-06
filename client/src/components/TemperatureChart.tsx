import { WeatherData } from "../types/weather";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface TemperatureChartProps {
  weather: WeatherData;
}

const TemperatureChart = ({ weather }: TemperatureChartProps) => {
  // If no temperature history data exists, return null
  if (!weather.temperatureHistory || weather.temperatureHistory.length === 0) {
    return null;
  }
  
  // Format the data for the chart
  const formattedData = weather.temperatureHistory.map(item => ({
    date: item.date,
    temperature: item.temperature,
  }));
  
  // Calculate the min and max temperature for y-axis domain
  const temperatures = formattedData.map(item => item.temperature);
  const minTemp = Math.min(...temperatures) - 2;
  const maxTemp = Math.max(...temperatures) + 2;
  
  return (
    <Card className="my-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400">
          Temperature History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ddd" vertical={false} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickMargin={10}
                stroke="#888"
              />
              <YAxis 
                domain={[minTemp, maxTemp]}
                tick={{ fontSize: 12 }}
                tickCount={6}
                stroke="#888"
                label={{ value: '°C', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
              />
              <Tooltip 
                formatter={(value) => [`${value}°C`, 'Temperature']}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px', border: '1px solid #ddd' }}
              />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ fill: '#1d4ed8', strokeWidth: 2, r: 6 }}
                animationDuration={1500}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {weather.stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-sm text-gray-500">Average</div>
              <div className="text-lg font-bold">{weather.stats.averageTemp.toFixed(1)}°C</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">Highest</div>
              <div className="text-lg font-bold text-red-500">{weather.stats.highestTemp.toFixed(1)}°C</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">Lowest</div>
              <div className="text-lg font-bold text-blue-500">{weather.stats.lowestTemp.toFixed(1)}°C</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">Fluctuation</div>
              <div className="text-lg font-bold">
                {(weather.stats.highestTemp - weather.stats.lowestTemp).toFixed(1)}°C
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TemperatureChart;