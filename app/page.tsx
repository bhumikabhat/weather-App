"use client"

import { useState } from "react"
import { WeatherSearch } from "@/components/weather-search"
import { WeatherDisplay } from "@/components/weather-display"
import { WeatherHistory } from "@/components/weather-history"
import { InfoDialog } from "@/components/info-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Cloud } from "lucide-react"

export default function WeatherApp() {
  const [currentWeather, setCurrentWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [refreshHistory, setRefreshHistory] = useState(0)

  const handleWeatherData = (weather: any, forecastData: any) => {
    setCurrentWeather(weather)
    setForecast(forecastData)
    setRefreshHistory((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Cloud className="h-8 w-8 text-white" />
            <h1 className="text-4xl font-bold text-white">WeatherPro</h1>
            <InfoDialog />
          </div>
          <p className="text-blue-100 text-lg">Advanced Weather Application with Historical Data Management</p>
          <p className="text-blue-200 text-sm mt-2">Created by [Bhumika Bhat] for PM Accelerator Technical Assessment</p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="current">Current Weather</TabsTrigger>
              <TabsTrigger value="history">Weather History</TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="space-y-6">
              <WeatherSearch onWeatherData={handleWeatherData} setLoading={setLoading} />

              {currentWeather && <WeatherDisplay weather={currentWeather} forecast={forecast} />}
            </TabsContent>

            <TabsContent value="history">
              <WeatherHistory key={refreshHistory} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
