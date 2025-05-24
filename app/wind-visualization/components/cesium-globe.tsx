"use client"

import { useEffect, useRef, useState } from "react"
import * as Cesium from "cesium"
import "cesium/Build/Cesium/Widgets/widgets.css"
import { WindControls } from "./wind-controls"
import { fetchWindData } from "../lib/wind-data"
import { WindParticleSystem } from "../lib/wind-particle-system"
import { CESIUM_KEY } from "@/lib/cesium-key"

// Initialize Cesium access token
Cesium.Ion.defaultAccessToken = CESIUM_KEY

export default function CesiumGlobe() {
  const cesiumContainerRef = useRef<HTMLDivElement>(null)
  const [viewer, setViewer] = useState<Cesium.Viewer | null>(null)
  const [windSystem, setWindSystem] = useState<WindParticleSystem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [windSettings, setWindSettings] = useState({
    speed: 1.0,
    particleCount: 5000,
    particleSize: 1.5,
    colorMode: "speed",
    showStreamlines: true,
    altitude: 10000,
  })
  const [windData, setWindData] = useState<any>(null)

  // Initialize Cesium viewer
  useEffect(() => {
    if (!cesiumContainerRef.current) return

    // Create the Cesium viewer
    const cesiumViewer = new Cesium.Viewer(cesiumContainerRef.current, {
      terrainProvider: Cesium.createWorldTerrain(),
      animation: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      sceneModePicker: false,
      selectionIndicator: false,
      timeline: false,
      navigationHelpButton: false,
      navigationInstructionsInitiallyVisible: false,
      scene3DOnly: true,
      imageryProvider: new Cesium.IonImageryProvider({
        assetId: 3845, // Cesium World Imagery
      }),
    })

    // Set initial camera position
    cesiumViewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(0, 20, 20000000),
      orientation: {
        heading: 0.0,
        pitch: -Math.PI / 2,
        roll: 0.0,
      },
    })

    // Remove default Cesium credits
    cesiumViewer.scene.globe.enableLighting = true
    cesiumViewer.scene.globe.depthTestAgainstTerrain = true
    cesiumViewer.scene.skyAtmosphere.show = true
    cesiumViewer.scene.fog.enabled = true

    // Set the viewer state
    setViewer(cesiumViewer)

    // Cleanup function
    return () => {
      if (cesiumViewer && !cesiumViewer.isDestroyed()) {
        cesiumViewer.destroy()
      }
    }
  }, [])

  // Initialize wind data and particle system
  useEffect(() => {
    if (!viewer) return

    const initializeWindSystem = async () => {
      try {
        setIsLoading(true)

        // Fetch wind data from OpenWeather API
        const data = await fetchWindData()
        setWindData(data)

        // Create wind particle system
        const particleSystem = new WindParticleSystem(viewer, data, windSettings)
        setWindSystem(particleSystem)

        setIsLoading(false)
      } catch (error) {
        console.error("Failed to initialize wind system:", error)
        setIsLoading(false)
      }
    }

    initializeWindSystem()

    return () => {
      // Cleanup wind system
      if (windSystem) {
        windSystem.destroy()
      }
    }
  }, [viewer])

  // Update wind system when settings change
  useEffect(() => {
    if (windSystem && windData) {
      windSystem.updateSettings(windSettings)
    }
  }, [windSettings, windSystem, windData])

  // Handle settings changes
  const handleSettingsChange = (newSettings: Partial<typeof windSettings>) => {
    setWindSettings((prev) => ({ ...prev, ...newSettings }))
  }

  return (
    <div className="relative h-full w-full">
      <div ref={cesiumContainerRef} className="absolute h-full w-full" />

      {/* Overlay UI */}
      <div className="absolute left-4 top-4 z-10">
        <h1 className="mb-2 text-2xl font-bold text-white">
          <span className="text-cyan-400">DEEPTRACK™</span> WIND VISUALIZATION
        </h1>
      </div>

      {/* Wind controls panel */}
      <WindControls
        settings={windSettings}
        onSettingsChange={handleSettingsChange}
        isLoading={isLoading}
        windData={windData}
      />
    </div>
  )
}
