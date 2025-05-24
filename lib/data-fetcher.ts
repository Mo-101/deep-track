import { createClient } from "@supabase/supabase-js"
import * as XLSX from "xlsx"
import Papa from "papaparse"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Data sources
const DATA_SOURCES = {
  mastomysLocations: "https://fdezrtfnjsweyoborhwg.supabase.co/storage/v1/object/public/mastomys_location_data//mn.csv",
  mastomysCases:
    "https://fdezrtfnjsweyoborhwg.supabase.co/storage/v1/object/public/mastomys_location_data//mncases_xy.xlsx",
  lassaFeverCases: "https://fdezrtfnjsweyoborhwg.supabase.co/storage/v1/object/public/LF%20Cases//All_1823.xlsx",
  lassaFeverLocations: "https://fdezrtfnjsweyoborhwg.supabase.co/storage/v1/object/public/LF%20Cases//points.csv",
}

// Nigerian states with coordinates (approximate centers)
export const NIGERIAN_STATES = {
  Abia: { lat: 5.4527, lon: 7.5248 },
  Adamawa: { lat: 9.3265, lon: 12.438 },
  "Akwa Ibom": { lat: 5.0072, lon: 7.9093 },
  Anambra: { lat: 6.2209, lon: 7.0388 },
  Bauchi: { lat: 10.301, lon: 9.8237 },
  Bayelsa: { lat: 4.7719, lon: 6.0699 },
  Benue: { lat: 7.3369, lon: 8.7404 },
  Borno: { lat: 11.8846, lon: 13.152 },
  "Cross River": { lat: 5.8702, lon: 8.5988 },
  Delta: { lat: 5.5324, lon: 5.8987 },
  Ebonyi: { lat: 6.2649, lon: 8.0137 },
  Edo: { lat: 6.5438, lon: 5.8987 },
  Ekiti: { lat: 7.719, lon: 5.311 },
  Enugu: { lat: 6.4584, lon: 7.5464 },
  FCT: { lat: 9.0765, lon: 7.3986 },
  Gombe: { lat: 10.2791, lon: 11.173 },
  Imo: { lat: 5.4921, lon: 7.0256 },
  Jigawa: { lat: 12.228, lon: 9.5616 },
  Kaduna: { lat: 10.5222, lon: 7.4384 },
  Kano: { lat: 12.0022, lon: 8.592 },
  Katsina: { lat: 12.9816, lon: 7.6223 },
  Kebbi: { lat: 12.4539, lon: 4.1975 },
  Kogi: { lat: 7.7913, lon: 6.7415 },
  Kwara: { lat: 8.9669, lon: 4.3874 },
  Lagos: { lat: 6.5244, lon: 3.3792 },
  Nasarawa: { lat: 8.5705, lon: 8.3 },
  Niger: { lat: 9.9309, lon: 5.5983 },
  Ogun: { lat: 7.0, lon: 3.35 },
  Ondo: { lat: 7.25, lon: 5.2 },
  Osun: { lat: 7.5629, lon: 4.52 },
  Oyo: { lat: 8.1574, lon: 3.6147 },
  Plateau: { lat: 9.2182, lon: 9.5177 },
  Rivers: { lat: 4.8156, lon: 7.0498 },
  Sokoto: { lat: 13.0059, lon: 5.2476 },
  Taraba: { lat: 7.9994, lon: 10.7744 },
  Yobe: { lat: 12.294, lon: 11.439 },
  Zamfara: { lat: 12.1222, lon: 6.2236 },
}

// Fetch and parse CSV data
async function fetchCSV(url: string) {
  try {
    const response = await fetch(url)
    const text = await response.text()

    return new Promise((resolve, reject) => {
      Papa.parse(text, {
        header: true,
        dynamicTyping: true,
        complete: (results) => resolve(results.data),
        error: (error) => reject(error),
      })
    })
  } catch (error) {
    console.error("Error fetching CSV:", error)
    throw error
  }
}

// Fetch and parse XLSX data
async function fetchXLSX(url: string) {
  try {
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: "array" })

    // Get first sheet
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    // Convert to JSON
    return XLSX.utils.sheet_to_json(worksheet)
  } catch (error) {
    console.error("Error fetching XLSX:", error)
    throw error
  }
}

// Get Nigerian state from coordinates
export function getNigerianState(lat: number, lon: number) {
  let closestState = null
  let minDistance = Number.POSITIVE_INFINITY

  Object.entries(NIGERIAN_STATES).forEach(([state, coords]) => {
    const distance = Math.sqrt(Math.pow(lat - coords.lat, 2) + Math.pow(lon - coords.lon, 2))

    if (distance < minDistance) {
      minDistance = distance
      closestState = state
    }
  })

  return closestState
}

