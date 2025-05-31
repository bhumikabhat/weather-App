"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Search, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WeatherSearchProps {
  onWeatherData: (weather: any, forecast: any) => void
  setLoading: (loading: boolean) => void
}

export function WeatherSearch({ onWeatherData, setLoading }: WeatherSearchProps) {
  const [location, setLocation] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const { toast } = useToast()

  const searchWeather = async (searchLocation: string) => {
    if (!searchLocation.trim()) {
      toast({
        title: "Error",
        description: "Please enter a location",
        variant: "destructive",
      })
      return
    }

    setIsSearching(true)
    setLoading(true)

    try {
      const response = await fetch("/api/weather", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ location: searchLocation }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch weather data")
      }

      onWeatherData(data.current, data.forecast)

      toast({
        title: "Success",
        description: `Weather data retrieved for ${data.current.name}`,
      })
    } catch (error) {
      console.error("Error fetching weather:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch weather data",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
      setLoading(false)
    }
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by this browser",
        variant: "destructive",
      })
      return
    }

    setIsGettingLocation(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        const coords = `${latitude},${longitude}`
        await searchWeather(coords)
        setIsGettingLocation(false)
      },
      (error) => {
        console.error("Geolocation error:", error)
        toast({
          title: "Error",
          description: "Unable to get your current location",
          variant: "destructive",
        })
        setIsGettingLocation(false)
      },
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    searchWeather(location)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Search Weather</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter city, zip code, or coordinates (lat,lng)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isSearching} className="px-6">
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </form>

        <div className="text-center">
          <Button
            type="button"
            variant="outline"
            onClick={getCurrentLocation}
            disabled={isGettingLocation}
            className="w-full sm:w-auto"
          >
            {isGettingLocation ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <MapPin className="h-4 w-4 mr-2" />
            )}
            Use Current Location
          </Button>
        </div>

        <div className="text-sm text-gray-600 text-center">
          <p>Supported formats:</p>
          <p>• City name (e.g., "New York")</p>
          <p>• Zip code (e.g., "10001")</p>
          <p>• Coordinates (e.g., "40.7128,-74.0060")</p>
        </div>
      </CardContent>
    </Card>
  )
}
