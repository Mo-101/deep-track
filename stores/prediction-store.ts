import { create } from "zustand"

export type RiskLevel = "low" | "medium" | "high"
export type ConnectionStatus = "connected" | "connecting" | "disconnected"

export interface PredictionLocation {
  latitude: number
  longitude: number
  region?: string
}

export interface PredictionFactors {
  humidity?: number
  temperature?: number
  populationDensity?: number
  rodentActivity?: number
  [key: string]: number | undefined
}

export interface Prediction {
  id: string
  timestamp: string
  risk_score: number
  risk_level: RiskLevel
  confidence: number
  location: PredictionLocation
  factors?: PredictionFactors
}

interface PredictionState {
  predictions: Prediction[]
  filteredPredictions: Prediction[]
  connectionStatus: ConnectionStatus
  filter: RiskLevel | "all"
  addPrediction: (prediction: Prediction) => void
  setConnectionStatus: (status: ConnectionStatus) => void
  setFilter: (filter: RiskLevel | "all") => void
  clearPredictions: () => void
}

export const usePredictionStore = create<PredictionState>((set, get) => ({
  predictions: [],
  filteredPredictions: [],
  connectionStatus: "disconnected",
  filter: "all",

  addPrediction: (prediction) => {
    set((state) => {
      const newPredictions = [prediction, ...state.predictions].slice(0, 100) // Keep last 100 predictions
      return {
        predictions: newPredictions,
        filteredPredictions: filterPredictions(newPredictions, state.filter),
      }
    })
  },

  setConnectionStatus: (status) => {
    set({ connectionStatus: status })
  },

  setFilter: (filter) => {
    set((state) => ({
      filter,
      filteredPredictions: filterPredictions(state.predictions, filter),
    }))
  },

  clearPredictions: () => {
    set({ predictions: [], filteredPredictions: [] })
  },
}))

// Helper function to filter predictions
function filterPredictions(predictions: Prediction[], filter: RiskLevel | "all"): Prediction[] {
  if (filter === "all") {
    return predictions
  }
  return predictions.filter((p) => p.risk_level === filter)
}