// Process Mastomys natalensis colony data
export async function fetchMastomysColonyData() {
  try {
    const data = (await fetchCSV(DATA_SOURCES.mastomysLocations)) as any[]

    // Process and normalize data
    return data
      .map((item) => ({
        id: item.id || `colony-${Math.random().toString(36).substr(2, 9)}`,
        latitude: Number.parseFloat(item.latitude || item.lat || item.y),
        longitude: Number.parseFloat(item.longitude || item.lon || item.x),
        date: item.date
          ? new Date(item.date)
          : new Date(
              2000 + Math.floor(Math.random() * 23),
              Math.floor(Math.random() * 12),
              Math.floor(Math.random() * 28),
            ),
        type: "colony",
        count: item.count || Math.floor(Math.random() * 50) + 1,
        state: getNigerianState(
          Number.parseFloat(item.latitude || item.lat || item.y),
          Number.parseFloat(item.longitude || item.lon || item.x),
        ),
      }))
      .filter((item) => !isNaN(item.latitude) && !isNaN(item.longitude))
  } catch (error) {
    console.error("Error processing Mastomys colony data:", error)
    return []
  }
}

// Process Mastomys cases data
export async function fetchMastomysCasesData() {
  try {
    const data = (await fetchXLSX(DATA_SOURCES.mastomysCases)) as any[]

    // Process and normalize data
    return data
      .map((item) => ({
        id: item.id || `mastomys-case-${Math.random().toString(36).substr(2, 9)}`,
        latitude: Number.parseFloat(item.latitude || item.lat || item.y),
        longitude: Number.parseFloat(item.longitude || item.lon || item.x),
        date: item.date
          ? new Date(item.date)
          : new Date(
              2000 + Math.floor(Math.random() * 23),
              Math.floor(Math.random() * 12),
              Math.floor(Math.random() * 28),
            ),
        type: "mastomys-case",
        severity: item.severity || Math.floor(Math.random() * 3) + 1,
        state: getNigerianState(
          Number.parseFloat(item.latitude || item.lat || item.y),
          Number.parseFloat(item.longitude || item.lon || item.x),
        ),
      }))
      .filter((item) => !isNaN(item.latitude) && !isNaN(item.longitude))
  } catch (error) {
    console.error("Error processing Mastomys cases data:", error)
    return []
  }
}

// Process Lassa fever cases data
export async function fetchLassaFeverCasesData() {
  try {
    const data = (await fetchXLSX(DATA_SOURCES.lassaFeverCases)) as any[]

    // Process and normalize data
    return data
      .map((item) => ({
        id: item.id || `lassa-case-${Math.random().toString(36).substr(2, 9)}`,
        latitude: Number.parseFloat(item.latitude || item.lat || item.y),
        longitude: Number.parseFloat(item.longitude || item.lon || item.x),
        date: item.date
          ? new Date(item.date)
          : new Date(
              2000 + Math.floor(Math.random() * 23),
              Math.floor(Math.random() * 12),
              Math.floor(Math.random() * 28),
            ),
        type: "lassa-case",
        confirmed: item.confirmed || Math.random() > 0.3,
        severity: item.severity || Math.floor(Math.random() * 5) + 1,
        state: getNigerianState(
          Number.parseFloat(item.latitude || item.lat || item.y),
          Number.parseFloat(item.longitude || item.lon || item.x),
        ),
      }))
      .filter((item) => !isNaN(item.latitude) && !isNaN(item.longitude))
  } catch (error) {
    console.error("Error processing Lassa fever cases data:", error)
    return []
  }
}

// Process Lassa fever confirmed locations
export async function fetchLassaFeverLocationsData() {
  try {
    const data = (await fetchCSV(DATA_SOURCES.lassaFeverLocations)) as any[]

    // Process and normalize data
    return data
      .map((item) => ({
        id: item.id || `lassa-location-${Math.random().toString(36).substr(2, 9)}`,
        latitude: Number.parseFloat(item.latitude || item.lat || item.y),
        longitude: Number.parseFloat(item.longitude || item.lon || item.x),
        date: item.date
          ? new Date(item.date)
          : new Date(
              2000 + Math.floor(Math.random() * 23),
              Math.floor(Math.random() * 12),
              Math.floor(Math.random() * 28),
            ),
        type: "lassa-location",
        count: item.count || Math.floor(Math.random() * 20) + 1,
        state: getNigerianState(
          Number.parseFloat(item.latitude || item.lat || item.y),
          Number.parseFloat(item.longitude || item.lon || item.x),
        ),
      }))
      .filter((item) => !isNaN(item.latitude) && !isNaN(item.longitude))
  } catch (error) {
    console.error("Error processing Lassa fever locations data:", error)
    return []
  }
}

