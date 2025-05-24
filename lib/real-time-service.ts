import { create } from "zustand"
import { createClient } from "@supabase/supabase-js"
import { persist } from "zustand/middleware"

// Define types
export interface RodentSighting {
  id: string
  colony_id?: string
  location: {
    latitude: number
    longitude: number
  }
  timestamp: string
  population?: number
  notes?: string
  state?: string
}

export interface LassaCase {
  id: string
  location: {
    latitude: number
    longitude: number
  }
  date: string
  severity: number
  confirmed: boolean
  state?: string
  notes?: string
}

export interface WeatherUpdate {
  location: string
  temperature: number
  humidity: number
  rainfall: number
  wind_speed: number
  timestamp: string
}

export interface Alert {
  id: string
  type: "info" | "warning" | "critical"
  message: string
  timestamp: string
  location?: string
  acknowledged: boolean
}

export interface Colony {
  id: string
  colony_id: string
  latitude: number
  longitude: number
  date: string
  population_count: number
  state?: string
  notes?: string
  risk?: "low" | "moderate" | "high"
  lastActive?: string
}

export interface MovementPath {
  id: string
  from_colony_id: string
  to_colony_id: string
  intensity: number
  active: boolean
  date: string
}

export interface Outbreak {
  id: string
  latitude: number
  longitude: number
  start_date: string
  end_date: string
  case_count: number
  severity: number
  state?: string
  status: string
  notes?: string
  colony_id?: string
  probability?: number
  affected_area?: number
  estimated_cases?: number
}

// Define store
interface RealTimeState {
  isConnected: boolean
  isLoading: boolean
  isOfflineMode: boolean
  lastUpdated: string
  lastConnectionAttempt: string
  rodentSightings: RodentSighting[]
  lassaCases: LassaCase[]
  weatherUpdates: WeatherUpdate[]
  alerts: Alert[]
  colonies: Colony[]
  paths: MovementPath[]
  outbreaks: Outbreak[]
  addRodentSighting: (sighting: RodentSighting) => void
  addLassaCase: (lassaCase: LassaCase) => void
  addWeatherUpdate: (weather: WeatherUpdate) => void
  addAlert: (alert: Alert) => void
  setColonies: (colonies: Colony[]) => void
  addColony: (colony: Colony) => void
  setPaths: (paths: MovementPath[]) => void
  addPath: (path: MovementPath) => void
  setOutbreaks: (outbreaks: Outbreak[]) => void
  addOutbreak: (outbreak: Outbreak) => void
  acknowledgeAlert: (alertId: string) => void
  setConnected: (connected: boolean) => void
  setLoading: (loading: boolean) => void
  setOfflineMode: (offline: boolean) => void
  setLastConnectionAttempt: (timestamp: string) => void
}

