import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Access the Cesium key from server-side environment variables
    const cesiumKey = process.env.CESIUM_KEY

    // Log for debugging (will appear in server logs)
    console.log("Cesium key request received, key exists:", !!cesiumKey)

    if (!cesiumKey) {
      console.error("CESIUM_KEY environment variable is not set")
      return NextResponse.json({ error: "Cesium key not configured on server" }, { status: 500 })
    }

    // Return the key with appropriate cache headers
    return NextResponse.json(
      { key: cesiumKey },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    )
  } catch (error) {
    console.error("Error in Cesium key API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