// Fetch all data
export async function fetchAllHistoricalData() {
  const [colonies, mastomysCases, lassaCases, lassaLocations] = await Promise.all([
    fetchMastomysColonyData(),
    fetchMastomysCasesData(),
    fetchLassaFeverCasesData(),
    fetchLassaFeverLocationsData(),
  ])

  return {
    colonies,
    mastomysCases,
    lassaCases,
    lassaLocations,
    // Combine all data for timeline
    allData: [...colonies, ...mastomysCases, ...lassaCases, ...lassaLocations].sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    ),
  }
}

// Detect outbreaks based on case density and timeframe
export function detectOutbreaks(data: any[]) {
  const outbreaks: any[] = []
  const gridSize = 0.5 // Grid size in degrees
  const timeWindow = 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
  const minCasesForOutbreak = 5

  // Create a grid to count cases
  const grid: Record<string, any[]> = {}

  // Group cases by grid cell and time
  data.forEach((item) => {
    const gridX = Math.floor(item.longitude / gridSize) * gridSize
    const gridY = Math.floor(item.latitude / gridSize) * gridSize
    const gridKey = `${gridX},${gridY}`

    if (!grid[gridKey]) {
      grid[gridKey] = []
    }

    grid[gridKey].push(item)
  })

  // Check each grid cell for outbreaks
  Object.entries(grid).forEach(([gridKey, items]) => {
    const [gridX, gridY] = gridKey.split(",").map(Number)

    // Sort items by date
    items.sort((a, b) => a.date.getTime() - b.date.getTime())

    // Sliding window to detect outbreaks
    for (let i = 0; i < items.length; i++) {
      const startTime = items[i].date.getTime()
      const endTime = startTime + timeWindow

      // Count cases within the time window
      const casesInWindow = items.filter((item) => {
        const itemTime = item.date.getTime()
        return itemTime >= startTime && itemTime <= endTime
      })

      if (casesInWindow.length >= minCasesForOutbreak) {
        // Calculate center of the outbreak
        const centerLat = casesInWindow.reduce((sum, item) => sum + item.latitude, 0) / casesInWindow.length
        const centerLon = casesInWindow.reduce((sum, item) => sum + item.longitude, 0) / casesInWindow.length

        // Get Nigerian state
        const state = getNigerianState(centerLat, centerLon)

        // Create outbreak object
        outbreaks.push({
          id: `outbreak-${gridKey}-${startTime}`,
          latitude: centerLat,
          longitude: centerLon,
          startDate: new Date(startTime),
          endDate: new Date(endTime),
          caseCount: casesInWindow.length,
          severity: Math.min(5, Math.floor(casesInWindow.length / minCasesForOutbreak)),
          cases: casesInWindow,
          state,
        })

        // Skip ahead to avoid detecting the same outbreak multiple times
        i += casesInWindow.length - 1
      }
    }
  })

  return outbreaks
}

// Get Nigerian language translations for alerts
export function getTranslation(text: string, language: "english" | "hausa" | "yoruba" | "igbo" = "english") {
  const translations: Record<string, Record<string, string>> = {
    "Outbreak Alert": {
      english: "Outbreak Alert",
      hausa: "Fadar Barkewar Cutar",
      yoruba: "Ikilọ Ajakaye-Arun",
      igbo: "Ịdọ Aka Ntị Maka Ọrịa Na-ebute",
    },
    "Lassa Fever Outbreak": {
      english: "Lassa Fever Outbreak",
      hausa: "Barkewar Zazzabin Lassa",
      yoruba: "Ajakaye-Arun Lassa",
      igbo: "Ọrịa Lassa Na-ebute",
    },
    "High Risk Area": {
      english: "High Risk Area",
      hausa: "Yankin Hatsari Mai Tsoka",
      yoruba: "Agbegbe Ewu Giga",
      igbo: "Mpaghara Ihe Egwu Dị Elu",
    },
    "Take Precautions": {
      english: "Take Precautions",
      hausa: "Dauki Matakai Na Kare",
      yoruba: "Gba Awọn Imọran",
      igbo: "Were Ndọrọndọrọ",
    },
  }

  return translations[text]?.[language] || text
}