// Create store with persistence
export const useRealTimeStore = create<RealTimeState>()(
  persist(
    (set) => ({
      isConnected: false,
      isLoading: true,
      isOfflineMode: false,
      lastUpdated: new Date().toISOString(),
      lastConnectionAttempt: new Date().toISOString(),
      rodentSightings: [],
      lassaCases: [],
      weatherUpdates: [],
      alerts: [],
      colonies: [],
      paths: [],
      outbreaks: [],
      addRodentSighting: (sighting) =>
        set((state) => ({
          rodentSightings: [sighting, ...state.rodentSightings],
          lastUpdated: new Date().toISOString(),
        })),
      addLassaCase: (lassaCase) =>
        set((state) => ({
          lassaCases: [lassaCase, ...state.lassaCases],
          lastUpdated: new Date().toISOString(),
        })),
      addWeatherUpdate: (weather) =>
        set((state) => ({
          weatherUpdates: [weather, ...state.weatherUpdates],
          lastUpdated: new Date().toISOString(),
        })),
      addAlert: (alert) =>
        set((state) => ({
          alerts: [alert, ...state.alerts],
          lastUpdated: new Date().toISOString(),
        })),
      setColonies: (colonies) =>
        set(() => ({
          colonies,
          lastUpdated: new Date().toISOString(),
        })),
      addColony: (colony) =>
        set((state) => ({
          colonies: [colony, ...state.colonies],
          lastUpdated: new Date().toISOString(),
        })),
      setPaths: (paths) =>
        set(() => ({
          paths,
          lastUpdated: new Date().toISOString(),
        })),
      addPath: (path) =>
        set((state) => ({
          paths: [path, ...state.paths],
          lastUpdated: new Date().toISOString(),
        })),
      setOutbreaks: (outbreaks) =>
        set(() => ({
          outbreaks,
          lastUpdated: new Date().toISOString(),
        })),
      addOutbreak: (outbreak) =>
        set((state) => ({
          outbreaks: [outbreak, ...state.outbreaks],
          lastUpdated: new Date().toISOString(),
        })),
      acknowledgeAlert: (alertId) =>
        set((state) => ({
          alerts: state.alerts.map((alert) => (alert.id === alertId ? { ...alert, acknowledged: true } : alert)),
        })),
      setConnected: (connected) =>
        set(() => ({
          isConnected: connected,
        })),
      setLoading: (loading) =>
        set(() => ({
          isLoading: loading,
        })),
      setOfflineMode: (offline) =>
        set(() => ({
          isOfflineMode: offline,
        })),
      setLastConnectionAttempt: (timestamp) =>
        set(() => ({
          lastConnectionAttempt: timestamp,
        })),
    }),
    {
      name: "deeptrack-real-time-storage",
      partialize: (state) => ({
        rodentSightings: state.rodentSightings,
        lassaCases: state.lassaCases,
        weatherUpdates: state.weatherUpdates,
        alerts: state.alerts,
        colonies: state.colonies,
        paths: state.paths,
        outbreaks: state.outbreaks,
        isOfflineMode: state.isOfflineMode,
      }),
    },
  ),
)

// Initialize Supabase client (singleton pattern)
let supabase: any = null

const getSupabase = () => {
  if (!supabase) {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

      if (!supabaseUrl || !supabaseAnonKey) {
        console.warn("Supabase credentials missing, using mock data")
        return null
      }

      supabase = createClient(supabaseUrl, supabaseAnonKey)
    } catch (error) {
      console.error("Failed to initialize Supabase client:", error)
      return null
    }
  }
  return supabase
}

// Nigerian states for realistic data
const nigerianStates = [
  "Lagos",
  "Kano",
  "Kaduna",
  "Rivers",
  "Bauchi",
  "Borno",
  "Delta",
  "Plateau",
  "Oyo",
  "Edo",
  "Enugu",
  "Sokoto",
  "Ondo",
  "Anambra",
  "Katsina",
]

// Nigerian cities for more realistic data
const nigerianCities = {
  Lagos: ["Ikeja", "Lekki", "Surulere", "Apapa", "Yaba"],
  Kano: ["Kano City", "Dala", "Nassarawa", "Fagge", "Gwale"],
  Kaduna: ["Kaduna", "Zaria", "Kafanchan", "Birnin Gwari", "Sabon Gari"],
  Rivers: ["Port Harcourt", "Bonny", "Eleme", "Okrika", "Oyigbo"],
  Bauchi: ["Bauchi", "Azare", "Misau", "Jama'are", "Dass"],
  Borno: ["Maiduguri", "Bama", "Gwoza", "Konduga", "Monguno"],
  Delta: ["Warri", "Asaba", "Sapele", "Ughelli", "Agbor"],
  Plateau: ["Jos", "Bukuru", "Pankshin", "Shendam", "Langtang"],
  Oyo: ["Ibadan", "Ogbomosho", "Oyo", "Iseyin", "Saki"],
  Edo: ["Benin City", "Auchi", "Ekpoma", "Uromi", "Igarra"],
  Enugu: ["Enugu", "Nsukka", "Oji River", "Awgu", "Udi"],
  Sokoto: ["Sokoto", "Tambuwal", "Illela", "Wurno", "Rabah"],
  Ondo: ["Akure", "Ondo", "Owo", "Ikare", "Okitipupa"],
  Anambra: ["Awka", "Onitsha", "Nnewi", "Ekwulobia", "Aguata"],
  Katsina: ["Katsina", "Daura", "Funtua", "Malumfashi", "Jibia"],
}

