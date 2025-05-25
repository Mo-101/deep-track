// Improved error handling and fallback mechanism
export const getCesiumKey = async (): Promise<string> => {
  try {
    // Add cache busting parameter to avoid potential caching issues
    const response = await fetch("/api/cesium-key?t=" + Date.now(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      // Get more detailed error information
      const errorText = await response.text()
      console.error(`Cesium key API returned status ${response.status}: ${errorText}`)
      throw new Error(`API returned status ${response.status}`)
    }

    const data = await response.json()

    if (!data.key) {
      console.error("API response missing key property:", data)
      throw new Error("API response missing key property")
    }

    return data.key
  } catch (error) {
    console.error("Error fetching Cesium key:", error)
    // Provide a more specific error message
    throw new Error(`Failed to fetch Cesium key: ${error instanceof Error ? error.message : String(error)}`)
  }
}
