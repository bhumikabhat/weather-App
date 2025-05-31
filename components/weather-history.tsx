"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Download, Calendar, MapPin, Thermometer, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { EditWeatherDialog } from "@/components/edit-weather-dialog"
import { ExportDialog } from "@/components/export-dialog"

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

export function WeatherHistory() {
  const [records, setRecords] = useState<WeatherRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingRecord, setEditingRecord] = useState<WeatherRecord | null>(null)
  const [showExport, setShowExport] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchRecords()
  }, [])

  const fetchRecords = async () => {
    try {
      const response = await fetch("/api/weather-history")
      const data = await response.json()

      if (response.ok) {
        setRecords(data)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error fetching records:", error)
      toast({
        title: "Error",
        description: "Failed to fetch weather history",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteRecord = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return

    try {
      const response = await fetch(`/api/weather-history?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setRecords(records.filter((record) => record.id !== id))
        toast({
          title: "Success",
          description: "Record deleted successfully",
        })
      } else {
        throw new Error("Failed to delete record")
      }
    } catch (error) {
      console.error("Error deleting record:", error)
      toast({
        title: "Error",
        description: "Failed to delete record",
        variant: "destructive",
      })
    }
  }

  const handleUpdateRecord = (updatedRecord: WeatherRecord) => {
    setRecords(records.map((record) => (record.id === updatedRecord.id ? updatedRecord : record)))
    setEditingRecord(null)
  }

  const filteredRecords = records.filter(
    (record) =>
      record.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Weather History</CardTitle>
            <div className="flex gap-2">
              <Button onClick={() => setShowExport(true)} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search by location or weather description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          {filteredRecords.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {records.length === 0
                ? "No weather records found. Search for weather to create your first record!"
                : "No records match your search criteria."}
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredRecords.map((record) => (
                <Card key={record.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="font-semibold">{record.location}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {formatDate(record.date_range_start)} - {formatDate(record.date_range_end)}
                          </span>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Thermometer className="h-4 w-4 text-red-500" />
                            <span className="font-medium">{record.temperature}°F</span>
                          </div>
                          <Badge variant="secondary">{record.description}</Badge>
                        </div>

                        <div className="text-sm text-gray-600">
                          Humidity: {record.humidity}% • Wind: {record.wind_speed} mph
                        </div>

                        <div className="text-xs text-gray-400">
                          Recorded: {new Date(record.created_at).toLocaleString()}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setEditingRecord(record)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => deleteRecord(record.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {editingRecord && (
        <EditWeatherDialog
          record={editingRecord}
          onUpdate={handleUpdateRecord}
          onClose={() => setEditingRecord(null)}
        />
      )}

      {showExport && <ExportDialog records={filteredRecords} onClose={() => setShowExport(false)} />}
    </div>
  )
}
