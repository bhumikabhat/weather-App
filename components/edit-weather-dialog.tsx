"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface WeatherRecord {
  id: string
  location: string
  date_range_start: string
  date_range_end: string
  temperature: number
  description: string
  humidity: number
  wind_speed: number
  created_at: string
}

interface EditWeatherDialogProps {
  record: WeatherRecord
  onUpdate: (record: WeatherRecord) => void
  onClose: () => void
}

export function EditWeatherDialog({ record, onUpdate, onClose }: EditWeatherDialogProps) {
  const [formData, setFormData] = useState({
    location: record.location,
    date_range_start: record.date_range_start.split("T")[0],
    date_range_end: record.date_range_end.split("T")[0],
    temperature: record.temperature.toString(),
    description: record.description,
    humidity: record.humidity.toString(),
    wind_speed: record.wind_speed.toString(),
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/weather-history", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: record.id,
          ...formData,
          temperature: Number.parseFloat(formData.temperature),
          humidity: Number.parseInt(formData.humidity),
          wind_speed: Number.parseFloat(formData.wind_speed),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        onUpdate(data)
        toast({
          title: "Success",
          description: "Weather record updated successfully",
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error updating record:", error)
      toast({
        title: "Error",
        description: "Failed to update weather record",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Weather Record</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={formData.date_range_start}
                onChange={(e) => handleChange("date_range_start", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={formData.date_range_end}
                onChange={(e) => handleChange("date_range_end", e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="temperature">Temperature (°F)</Label>
            <Input
              id="temperature"
              type="number"
              value={formData.temperature}
              onChange={(e) => handleChange("temperature", e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="humidity">Humidity (%)</Label>
              <Input
                id="humidity"
                type="number"
                min="0"
                max="100"
                value={formData.humidity}
                onChange={(e) => handleChange("humidity", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="wind-speed">Wind Speed (mph)</Label>
              <Input
                id="wind-speed"
                type="number"
                min="0"
                step="0.1"
                value={formData.wind_speed}
                onChange={(e) => handleChange("wind_speed", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Record"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
