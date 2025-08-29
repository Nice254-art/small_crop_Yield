import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudRain, Sun, Cloud, CloudSnow } from "lucide-react";

export default function WeatherWidget() {
  const { user } = useAuth();
  
  const { data: fields } = useQuery({
    queryKey: ["/api/fields"],
    enabled: !!user,
  });

  // Get weather for first field (in real app, would show aggregate or selected field weather)
  const { data: weatherData } = useQuery({
    queryKey: ["/api/weather", fields?.[0]?.id, "latest"],
    enabled: !!fields?.[0]?.id,
  });

  const getWeatherIcon = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case 'sunny':
        return <Sun className="text-yellow-500" />;
      case 'cloudy':
      case 'partly cloudy':
        return <Cloud className="text-gray-500" />;
      case 'light rain':
      case 'heavy rain':
        return <CloudRain className="text-blue-500" />;
      default:
        return <Sun className="text-yellow-500" />;
    }
  };

  // Mock weather data if no real data available
  const mockWeather = {
    temperature: '24',
    condition: 'Light Rain',
    humidity: '78',
    windSpeed: '12',
    rainfall: '15'
  };

  const weather = weatherData || mockWeather;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weather Conditions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <div className="w-16 h-16 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
            {getWeatherIcon(weather.condition)}
          </div>
          <div className="text-2xl font-bold" data-testid="text-temperature">
            {weather.temperature}°C
          </div>
          <div className="text-muted-foreground" data-testid="text-condition">
            {weather.condition}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Humidity</span>
            <span data-testid="text-humidity">{weather.humidity}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Wind Speed</span>
            <span data-testid="text-wind-speed">{weather.windSpeed} km/h</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Rainfall (24h)</span>
            <span data-testid="text-rainfall">{weather.rainfall}mm</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
