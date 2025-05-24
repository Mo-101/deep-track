// Function to fetch wind data from OpenWeather API
export async function fetchWindData() {
  try {
    // In a real application, you would fetch actual data from OpenWeather API
    // For this example, we'll generate simulated wind data

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate simulated global wind data grid
    const gridSize = 36 // 10-degree grid
    const data = {
      grid: {
        width: gridSize,
        height: gridSize / 2,
        cellSize: 10, // degrees
      },
      timestamp: Date.now(),
      avgSpeed: (5 + Math.random() * 3).toFixed(1),
      maxSpeed: (15 + Math.random() * 10).toFixed(1),
      humidity: Math.floor(60 + Math.random() * 30),
      dataPoints: gridSize * (gridSize / 2),
      // Generate wind vectors (u, v components) for each grid cell
      vectors: generateWindVectors(gridSize, gridSize / 2),
    }

    return data
  } catch (error) {
    console.error("Error fetching wind data:", error)
    throw error
  }
}

// Generate simulated wind vectors
function generateWindVectors(width: number, height: number) {
  const vectors = []

  // Create some interesting wind patterns
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Convert grid position to lat/lon
      const lon = x * 10 - 180 + 5 // -180 to 180
      const lat = y * 10 - 90 + 5 // -90 to 90

      // Create some interesting wind patterns based on position
      // This simulates global circulation patterns

      // Base wind components
      let u = Math.sin((lat * Math.PI) / 180) * 5 // east-west component
      let v = Math.sin((lon * Math.PI) / 90) * 3 // north-south component

      // Add some randomness
      u += (Math.random() - 0.5) * 3
      v += (Math.random() - 0.5) * 3

      // Adjust for latitude (winds are stronger near the equator)
      const latFactor = 1 - Math.abs(lat) / 90
      u *= 0.5 + latFactor
      v *= 0.5 + latFactor

      // Add to vectors array
      vectors.push({
        lon,
        lat,
        u,
        v,
        speed: Math.sqrt(u * u + v * v),
        direction: (Math.atan2(v, u) * 180) / Math.PI,
      })
    }
  }

  return vectors
}