// Lassa fever risk by state (based on historical data)
const stateRiskLevels = {
  Edo: "high",
  Ondo: "high",
  Bauchi: "high",
  Plateau: "high",
  Ebonyi: "high",
  Taraba: "moderate",
  Kogi: "moderate",
  Kaduna: "moderate",
  Enugu: "moderate",
  Delta: "moderate",
  Lagos: "low",
  Kano: "low",
  Rivers: "low",
  Anambra: "low",
  Oyo: "low",
}

// Generate random coordinates within Nigeria with clustering
const getRandomCoordinates = (state?: string, clustered = true) => {
  // Nigeria's approximate bounds
  const bounds = {
    north: 13.8,
    south: 4.2,
    west: 2.7,
    east: 14.6,
  }

  // State-specific coordinates (approximate centers)
  const stateCenters: Record<string, { lat: number; lng: number }> = {
    Lagos: { lat: 6.5, lng: 3.4 },
    Kano: { lat: 12.0, lng: 8.5 },
    Kaduna: { lat: 10.5, lng: 7.4 },
    Rivers: { lat: 4.8, lng: 7.0 },
    Bauchi: { lat: 10.3, lng: 9.8 },
    Borno: { lat: 11.8, lng: 13.2 },
    Delta: { lat: 5.5, lng: 6.0 },
    Plateau: { lat: 9.9, lng: 8.9 },
    Oyo: { lat: 7.4, lng: 3.9 },
    Edo: { lat: 6.3, lng: 5.6 },
    Enugu: { lat: 6.5, lng: 7.5 },
    Sokoto: { lat: 13.1, lng: 5.2 },
    Ondo: { lat: 7.1, lng: 5.0 },
    Anambra: { lat: 6.2, lng: 7.0 },
    Katsina: { lat: 12.9, lng: 7.6 },
  }

  if (state && clustered && stateCenters[state]) {
    // Generate coordinates clustered around the state center
    const center = stateCenters[state]
    const radius = 0.5 // Approximately 50km
    const angle = Math.random() * 2 * Math.PI
    const distance = Math.random() * radius

    return {
      latitude: center.lat + distance * Math.cos(angle),
      longitude: center.lng + distance * Math.sin(angle),
    }
  }

  // Random coordinates within Nigeria
  return {
    latitude: bounds.south + Math.random() * (bounds.north - bounds.south),
    longitude: bounds.west + Math.random() * (bounds.east - bounds.west),
  }
}

// Generate random date in the last 30 days with time distribution
const getRandomDate = (daysBack = 30, recentBias = true) => {
  const date = new Date()

  if (recentBias) {
    // Exponential distribution to bias towards recent dates
    const randomFactor = Math.pow(Math.random(), 2) // Square to bias towards 0
    date.setDate(date.getDate() - Math.floor(randomFactor * daysBack))
  } else {
    // Uniform distribution
    date.setDate(date.getDate() - Math.floor(Math.random() * daysBack))
  }

  return date.toISOString()
}

