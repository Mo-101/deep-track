import { NextResponse } from "next/server"

export async function GET() {
  // Access the Cesium key from server-side environment variables
  const cesiumKey = process.env.CESIUM_KEY

  if (!cesiumKey) {
    return NextResponse.json({ error: "Cesium key not configured" }, { status: 500 })
  }

  return NextResponse.json({ key: cesiumKey })
}
