import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const openWeatherApiKey = process.env.OPENWEATHER_API_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: NextRequest) {
  try {
    const { location } = await request.json()

    if (!location) {
      return NextResponse.json({ error: "Location is required" }, { status: 400 })
    }

    // Determine if location is coordinates or place name
    const isCoordinates = /^-?\d+\.?\d*,-?\d+\.?\d*$/.test(location.trim())

    let weatherUrl = ""
    if (isCoordinates) {
      const [lat, lon] = location.split(",")
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=imperial`
    } else {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${openWeatherApiKey}&units=imperial`
    }

    // Fetch current weather
    const weatherResponse = await fetch(weatherUrl)
    const weatherData = await weatherResponse.json()

    if (!weatherResponse.ok) {
      return NextResponse.json(
        { error: weatherData.message || "Failed to fetch weather data" },
        { status: weatherResponse.status },
      )
    }

    // Fetch 5-day forecast
    let forecastUrl = ""
    if (isCoordinates) {
      const [lat, lon] = location.split(",")
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=imperial`
    } else {
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&appid=${openWeatherApiKey}&units=imperial`
    }

    const forecastResponse = await fetch(forecastUrl)
    const forecastData = await forecastResponse.json()

    // Store weather data in database
    const weatherRecord = {
      location: `${weatherData.name}, ${weatherData.sys.country}`,
      date_range_start: new Date().toISOString(),
      date_range_end: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      temperature: Math.round(weatherData.main.temp),
      description: weatherData.weather[0].description,
      humidity: weatherData.main.humidity,
      wind_speed: Math.round(weatherData.wind.speed * 10) / 10, // Round to 1 decimal
    }

    const { error: dbError } = await supabase.from("weather_records").insert([weatherRecord])

    if (dbError) {
      console.error("Database error:", dbError)
      // Don't fail the request if database insert fails
    }

    return NextResponse.json({
      current: weatherData,
      forecast: forecastData,
    })
  } catch (error) {
    console.error("Weather API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