// Generate realistic mock data
const generateMockData = (
  count = {
    rodentSightings: 15,
    lassaCases: 8,
    colonies: 5,
    paths: 7,
    outbreaks: 3,
    weatherUpdates: 10,
  },
) => {
  // Create colonies first so we can reference them
  const mockColonies: Colony[] = Array.from({ length: count.colonies }, (_, i) => {
    const state = nigerianStates[Math.floor(Math.random() * nigerianStates.length)]
    const coords = getRandomCoordinates(state)
    const risk = (stateRiskLevels as any)[state] || ["low", "moderate", "high"][Math.floor(Math.random() * 3)]

    return {
      id: `mock-colony-${i}`,
      colony_id: `colony-${i}`,
      latitude: coords.latitude,
      longitude: coords.longitude,
      date: getRandomDate(90, false), // Colonies can be older
      population_count: Math.floor(Math.random() * 500) + 50,
      state: state,
      risk: risk as "low" | "moderate" | "high",
      lastActive: getRandomDate(14, true), // Recent activity
      notes: `Rodent colony in ${state}, near ${
        (nigerianCities as any)[state]?.[Math.floor(Math.random() * (nigerianCities as any)[state]?.length)] ||
        "unknown location"
      }`,
    }
  })

  // Mock rodent sightings
  const mockRodentSightings: RodentSighting[] = Array.from({ length: count.rodentSightings }, (_, i) => {
    // 70% chance to be associated with a colony
    const useColony = Math.random() < 0.7 && mockColonies.length > 0
    let state, coords, colonyId

    if (useColony) {
      const colony = mockColonies[Math.floor(Math.random() * mockColonies.length)]
      state = colony.state
      // Generate coordinates near the colony
      const angle = Math.random() * 2 * Math.PI
      const distance = Math.random() * 0.1 // ~10km
      coords = {
        latitude: colony.latitude + distance * Math.cos(angle),
        longitude: colony.longitude + distance * Math.sin(angle),
      }
      colonyId = colony.colony_id
    } else {
      state = nigerianStates[Math.floor(Math.random() * nigerianStates.length)]
      coords = getRandomCoordinates(state)
      colonyId = undefined
    }

    return {
      id: `mock-rodent-${i}`,
      colony_id: colonyId,
      location: coords,
      timestamp: getRandomDate(30, true),
      population: Math.floor(Math.random() * 100) + 10,
      state: state,
      notes: `Rodent sighting in ${state}${colonyId ? `, associated with colony ${colonyId}` : ""}`,
    }
  })

  // Mock Lassa cases - more likely in high-risk states
  const mockLassaCases: LassaCase[] = Array.from({ length: count.lassaCases }, (_, i) => {
    // Bias towards high-risk states
    let state
    if (Math.random() < 0.7) {
      // 70% chance to be in a high-risk state
      const highRiskStates = Object.entries(stateRiskLevels)
        .filter(([_, risk]) => risk === "high")
        .map(([state, _]) => state)
      state = highRiskStates[Math.floor(Math.random() * highRiskStates.length)]
    } else {
      state = nigerianStates[Math.floor(Math.random() * nigerianStates.length)]
    }

    const coords = getRandomCoordinates(state)
    const severity = Math.floor(Math.random() * 5) + 1

    return {
      id: `mock-lassa-${i}`,
      location: coords,
      date: getRandomDate(45, true),
      severity: severity,
      confirmed: Math.random() > 0.2, // 80% confirmed
      state: state,
      notes: `${severity >= 4 ? "Severe" : "Moderate"} Lassa case in ${state}, ${
        (nigerianCities as any)[state]?.[Math.floor(Math.random() * (nigerianCities as any)[state]?.length)] ||
        "unknown location"
      }`,
    }
  })

  // Mock paths between colonies
  const mockPaths: MovementPath[] = Array.from({ length: count.paths }, (_, i) => {
    if (mockColonies.length < 2) {
      // Need at least 2 colonies to create paths
      return {
        id: `mock-path-${i}`,
        from_colony_id: `colony-0`,
        to_colony_id: `colony-0`,
        intensity: 0,
        active: false,
        date: getRandomDate(),
      }
    }

    // Select two different colonies
    const fromIndex = Math.floor(Math.random() * mockColonies.length)
    let toIndex
    do {
      toIndex = Math.floor(Math.random() * mockColonies.length)
    } while (toIndex === fromIndex)

    return {
      id: `mock-path-${i}`,
      from_colony_id: mockColonies[fromIndex].colony_id,
      to_colony_id: mockColonies[toIndex].colony_id,
      intensity: Math.floor(Math.random() * 100),
      active: Math.random() > 0.3, // 70% active
      date: getRandomDate(60, false),
    }
  })

  // Mock outbreaks - more likely in high-risk states and near colonies
  const mockOutbreaks: Outbreak[] = Array.from({ length: count.outbreaks }, (_, i) => {
    // 80% chance to be in a high-risk state
    let state
    if (Math.random() < 0.8) {
      const highRiskStates = Object.entries(stateRiskLevels)
        .filter(([_, risk]) => risk === "high")
        .map(([state, _]) => state)
      state = highRiskStates[Math.floor(Math.random() * highRiskStates.length)]
    } else {
      state = nigerianStates[Math.floor(Math.random() * nigerianStates.length)]
    }

    // 60% chance to be near a colony
    let coords, colonyId
    if (Math.random() < 0.6 && mockColonies.length > 0) {
      const stateColonies = mockColonies.filter((c) => c.state === state)
      if (stateColonies.length > 0) {
        const colony = stateColonies[Math.floor(Math.random() * stateColonies.length)]
        // Generate coordinates near the colony
        const angle = Math.random() * 2 * Math.PI
        const distance = Math.random() * 0.2 // ~20km
        coords = {
          latitude: colony.latitude + distance * Math.cos(angle),
          longitude: colony.longitude + distance * Math.sin(angle),
        }
        colonyId = colony.colony_id
      } else {
        coords = getRandomCoordinates(state)
        colonyId = undefined
      }
    } else {
      coords = getRandomCoordinates(state)
      colonyId = undefined
    }

    const startDate = getRandomDate(90, false)
    const endDate = Math.random() > 0.3 ? new Date().toISOString() : getRandomDate(30, true)
    const status = ["active", "contained", "resolved"][Math.floor(Math.random() * 3)]
    const severity = Math.floor(Math.random() * 5) + 1
    const caseCount = Math.floor(Math.random() * 50) + 5

    return {
      id: `mock-outbreak-${i}`,
      latitude: coords.latitude,
      longitude: coords.longitude,
      start_date: startDate,
      end_date: endDate,
      case_count: caseCount,
      severity: severity,
      state: state,
      status: status,
      colony_id: colonyId,
      probability: Math.random(),
      affected_area: Math.floor(Math.random() * 100) + 10,
      estimated_cases: caseCount + Math.floor(Math.random() * 50),
      notes: `${severity >= 4 ? "Severe" : "Moderate"} outbreak in ${state}, ${status} status`,
    }
  })

  // Mock weather updates with realistic patterns
  const mockWeatherUpdates: WeatherUpdate[] = Array.from({ length: count.weatherUpdates }, (_, i) => {
    const state = nigerianStates[Math.floor(Math.random() * nigerianStates.length)]
    const city =
      (nigerianCities as any)[state]?.[Math.floor(Math.random() * (nigerianCities as any)[state]?.length)] || state
    const timestamp = getRandomDate(7, true) // Weather data is recent

    // Nigeria's climate varies by region and season
    const date = new Date(timestamp)
    const month = date.getMonth()
    const isRainySeason = month >= 3 && month <= 9 // April to October

    // Temperature varies by region (north is hotter and drier)
    const isNorthern = ["Kano", "Kaduna", "Bauchi", "Borno", "Sokoto", "Katsina"].includes(state)

    let temperature, humidity, rainfall, windSpeed

    if (isNorthern) {
      temperature = isRainySeason ? 25 + Math.random() * 10 : 30 + Math.random() * 10
      humidity = isRainySeason ? 50 + Math.random() * 30 : 20 + Math.random() * 30
      rainfall = isRainySeason ? Math.random() * 30 : Math.random() * 5
    } else {
      temperature = isRainySeason ? 22 + Math.random() * 8 : 25 + Math.random() * 8
      humidity = isRainySeason ? 70 + Math.random() * 20 : 50 + Math.random() * 30
      rainfall = isRainySeason ? Math.random() * 50 : Math.random() * 15
    }

    windSpeed = 2 + Math.random() * 15

    return {
      location: `${city}, ${state}`,
      temperature: temperature,
      humidity: humidity,
      rainfall: rainfall,
      wind_speed: windSpeed,
      timestamp: timestamp,
    }
  })

  return {
    rodentSightings: mockRodentSightings,
    lassaCases: mockLassaCases,
    colonies: mockColonies,
    paths: mockPaths,
    outbreaks: mockOutbreaks,
    weatherUpdates: mockWeatherUpdates,
  }
}

