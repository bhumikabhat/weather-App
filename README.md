# WeatherPro - Advanced Weather Application

A comprehensive weather application built with Next.js, featuring current weather data, forecasts, historical data management, and export capabilities. Created for the PM Accelerator Technical Assessment.

## Features

### 🌤️ Current Weather
- Real-time weather data for any location
- Detailed weather information including temperature, humidity, wind speed, visibility, and pressure
- Support for multiple location formats (city names, zip codes, coordinates)
- Geolocation support for current location weather

### 📅 5-Day Forecast
- Extended weather forecast with daily predictions
- Visual weather icons and detailed descriptions
- High/low temperature ranges

### 📊 Weather History Management
- Automatic saving of all weather searches
- View, edit, and delete historical weather records
- Search and filter through saved records
- Comprehensive record details with timestamps

### 📤 Data Export
- Export weather data in multiple formats:
  - JSON
  - CSV
  - XML
  - Markdown
- Bulk export of filtered records

### 🎨 User Interface
- Responsive design that works on all devices
- Clean, modern interface with Tailwind CSS
- Intuitive tabbed navigation
- Loading states and error handling

## Getting Started

### Prerequisites
- Node.js 18+ installed
- OpenWeatherMap API key
- Database setup (the app expects weather history API endpoints)

### Installation

1. **Clone or download the project files**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```
   OPENWEATHERMAP_API_KEY=your_api_key_here
   DATABASE_URL=your_database_connection_string
   ```

4. **Set up the database**
   The application expects a weather history table with the following structure:
   - id (string, primary key)
   - location (string)
   - date_range_start (datetime)
   - date_range_end (datetime)
   - temperature (number)
   - description (string)
   - humidity (number)
   - wind_speed (number)
   - created_at (datetime)

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## API Endpoints

The application expects the following API endpoints to be implemented:

### `POST /api/weather`
Fetches current weather and forecast data
- **Body**: `{ location: string }`
- **Response**: `{ current: WeatherData, forecast: ForecastData }`

### `GET /api/weather-history`
Retrieves all weather history records
- **Response**: `WeatherRecord[]`

### `PUT /api/weather-history`
Updates a weather history record
- **Body**: `WeatherRecord`
- **Response**: `WeatherRecord`

### `DELETE /api/weather-history?id={id}`
Deletes a weather history record
- **Response**: Success/error status

## Usage

### Searching for Weather
1. Navigate to the "Current Weather" tab
2. Enter a location in one of these formats:
   - City name: "New York"
   - Zip code: "10001"
   - Coordinates: "40.7128,-74.0060"
3. Click "Search" or use "Use Current Location"

### Managing History
1. Switch to the "Weather History" tab
2. View all your previous weather searches
3. Use the search bar to filter records
4. Edit records using the edit button
5. Delete records using the trash button
6. Export data using the "Export Data" button

### Exporting Data
1. Click "Export Data" in the Weather History tab
2. Choose your preferred format (JSON, CSV, XML, or Markdown)
3. Click "Export" to download the file

## Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Weather API**: OpenWeatherMap
- **Database**: Compatible with any SQL database

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main weather app
│   ├── globals.css         # Global styles
│   └── api/                # API routes (to be implemented)
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── weather-search.tsx  # Weather search component
│   ├── weather-display.tsx # Weather display component
│   ├── weather-history.tsx # History management
│   ├── edit-weather-dialog.tsx # Edit dialog
│   ├── export-dialog.tsx   # Export functionality
│   └── info-dialog.tsx     # About dialog
└── README.md
```

## About PM Accelerator

This application was created as part of the Product Manager Accelerator Program technical assessment. The PM Accelerator Program supports PM professionals through every stage of their career, helping over 1,600 students land their dream jobs.

## Author

Created by **Bhumika Bhat** for the PM Accelerator Technical Assessment.
