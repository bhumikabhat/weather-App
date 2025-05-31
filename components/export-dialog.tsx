"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Download } from "lucide-react"

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

interface ExportDialogProps {
  records: WeatherRecord[]
  onClose: () => void
}

export function ExportDialog({ records, onClose }: ExportDialogProps) {
  const [format, setFormat] = useState("json")

  const exportData = () => {
    let content = ""
    let filename = ""
    let mimeType = ""

    switch (format) {
      case "json":
        content = JSON.stringify(records, null, 2)
        filename = "weather-data.json"
        mimeType = "application/json"
        break

      case "csv":
        const headers = [
          "ID",
          "Location",
          "Start Date",
          "End Date",
          "Temperature",
          "Description",
          "Humidity",
          "Wind Speed",
          "Created At",
        ]
        const csvRows = [
          headers.join(","),
          ...records.map((record) =>
            [
              record.id,
              `"${record.location}"`,
              record.date_range_start,
              record.date_range_end,
              record.temperature,
              `"${record.description}"`,
              record.humidity,
              record.wind_speed,
              record.created_at,
            ].join(","),
          ),
        ]
        content = csvRows.join("\n")
        filename = "weather-data.csv"
        mimeType = "text/csv"
        break

      case "xml":
        content = `<?xml version="1.0" encoding="UTF-8"?>
<weather_records>
${records
  .map(
    (record) => `  <record>
    <id>${record.id}</id>
    <location>${record.location}</location>
    <date_range_start>${record.date_range_start}</date_range_start>
    <date_range_end>${record.date_range_end}</date_range_end>
    <temperature>${record.temperature}</temperature>
    <description>${record.description}</description>
    <humidity>${record.humidity}</humidity>
    <wind_speed>${record.wind_speed}</wind_speed>
    <created_at>${record.created_at}</created_at>
  </record>`,
  )
  .join("\n")}
</weather_records>`
        filename = "weather-data.xml"
        mimeType = "application/xml"
        break

      case "markdown":
        content = `# Weather Data Export

| Location | Start Date | End Date | Temperature | Description | Humidity | Wind Speed | Created At |
|----------|------------|----------|-------------|-------------|----------|------------|------------|
${records
  .map(
    (record) =>
      `| ${record.location} | ${record.date_range_start.split("T")[0]} | ${record.date_range_end.split("T")[0]} | ${record.temperature}°F | ${record.description} | ${record.humidity}% | ${record.wind_speed} mph | ${new Date(record.created_at).toLocaleDateString()} |`,
  )
  .join("\n")}

*Exported on ${new Date().toLocaleString()}*`
        filename = "weather-data.md"
        mimeType = "text/markdown"
        break
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Export Weather Data</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium">Export Format</Label>
            <RadioGroup value={format} onValueChange={setFormat} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="json" id="json" />
                <Label htmlFor="json">JSON</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv">CSV</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="xml" id="xml" />
                <Label htmlFor="xml">XML</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="markdown" id="markdown" />
                <Label htmlFor="markdown">Markdown</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="text-sm text-gray-600">
            Exporting {records.length} weather record{records.length !== 1 ? "s" : ""}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