// Load mock data into the store
async function loadMockData() {
  const store = useRealTimeStore.getState()
  const mockData = generateMockData()

  // Add mock data to store
  store.setColonies(mockData.colonies)
  mockData.rodentSightings.forEach((sighting) => store.addRodentSighting(sighting))
  mockData.lassaCases.forEach((lassaCase) => store.addLassaCase(lassaCase))
  store.setPaths(mockData.paths)
  store.setOutbreaks(mockData.outbreaks)
  mockData.weatherUpdates.forEach((update) => store.addWeatherUpdate(update))

  // Add some mock alerts
  store.addAlert({
    id: `mock-alert-1`,
    type: "warning",
    message: "Increased rodent activity detected in Lagos",
    timestamp: new Date().toISOString(),
    location: "Lagos",
    acknowledged: false,
  })

  store.addAlert({
    id: `mock-alert-2`,
    type: "critical",
    message: "Lassa fever outbreak reported in Plateau State",
    timestamp: new Date().toISOString(),
    location: "Plateau",
    acknowledged: false,
  })

  console.log("Mock data loaded successfully")
}

// Reconnection interval in milliseconds
const RECONNECTION_INTERVAL = 60000 // 1 minute

// Initialize real-time service
export async function initializeRealTimeService(): Promise<() => void> {
  const store = useRealTimeStore.getState()
  store.setLoading(true)
  store.setLastConnectionAttempt(new Date().toISOString())

  // Check if user has manually enabled offline mode
  if (store.isOfflineMode) {
    console.log("User has enabled offline mode, using mock data")
    await loadMockData()
    store.setConnected(false)
    store.setLoading(false)

    // Set up mock real-time updates
    const mockUpdateInterval = setInterval(() => {
      const mockData = generateMockData({
        rodentSightings: 1,
        lassaCases: 1,
        colonies: 0,
        paths: 0,
        outbreaks: 0,
        weatherUpdates: 1,
      })

      // Only add new data occasionally to simulate real-time updates
      if (Math.random() > 0.5) {
        store.addRodentSighting(mockData.rodentSightings[0])
      }

      if (Math.random() > 0.8) {
        store.addLassaCase(mockData.lassaCases[0])
      }

      if (Math.random() > 0.7) {
        store.addWeatherUpdate(mockData.weatherUpdates[0])
      }
    }, 30000) // Add new data every 30 seconds

    return () => {
      clearInterval(mockUpdateInterval)
    }
  }

  try {
    const supabase = getSupabase()

    if (!supabase) {
      console.warn("Using offline mode with mock data (Supabase client not available)")
      await loadMockData()
      store.setConnected(false)
      store.setLoading(false)

      // Set up reconnection attempts
      const reconnectionInterval = setInterval(async () => {
        console.log("Attempting to reconnect to Supabase...")
        store.setLastConnectionAttempt(new Date().toISOString())

        // Try to initialize Supabase again
        const newSupabase = getSupabase()
        if (newSupabase) {
          console.log("Reconnection successful, reinitializing real-time service")
          clearInterval(reconnectionInterval)

          // Reinitialize with the new connection
          const cleanup = await initializeRealTimeService()
          return cleanup
        }
      }, RECONNECTION_INTERVAL)

      // Set up mock real-time updates
      const mockUpdateInterval = setInterval(() => {
        const mockData = generateMockData({
          rodentSightings: 1,
          lassaCases: 1,
          colonies: 0,
          paths: 0,
          outbreaks: 0,
          weatherUpdates: 1,
        })

        // Only add new data occasionally to simulate real-time updates
        if (Math.random() > 0.5) {
          store.addRodentSighting(mockData.rodentSightings[0])
        }

        if (Math.random() > 0.8) {
          store.addLassaCase(mockData.lassaCases[0])
        }
      }, 45000) // Add new data every 45 seconds

      return () => {
        clearInterval(reconnectionInterval)
        clearInterval(mockUpdateInterval)
      }
    }

    // Try to load from localStorage first if available
    const cachedData = localStorage.getItem("deeptrack-real-time-storage")
    let hasCache = false

    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData)
        if (parsedData.state) {
          console.log("Using cached data while fetching from Supabase")
          hasCache = true

          // Load cached data
          if (parsedData.state.colonies?.length) store.setColonies(parsedData.state.colonies)
          if (parsedData.state.rodentSightings?.length) {
            parsedData.state.rodentSightings.forEach((sighting: RodentSighting) => store.addRodentSighting(sighting))
          }
          if (parsedData.state.lassaCases?.length) {
            parsedData.state.lassaCases.forEach((lassaCase: LassaCase) => store.addLassaCase(lassaCase))
          }
          if (parsedData.state.paths?.length) store.setPaths(parsedData.state.paths)
          if (parsedData.state.outbreaks?.length) store.setOutbreaks(parsedData.state.outbreaks)
          if (parsedData.state.weatherUpdates?.length) {
            parsedData.state.weatherUpdates.forEach((update: WeatherUpdate) => store.addWeatherUpdate(update))
          }
        }
      } catch (error) {
        console.error("Error parsing cached data:", error)
      }
    }

    // Fetch initial data
    try {
      await fetchInitialData()
    } catch (error) {
      console.error("Error fetching initial data:", error)

      // If we don't have cache and fetching failed, load mock data
      if (!hasCache) {
        console.warn("No cached data available, falling back to mock data")
        await loadMockData()
      }
    }

    // Set up real-time subscriptions
    const rodentChannel = supabase
      .channel("rodent-changes")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "rodent_sightings" }, (payload: any) => {
        const sighting: RodentSighting = payload.new
        store.addRodentSighting(sighting)

        // Generate alert for new sighting
        store.addAlert({
          id: `alert-rodent-${Date.now()}`,
          type: "info",
          message: `New rodent sighting detected in ${sighting.state || "unknown location"}`,
          timestamp: new Date().toISOString(),
          location: sighting.state,
          acknowledged: false,
        })
      })
      .subscribe()

    const lassaChannel = supabase
      .channel("lassa-changes")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "lassa_cases" }, (payload: any) => {
        const lassaCase: LassaCase = payload.new
        store.addLassaCase(lassaCase)

        // Generate critical alert for new Lassa case
        store.addAlert({
          id: `alert-lassa-${Date.now()}`,
          type: "critical",
          message: `New Lassa fever case reported in ${lassaCase.state || "unknown location"}`,
          timestamp: new Date().toISOString(),
          location: lassaCase.state,
          acknowledged: false,
        })
      })
      .subscribe()

    const weatherChannel = supabase
      .channel("weather-changes")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "weather_updates" }, (payload: any) => {
        const weather: WeatherUpdate = payload.new
        store.addWeatherUpdate(weather)
      })
      .subscribe()

    // Set connected status
    store.setConnected(true)
    store.setLoading(false)

    // Return cleanup function
    return () => {
      try {
        supabase.removeChannel(rodentChannel)
        supabase.removeChannel(lassaChannel)
        supabase.removeChannel(weatherChannel)
      } catch (error) {
        console.error("Error during cleanup:", error)
      }
      store.setConnected(false)
    }
  } catch (error) {
    console.error("Failed to initialize real-time service:", error)

    // Fall back to mock data
    console.warn("Falling back to mock data due to initialization error")
    await loadMockData()

    store.setConnected(false)
    store.setLoading(false)

    // Set up reconnection attempts
    const reconnectionInterval = setInterval(async () => {
      console.log("Attempting to reconnect to Supabase...")
      store.setLastConnectionAttempt(new Date().toISOString())

      try {
        const supabase = getSupabase()
        if (supabase) {
          // Test connection with a simple query
          const { data, error } = await supabase.from("colonies").select("count").limit(1)

          if (!error) {
            console.log("Reconnection successful, reinitializing real-time service")
            clearInterval(reconnectionInterval)

            // Reinitialize the service
            const cleanup = await initializeRealTimeService()
            return cleanup
          }
        }
      } catch (e) {
        console.warn("Reconnection attempt failed:", e)
      }
    }, RECONNECTION_INTERVAL)

    // Return cleanup function
    return () => {
      clearInterval(reconnectionInterval)
    }
  }
}

