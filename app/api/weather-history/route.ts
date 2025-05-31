import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

// GET - Read weather records
export async function GET() {
  try {
    const { data, error } = await supabase.from("weather_records").select("*").order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching weather records:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT - Update weather record
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, location, date_range_start, date_range_end, temperature, description, humidity, wind_speed } = body

    // Validate required fields
    if (!id || !location || !date_range_start || !date_range_end || temperature === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate date range
    const startDate = new Date(date_range_start)
    const endDate = new Date(date_range_end)

    if (startDate >= endDate) {
      return NextResponse.json({ error: "End date must be after start date" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("weather_records")
      .update({
        location,
        date_range_start: startDate.toISOString(),
        date_range_end: endDate.toISOString(),
        temperature: Number(temperature),
        description,
        humidity: Number(humidity),
        wind_speed: Number(wind_speed),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error updating weather record:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete weather record
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Record ID is required" }, { status: 400 })
    }

    const { error } = await supabase.from("weather_records").delete().eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting weather record:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
