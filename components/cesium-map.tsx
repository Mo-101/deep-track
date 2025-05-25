"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Maximize2, Minimize2, AlertTriangle } from "lucide-react"
import { getCesiumKey } from "@/lib/cesium-key"
import { motion, AnimatePresence } from "framer-motion"
import Script from "next/script"
import { useRealTimeStore, initializeRealTimeService } from "@/lib/real-time-service"
import { CesiumMapLayers } from "./cesium-map-layers"

export function CesiumMap() {
  const cesiumContainerRef = useRef<HTMLDivElement>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [viewer, setViewer] = useState<any>(null)
  const [entities, setEntities] = useState<any[]>([])
  const [cesiumLoaded, setCesiumLoaded] = useState(false)
  const [cesiumError, setCesiumError] = useState<string | null>(null)
  const [showAlert, setShowAlert] = useState(false)
  const [currentAlert, setCurrentAlert] = useState<{
    id: string
    type: string
    message: string
    timestamp: string
  } | null>(null)

  // Map layer states
  const [nightMode, setNightMode] = useState(false)
  const [terrainEnabled, setTerrainEnabled] = useState(true)
  const [terrainExaggeration, setTerrainExaggeration] = useState(1.0)
  const [imageryOpacity, setImageryOpacity] = useState(1.0)
  const [nightLayer, setNightLayer] = useState<any>(null)
  const [dayLayer, setDayLayer] = useState<any>(null)

  // Get data from the real-time store
  const { isConnected, isLoading, colonies, paths, outbreaks, acknowledgeAlert, alerts } = useRealTimeStore()

  // Handle Cesium script loading
  const handleCesiumLoaded = () => {
    console.log("Cesium script loaded successfully")
    setCesiumLoaded(true)
  }

  const handleCesiumError = (error: Error) => {
    console.error("Failed to load Cesium:", error)
    setCesiumError("Failed to load Cesium. Using fallback map.")
  }

  // Initialize real-time service
  useEffect(() => {
    const cleanup = initializeRealTimeService()
    return () => {
      if (typeof cleanup === "function") {
        cleanup()
      }
    }
  }, [])

  useEffect(() => {
    if (!cesiumLoaded) return

    // Initialize Cesium once the script is loaded
    initCesium()

    return () => {
      // Clean up Cesium viewer
      if (viewer) {
        try {
          viewer.destroy()
        } catch (error) {
          console.warn("Error destroying Cesium viewer:", error)
        }
      }
    }
  }, [cesiumLoaded])

  // Update Cesium entities when data changes
  useEffect(() => {
    if (viewer && colonies.length > 0) {
      updateCesiumEntities()
    }
  }, [viewer, colonies, paths, outbreaks])

  // Handle alert display
  useEffect(() => {
    if (alerts.length > 0 && !showAlert) {
      // Sort alerts by timestamp (newest first) and priority (outbreaks first)
      const sortedAlerts = [...alerts]
        .filter((alert) => !alert.acknowledged)
        .sort((a, b) => {
          if (a.type === "critical" && b.type !== "critical") return -1
          if (a.type !== "critical" && b.type === "critical") return 1
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        })

      if (sortedAlerts.length > 0) {
        setCurrentAlert({
          id: sortedAlerts[0].id,
          type: sortedAlerts[0].type,
          message: sortedAlerts[0].message,
          timestamp: sortedAlerts[0].timestamp,
        })
        setShowAlert(true)

        // Remove the displayed alert after showing it
        const timer = setTimeout(() => {
          setShowAlert(false)
          acknowledgeAlert(sortedAlerts[0].id)
        }, 5000)

        return () => clearTimeout(timer)
      }
    }
  }, [alerts, showAlert, acknowledgeAlert])

  const initCesium = async () => {
    try {
      // Access the global Cesium object
      const Cesium = (window as any).Cesium

      if (!Cesium) {
        console.error("Cesium is not loaded")
        setCesiumError("Cesium is not available")
        return
      }

      // Fetch Cesium key from server with better error handling
      let cesiumKey
      try {
        console.log("Fetching Cesium key from server...")
        cesiumKey = await getCesiumKey()
        console.log("Cesium key fetched successfully")

        // Set access token
        Cesium.Ion.defaultAccessToken = cesiumKey
      } catch (error) {
        console.error("Failed to fetch Cesium key:", error)

        // Check if we have a fallback key in local storage from previous successful fetch
        const fallbackKey = localStorage.getItem("cesium_key_fallback")
        if (fallbackKey) {
          console.log("Using fallback Cesium key from local storage")
          Cesium.Ion.defaultAccessToken = fallbackKey
        } else {
          setCesiumError(`Failed to fetch Cesium key: ${error instanceof Error ? error.message : String(error)}`)
          return
        }
      }

      // If we successfully used the key, store it as fallback for future sessions
      if (cesiumKey) {
        try {
          localStorage.setItem("cesium_key_fallback", cesiumKey)
        } catch (e) {
          // Ignore storage errors
        }
      }

      // Create a basic viewer with minimal options
      const cesiumViewer = new Cesium.Viewer(cesiumContainerRef.current, {
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
        // Use a specific imagery provider to avoid worker script issues
        imageryProvider: Cesium.createWorldImagery({
          style: Cesium.IonWorldImageryStyle.AERIAL_WITH_LABELS,
        }),
      })

      // Set terrain provider
      if (terrainEnabled) {
        cesiumViewer.scene.setTerrain(new Cesium.Terrain(Cesium.CesiumTerrainProvider.fromIonAssetId(1)))
      }

      // Store the day layer reference
      setDayLayer(cesiumViewer.imageryLayers.get(0))

      // Option 1: Disable lighting for a consistently bright map
      cesiumViewer.scene.globe.enableLighting = false

      // Option 2: Set a specific time (noon for maximum brightness)
      const julianDate = new Cesium.JulianDate()
      const noon = new Cesium.JulianDate()
      Cesium.JulianDate.addHours(julianDate, 12, noon) // Set to noon
      cesiumViewer.clock.currentTime = noon
      cesiumViewer.clock.multiplier = 0 // Freeze time

      // Increase globe brightness
      cesiumViewer.scene.globe.baseColor = Cesium.Color.WHITE

      // Adjust atmosphere for better visibility
      cesiumViewer.scene.skyAtmosphere.hueShift = 0.0
      cesiumViewer.scene.skyAtmosphere.saturationShift = 0.0
      cesiumViewer.scene.skyAtmosphere.brightnessShift = 0.15

      // Reduce fog for better visibility
      cesiumViewer.scene.fog.density = 0.0001
      cesiumViewer.scene.fog.minimumBrightness = 0.8

      // Adjust imagery brightness if needed
      const layers = cesiumViewer.imageryLayers
      const baseLayer = layers.get(0)
      baseLayer.brightness = 1.5 // Increase brightness (1.0 is default)
      baseLayer.contrast = 1.2 // Increase contrast slightly

      // Enable shadows for more realistic rendering
      cesiumViewer.shadows = true
      cesiumViewer.terrainShadows = Cesium.ShadowMode.ENABLED

      // Enable depth testing for better 3D visualization
      cesiumViewer.scene.globe.depthTestAgainstTerrain = true

      // Set initial camera position - focus on Nigeria (West Africa)
      cesiumViewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(8.6753, 9.082, 1000000.0),
        duration: 2,
      })

      setViewer(cesiumViewer)

      // Create entities for colonies, paths, and outbreaks if data is available
      if (colonies.length > 0) {
        createCesiumEntities(cesiumViewer, Cesium)
      }

      // Ensure the viewer resizes properly when the window resizes
      window.addEventListener("resize", () => {
        cesiumViewer.resize()
      })

      setIsInitialized(true)

      return () => {
        window.removeEventListener("resize", () => {
          cesiumViewer.resize()
        })

        cesiumViewer.destroy()
      }
    } catch (error) {
      console.error("Failed to initialize Cesium:", error)
      setCesiumError(`Failed to initialize Cesium: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  const createCesiumEntities = (cesiumViewer: any, Cesium: any) => {
    if (!cesiumViewer || !Cesium) return

    try {
      const newEntities = []

      // Create colony entities
      colonies.forEach((colony) => {
        try {
          // Check if this colony has an active outbreak
          const hasOutbreak = outbreaks.some((o) => o.colony_id === colony.colony_id && o.status === "active")

          // Create pulsing circle for each colony
          const pulsingCircle = cesiumViewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(colony.longitude, colony.latitude),
            name: colony.colony_id,
            ellipse: {
              semiMinorAxis: new Cesium.CallbackProperty((time: any) => {
                return 10000 + 5000 * Math.sin(Date.now() / 1000)
              }, false),
              semiMajorAxis: new Cesium.CallbackProperty((time: any) => {
                return 10000 + 5000 * Math.sin(Date.now() / 1000)
              }, false),
              height: 0,
              material: new Cesium.ColorMaterialProperty(
                hasOutbreak
                  ? Cesium.Color.RED.withAlpha(0.5)
                  : colony.risk === "high"
                    ? Cesium.Color.RED.withAlpha(0.3)
                    : colony.risk === "moderate"
                      ? Cesium.Color.YELLOW.withAlpha(0.3)
                      : Cesium.Color.GREEN.withAlpha(0.3),
              ),
            },
          })
          newEntities.push(pulsingCircle)

          // Create billboard for colony icon
          const colonyIcon = cesiumViewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(colony.longitude, colony.latitude),
            name: `${colony.colony_id} Icon`,
            billboard: {
              image: createColonyIconCanvas(colony.risk, hasOutbreak),
              width: 32,
              height: 32,
              verticalOrigin: Cesium.VerticalOrigin.CENTER,
              horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
              scale: new Cesium.CallbackProperty(() => {
                // Pulse the icon if it has an outbreak or recent activity
                const timeSinceActive = new Date().getTime() - new Date(colony.lastActive).getTime()
                const isRecentlyActive = timeSinceActive < 1000 * 60 * 10 // Active in last 10 minutes

                if (hasOutbreak) {
                  return 1.0 + 0.3 * Math.sin(Date.now() / 500)
                } else if (isRecentlyActive) {
                  return 1.0 + 0.2 * Math.sin(Date.now() / 1000)
                }
                return 1.0
              }, false),
            },
            label: {
              text: colony.colony_id,
              font: "14px sans-serif",
              fillColor: Cesium.Color.WHITE,
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              outlineWidth: 2,
              outlineColor: Cesium.Color.BLACK,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              pixelOffset: new Cesium.Cartesian2(0, -36),
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
            label: {
              text: colony.colony_id,
              font: "14px sans-serif",
              fillColor: Cesium.Color.WHITE,
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              outlineWidth: 2,
              outlineColor: Cesium.Color.BLACK,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              pixelOffset: new Cesium.Cartesian2(0, -36),
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
          })
          newEntities.push(colonyIcon)

          // Add population label
          const populationLabel = cesiumViewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(colony.longitude, colony.latitude),
            name: `${colony.colony_id} Population`,
            label: {
              text: `Pop: ${colony.population_count}`,
              font: "10px sans-serif",
              fillColor: Cesium.Color.CYAN,
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              outlineWidth: 1,
              outlineColor: Cesium.Color.BLACK,
              verticalOrigin: Cesium.VerticalOrigin.TOP,
              pixelOffset: new Cesium.Cartesian2(0, 5),
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
              backgroundColor: Cesium.Color.fromCssColorString("rgba(0, 0, 0, 0.7)"),
            },
          })
          newEntities.push(populationLabel)
        } catch (error) {
          console.warn("Failed to create colony entity:", error)
        }
      })

      // Create path entities
      paths.forEach((path) => {
        try {
          const fromColony = colonies.find((c) => c.colony_id === path.from_colony_id)
          const toColony = colonies.find((c) => c.colony_id === path.to_colony_id)

          if (fromColony && toColony) {
            // Create base path
            const basePath = cesiumViewer.entities.add({
              name: `Path from ${fromColony.colony_id} to ${toColony.colony_id}`,
              polyline: {
                positions: Cesium.Cartesian3.fromDegreesArray([
                  fromColony.longitude,
                  fromColony.latitude,
                  toColony.longitude,
                  toColony.latitude,
                ]),
                width: 2,
                material: new Cesium.PolylineOutlineMaterialProperty({
                  color: Cesium.Color.CYAN.withAlpha(0.3),
                  outlineWidth: 0,
                  outlineColor: Cesium.Color.BLACK,
                }),
              },
            })
            newEntities.push(basePath)

            // Create animated path for active paths
            if (path.active) {
              const animatedPath = cesiumViewer.entities.add({
                name: `Animated Path from ${fromColony.colony_id} to ${toColony.colony_id}`,
                polyline: {
                  positions: Cesium.Cartesian3.fromDegreesArray([
                    fromColony.longitude,
                    fromColony.latitude,
                    toColony.longitude,
                    toColony.latitude,
                  ]),
                  width: 4,
                  material: new Cesium.PolylineDashMaterialProperty({
                    color: Cesium.Color.CYAN,
                    dashLength: 16.0,
                    dashPattern: 7.0,
                  }),
                },
              })
              newEntities.push(animatedPath)

              // Add moving point along the path
              const movingPoint = cesiumViewer.entities.add({
                name: `Moving Point from ${fromColony.colony_id} to ${toColony.colony_id}`,
                position: new Cesium.CallbackProperty((time: any) => {
                  const seconds = Date.now() / 1000
                  const t = (Math.sin(seconds / 5) + 1) / 2 // Value between 0 and 1

                  const startPos = Cesium.Cartesian3.fromDegrees(fromColony.longitude, fromColony.latitude)
                  const endPos = Cesium.Cartesian3.fromDegrees(toColony.longitude, toColony.latitude)

                  // Linear interpolation between start and end positions
                  const position = new Cesium.Cartesian3()
                  Cesium.Cartesian3.lerp(startPos, endPos, t, position)

                  return position
                }, false),
                point: {
                  pixelSize: 8,
                  color: Cesium.Color.CYAN,
                  outlineColor: Cesium.Color.WHITE,
                  outlineWidth: 2,
                  disableDepthTestDistance: Number.POSITIVE_INFINITY,
                },
              })
              newEntities.push(movingPoint)
            }
          }
        } catch (error) {
          console.warn("Failed to create path entity:", error)
        }
      })

      // Create outbreak entities
      outbreaks.forEach((outbreak) => {
        try {
          // Find the associated colony if colony_id is available
          const colony = colonies.some((o) => o.colony_id === outbreak.colony_id)

          const latitude = colony ? colony.latitude : outbreak.latitude
          const longitude = colony ? colony.longitude : outbreak.longitude

          if (latitude && longitude) {
            // Create outbreak area using a custom material for better visualization
            const outbreakArea = cesiumViewer.entities.add({
              position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
              name: `Outbreak Area ${outbreak.id}`,
              ellipse: {
                semiMinorAxis: outbreak.affected_area || 100000,
                semiMajorAxis: outbreak.affected_area || 100000,
                material: new Cesium.GridMaterialProperty({
                  color: Cesium.Color.RED.withAlpha(0.3),
                  cellAlpha: 0.2,
                  lineCount: new Cesium.Cartesian2(8, 8),
                  lineThickness: new Cesium.Cartesian2(2.0, 2.0),
                }),
                outline: true,
                outlineColor: Cesium.Color.RED,
                outlineWidth: 2,
                height: 0,
              },
            })
            newEntities.push(outbreakArea)

            // Add a 3D model for outbreak warning
            const outbreakWarning = cesiumViewer.entities.add({
              position: Cesium.Cartesian3.fromDegrees(longitude, latitude, 1000),
              name: `Outbreak Warning ${outbreak.id}`,
              billboard: {
                image: createWarningIconCanvas(),
                width: 32,
                height: 32,
                verticalOrigin: Cesium.VerticalOrigin.CENTER,
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                pixelOffset: new Cesium.Cartesian2(0, -50),
              },
              label: {
                text: "OUTBREAK",
                font: "12px sans-serif",
                fillColor: Cesium.Color.RED,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                outlineColor: Cesium.Color.BLACK,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, -60),
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
              },
            })
            newEntities.push(outbreakWarning)
          }
        } catch (error) {
          console.warn("Failed to create outbreak entity:", error)
        }
      })

      setEntities(newEntities)
    } catch (error) {
      console.error("Error creating Cesium entities:", error)
    }
  }

  const updateCesiumEntities = () => {
    if (!viewer) return

    // Remove existing entities
    entities.forEach((entity) => {
      try {
        viewer.entities.remove(entity)
      } catch (error) {
        console.warn("Failed to remove entity:", error)
      }
    })

    // Create new entities
    const Cesium = (window as any).Cesium
    createCesiumEntities(viewer, Cesium)
  }

  // Helper function to create colony icon canvas
  const createColonyIconCanvas = (risk: string | undefined, hasOutbreak: boolean) => {
    const canvas = document.createElement("canvas")
    canvas.width = 64
    canvas.height = 64
    const context = canvas.getContext("2d")

    if (!context) return ""

    // Set colors based on risk level
    let color
    let glowColor
    let glowSize

    if (hasOutbreak) {
      color = "#ff0000"
      glowColor = "rgba(255, 0, 0, 0.8)"
      glowSize = 15
    } else if (risk === "high") {
      color = "#ff3333"
      glowColor = "rgba(255, 0, 0, 0.6)"
      glowSize = 12
    } else if (risk === "moderate") {
      color = "#ffcc00"
      glowColor = "rgba(255, 204, 0, 0.6)"
      glowSize = 10
    } else {
      color = "#33cc33"
      glowColor = "rgba(0, 255, 0, 0.6)"
      glowSize = 8
    }

    // Draw glow
    context.shadowColor = glowColor
    context.shadowBlur = glowSize

    // Draw outer circle
    context.beginPath()
    context.arc(32, 32, 16, 0, 2 * Math.PI)
    context.fillStyle = "rgba(0, 0, 0, 0.7)"
    context.fill()

    // Draw inner circle
    context.beginPath()
    context.arc(32, 32, 12, 0, 2 * Math.PI)
    context.fillStyle = color
    context.fill()

    // Draw center dot
    context.beginPath()
    context.arc(32, 32, 4, 0, 2 * Math.PI)
    context.fillStyle = "#ffffff"
    context.fill()

    // Draw spikes
    context.strokeStyle = color
    context.lineWidth = 2

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      const innerRadius = 16
      const outerRadius = 24

      const startX = 32 + Math.cos(angle) * innerRadius
      const startY = 32 + Math.sin(angle) * innerRadius
      const endX = 32 + Math.cos(angle) * outerRadius
      const endY = 32 + Math.sin(angle) * outerRadius

      context.beginPath()
      context.moveTo(startX, startY)
      context.lineTo(endX, endY)
      context.stroke()
    }

    return canvas.toDataURL()
  }

  // Helper function to create warning icon canvas
  const createWarningIconCanvas = () => {
    const canvas = document.createElement("canvas")
    canvas.width = 64
    canvas.height = 64
    const context = canvas.getContext("2d")

    if (!context) return ""

    // Draw warning triangle
    context.beginPath()
    context.moveTo(32, 10)
    context.lineTo(54, 50)
    context.lineTo(10, 50)
    context.closePath()

    // Add glow effect
    context.shadowColor = "rgba(255, 0, 0, 0.8)"
    context.shadowBlur = 15

    // Fill triangle
    context.fillStyle = "rgba(255, 0, 0, 0.8)"
    context.fill()

    // Draw border
    context.strokeStyle = "#ffffff"
    context.lineWidth = 2
    context.stroke()

    // Draw exclamation mark
    context.fillStyle = "#ffffff"
    context.font = "bold 30px Arial"
    context.textAlign = "center"
    context.textBaseline = "middle"
    context.fillText("!", 32, 35)

    return canvas.toDataURL()
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true)
      })
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false)
        })
      }
    }
  }

  // Handle night mode toggle
  const handleToggleNightMode = (enabled: boolean) => {
    setNightMode(enabled)

    if (!viewer) return

    const Cesium = (window as any).Cesium

    if (enabled) {
      // Add night imagery layer if it doesn't exist
      if (!nightLayer) {
        const layer = viewer.imageryLayers.addImageryProvider(Cesium.IonImageryProvider.fromAssetId(3812))
        setNightLayer(layer)
      } else {
        // Show existing night layer
        nightLayer.show = true
      }

      // Hide day layer
      if (dayLayer) {
        dayLayer.show = false
      }
    } else {
      // Hide night layer
      if (nightLayer) {
        nightLayer.show = false
      }

      // Show day layer
      if (dayLayer) {
        dayLayer.show = true
      }
    }
  }

  // Handle terrain toggle
  const handleToggleTerrain = (enabled: boolean) => {
    setTerrainEnabled(enabled)

    if (!viewer) return

    const Cesium = (window as any).Cesium

    if (enabled) {
      // Enable terrain
      viewer.scene.setTerrain(new Cesium.Terrain(Cesium.CesiumTerrainProvider.fromIonAssetId(1)))
    } else {
      // Disable terrain
      viewer.scene.setTerrain(new Cesium.Terrain(Cesium.EllipsoidTerrainProvider.fromWorldTerrain()))
    }
  }

  // Handle terrain exaggeration
  const handleTerrainExaggeration = (value: number) => {
    setTerrainExaggeration(value)

    if (!viewer) return

    // Set terrain exaggeration
    viewer.scene.globe.terrainExaggeration = value
  }

  // Handle imagery opacity
  const handleImageryOpacity = (value: number) => {
    setImageryOpacity(value)

    if (!viewer) return

    // Set imagery opacity
    if (dayLayer) {
      dayLayer.alpha = value
    }

    if (nightLayer && nightMode) {
      nightLayer.alpha = value
    }
  }

  return (
    <>
      {/* Load Cesium script properly */}
      <Script
        src="https://cesium.com/downloads/cesiumjs/releases/1.104/Build/Cesium/Cesium.js"
        onLoad={handleCesiumLoaded}
        onError={handleCesiumError}
        strategy="afterInteractive"
      />

      {/* Add Cesium CSS */}
      {cesiumLoaded && (
        <link
          rel="stylesheet"
          href="https://cesium.com/downloads/cesiumjs/releases/1.104/Build/Cesium/Widgets/widgets.css"
        />
      )}

      <div className="w-full h-full">
        <div
          ref={cesiumContainerRef}
          className="absolute inset-0 w-full h-full"
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />

        {/* Loading state */}
        {(isLoading || !isInitialized) && !cesiumError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin text-cyan-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              <p className="text-white">Loading Cesium map...</p>
            </div>
          </div>
        )}

        {cesiumError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
            <div className="bg-red-900/80 backdrop-blur-md p-4 rounded-lg border border-red-500 max-w-md">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <h3 className="text-red-300 font-medium">Cesium Error</h3>
              </div>
              <p className="text-white text-sm">{cesiumError}</p>
            </div>
          </div>
        )}

        {/* Connection status indicator */}
        <div
          className={`absolute top-4 right-4 z-10 px-2 py-1 rounded-full flex items-center gap-1.5 text-xs ${
            isConnected ? "bg-green-900/80 text-green-400" : "bg-red-900/80 text-red-400"
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"}`}></div>
          {isConnected ? "Connected" : "Disconnected"}
        </div>

        {/* Map Layers Control */}
        <div className="absolute top-20 right-4 z-10">
          <CesiumMapLayers
            onToggleNightMode={handleToggleNightMode}
            onToggleTerrain={handleToggleTerrain}
            onTerrainExaggeration={handleTerrainExaggeration}
            onImageryOpacity={handleImageryOpacity}
            nightMode={nightMode}
            terrainEnabled={terrainEnabled}
            terrainExaggeration={terrainExaggeration}
            imageryOpacity={imageryOpacity}
          />
        </div>

        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-20 right-4 z-10 bg-black/80 backdrop-blur-sm border-cyan-500/30 text-cyan-400 hover:bg-black/90 hover:text-cyan-300"
          onClick={toggleFullscreen}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>

        {/* Alert notification */}
        <AnimatePresence>
          {showAlert && currentAlert && (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className={`absolute top-20 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-md flex items-center gap-2 max-w-md ${
                currentAlert.type === "critical"
                  ? "bg-red-900/90 border-2 border-red-500"
                  : currentAlert.type === "movement"
                    ? "bg-cyan-900/90 border border-cyan-500"
                    : "bg-yellow-900/90 border border-yellow-500"
              }`}
            ></motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