// Fetch initial data from Supabase
async function fetchInitialData() {
  const store = useRealTimeStore.getState()
  const supabase = getSupabase()

  if (!supabase) {
    throw new Error("Supabase client not initialized")
  }

  try {
    // Use Promise.allSettled to continue even if some queries fail
    const results = await Promise.allSettled([
      // Fetch colonies
      supabase
        .from("colonies")
        .select("*")
        .order("date", { ascending: false }),

      // Fetch rodent sightings
      supabase
        .from("rodent_sightings")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(100),

      // Fetch Lassa cases
      supabase
        .from("lassa_cases")
        .select("*")
        .order("date", { ascending: false })
        .limit(100),

      // Fetch movement paths
      supabase
        .from("movement_paths")
        .select("*"),

      // Fetch outbreaks
      supabase
        .from("outbreaks")
        .select("*")
        .order("start_date", { ascending: false }),

      // Fetch weather updates
      supabase
        .from("weather_updates")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(10),
    ])

    // Process results
    const [coloniesResult, sightingsResult, casesResult, pathsResult, outbreaksResult, weatherResult] = results

    // Handle colonies
    if (coloniesResult.status === "fulfilled" && coloniesResult.value.data) {
      store.setColonies(coloniesResult.value.data)
    } else if (coloniesResult.status === "rejected") {
      console.warn("Failed to fetch colonies:", coloniesResult.reason)
    }

    // Handle rodent sightings
    if (sightingsResult.status === "fulfilled" && sightingsResult.value.data) {
      sightingsResult.value.data.forEach((sighting: RodentSighting) => {
        store.addRodentSighting(sighting)
      })
    } else if (sightingsResult.status === "rejected") {
      console.warn("Failed to fetch rodent sightings:", sightingsResult.reason)
    }

    // Handle Lassa cases
    if (casesResult.status === "fulfilled" && casesResult.value.data) {
      casesResult.value.data.forEach((lassaCase: LassaCase) => {
        store.addLassaCase(lassaCase)
      })
    } else if (casesResult.status === "rejected") {
      console.warn("Failed to fetch Lassa cases:", casesResult.reason)
    }

    // Handle movement paths
    if (pathsResult.status === "fulfilled" && pathsResult.value.data) {
      store.setPaths(pathsResult.value.data)
    } else if (pathsResult.status === "rejected") {
      console.warn("Failed to fetch movement paths:", pathsResult.reason)
    }

    // Handle outbreaks
    if (outbreaksResult.status === "fulfilled" && outbreaksResult.value.data) {
      store.setOutbreaks(outbreaksResult.value.data)
    } else if (outbreaksResult.status === "rejected") {
      console.warn("Failed to fetch outbreaks:", outbreaksResult.reason)
    }

    // Handle weather updates
    if (weatherResult.status === "fulfilled" && weatherResult.value.data) {
      weatherResult.value.data.forEach((update: WeatherUpdate) => {
        store.addWeatherUpdate(update)
      })
    } else if (weatherResult.status === "rejected") {
      console.warn("Failed to fetch weather updates:", weatherResult.reason)
    }

    // Check if we got any data at all
    const anyDataFetched = results.some(
      (result) => result.status === "fulfilled" && result.value.data && result.value.data.length > 0,
    )

    if (!anyDataFetched) {
      console.warn("No data fetched from Supabase, falling back to mock data")
      await loadMockData()
    } else {
      console.log("Initial data loaded successfully")
    }
  } catch (error) {
    console.error("Error fetching initial data:", error)

    // Fall back to mock data
    console.warn("Falling back to mock data due to fetch error")
    await loadMockData()
  }
}

