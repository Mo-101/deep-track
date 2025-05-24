"use client"

import { useState, useCallback, useRef } from "react"
import { RealTimeMapController } from "./real-time-map-controller"
import { RealTimeAlertNotifier } from "./real-time-alert-notifier"
import { RodentMovementTracker } from "./rodent-movement-tracker"
import { RealTimeWeatherMonitor } from "./real-time-weather-monitor"
import type { RodentSighting, LassaCase, WeatherUpdate } from "@/lib/real-time-service"

interface RealTimeMapIntegrationProps {
  mapComponent: any // Reference to the map component (Cesium viewer or similar)
}

export function RealTimeMapIntegration({ mapComponent }: RealTimeMapIntegrationProps) {
  const [selectedColony, setSelectedColony] = useState<string | null>(null)
  const [trackingMovement, setTrackingMovement] = useState<RodentSighting[]>([])

  // Use a ref to track processed sightings to avoid duplicate processing
  const processedSightingsRef = useRef<Set<string>>(new Set())

  // Handle new rodent sighting - use useCallback to prevent recreation on each render
  const handleNewSighting = useCallback(
    (sighting: RodentSighting) => {
      // Check if we've already processed this sighting
      if (processedSightingsRef.current.has(sighting.id)) {
        return
      }

      // Mark this sighting as processed
      processedSightingsRef.current.add(sighting.id)

      // In a real implementation, this would add a marker to the map
      console.log("New rodent sighting:", sighting)

      // If we're tracking this colony, update the tracking data
      if (selectedColony === sighting.colony_id) {
        setTrackingMovement((prev) => [...prev, sighting])
      }
    },
    [selectedColony],
  )

  // Handle new Lassa case - use useCallback to prevent recreation on each render
  const handleNewCase = useCallback((lassaCase: LassaCase) => {
    // In a real implementation, this would add a marker to the map
    console.log("New Lassa case:", lassaCase)
  }, [])

  // Handle weather update - use useCallback to prevent recreation on each render
  const handleWeatherUpdate = useCallback((weather: WeatherUpdate) => {
    // In a real implementation, this would update weather visualization on the map
    console.log("Weather update:", weather)
  }, [])

  // Handle colony selection - use useCallback to prevent recreation on each render
  const handleSelectColony = useCallback((colonyId: string) => {
    setSelectedColony(colonyId)
    // Reset tracking data when selecting a new colony
    setTrackingMovement([])
    // In a real implementation, this would focus the map on the colony
  }, [])

  // Handle movement tracking - use useCallback to prevent recreation on each render
  const handleTrackMovement = useCallback((movements: RodentSighting[]) => {
    setTrackingMovement(movements)
    // In a real implementation, this would visualize the movement path on the map
  }, [])

  return (
    <>
      {/* Real-time map controller */}
      <RealTimeMapController mapComponent={mapComponent} onNewSighting={handleNewSighting} onNewCase={handleNewCase} />

      {/* Real-time alert notifier */}
      <RealTimeAlertNotifier />

      {/* Rodent movement tracker */}
      <div className="absolute top-20 right-4 z-10">
        <RodentMovementTracker
          onSelectColony={handleSelectColony}
          onTrackMovement={handleTrackMovement}
          trackingData={trackingMovement}
        />
      </div>

      {/* Real-time weather monitor */}
      <div className="absolute bottom-20 left-4 z-10">
        <RealTimeWeatherMonitor onWeatherUpdate={handleWeatherUpdate} />
      </div>
    </>
  )
}
