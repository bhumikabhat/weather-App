"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Thermometer, Droplets, Wind, Eye, Gauge, Sunrise } from "lucide-react"

interface WeatherDisplayProps {
  weather: any
  forecast: any
}

export function WeatherDisplay({ weather, forecast }: WeatherDisplayProps) {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
  }

  return (
    <div className="space-y-6">
      {/* Current Weather */}
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Current Weather in {weather.name}, {weather.sys.country}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Main Weather Info */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center">
                <img
                  src={getWeatherIcon(weather.weather[0].icon) || "/placeholder.svg"}
                  alt={weather.weather[0].description}
                  className="w-20 h-20"
                />
              </div>
              <div>
                <div className="text-4xl font-bold">{Math.round(weather.main.temp)}°F</div>
                <div className="text-lg text-gray-600 capitalize">{weather.weather[0].description}</div>
                <div className="text-sm text-gray-500">Feels like {Math.round(weather.main.feels_like)}°F</div>
              </div>
            </div>

            {/* Weather Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-red-500" />
                <div>
                  <div className="text-sm text-gray-600">High/Low</div>
                  <div className="font-semibold">
                    {Math.round(weather.main.temp_max)}°/{Math.round(weather.main.temp_min)}°
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-sm text-gray-600">Humidity</div>
                  <div className="font-semibold">{weather.main.humidity}%</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Wind className="h-5 w-5 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-600">Wind</div>
                  <div className="font-semibold">{Math.round(weather.wind.speed)} mph</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-500" />
                <div>
                  <div className="text-sm text-gray-600">Visibility</div>
                  <div className="font-semibold">{(weather.visibility / 1000).toFixed(1)} km</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-orange-500" />
                <div>
                  <div className="text-sm text-gray-600">Pressure</div>
                  <div className="font-semibold">{weather.main.pressure} hPa</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Sunrise className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="text-sm text-gray-600">Sunrise</div>
                  <div className="font-semibold">{formatTime(weather.sys.sunrise)}</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5-Day Forecast */}
      {forecast && (
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-xl">5-Day Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {forecast.list
                .filter((_: any, index: number) => index % 8 === 0)
                .slice(0, 5)
                .map((day: any, index: number) => (
                  <div key={index} className="text-center p-4 rounded-lg bg-gray-50">
                    <div className="font-semibold text-sm mb-2">{index === 0 ? "Today" : formatDate(day.dt)}</div>
                    <img
                      src={getWeatherIcon(day.weather[0].icon) || "/placeholder.svg"}
                      alt={day.weather[0].description}
                      className="w-12 h-12 mx-auto mb-2"
                    />
                    <div className="text-sm capitalize mb-2">{day.weather[0].description}</div>
                    <div className="font-bold">
                      {Math.round(day.main.temp_max)}°/{Math.round(day.main.temp_min)}°
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