// Toggle offline mode
export function toggleOfflineMode(enabled: boolean): Promise<void> {
  return new Promise(async (resolve) => {
    const store = useRealTimeStore.getState()

    // If turning on offline mode
    if (enabled) {
      store.setOfflineMode(true)
      store.setConnected(false)

      // Load mock data if needed
      if (store.rodentSightings.length === 0) {
        await loadMockData()
      }

      resolve()
    }
    // If turning off offline mode
    else {
      store.setOfflineMode(false)

      // Try to reconnect
      try {
        const cleanup = await initializeRealTimeService()
        // Store cleanup function somewhere if needed
        resolve()
      } catch (error) {
        console.error("Failed to reconnect after disabling offline mode:", error)
        // Stay in offline mode if reconnection fails
        store.setOfflineMode(true)
        resolve()
      }
    }
  })
}

// Generate a single mock entity for real-time updates
export function generateMockUpdate(type: "rodent" | "lassa" | "weather" | "outbreak") {
  const mockData = generateMockData({
    rodentSightings: type === "rodent" ? 1 : 0,
    lassaCases: type === "lassa" ? 1 : 0,
    weatherUpdates: type === "weather" ? 1 : 0,
    outbreaks: type === "outbreak" ? 1 : 0,
    colonies: 0,
    paths: 0,
  })

  switch (type) {
    case "rodent":
      return mockData.rodentSightings[0]
    case "lassa":
      return mockData.lassaCases[0]
    case "weather":
      return mockData.weatherUpdates[0]
    case "outbreak":
      return mockData.outbreaks[0]
    default:
      return null
  }
}
