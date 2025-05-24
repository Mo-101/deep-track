"use client"

import { useState, useEffect, useRef } from "react"
import { TimelineControl } from "./timeline-control"
import { AnimatedMapMarker } from "./animated-map-marker"
import { OutbreakAlert } from "./outbreak-alert"
import { fetchAllHistoricalData, detectOutbreaks } from "@/lib/data-fetcher"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, AlertTriangle, Info } from "lucide-react"

interface HistoricalDataVisualizationProps {
  mapComponent: any // Reference to the map component
}

export function HistoricalDataVisualization({ mapComponent }: HistoricalDataVisualizationProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>({
    colonies: [],
    mastomysCases: [],
    lassaCases: [],
    lassaLocations: [],
    allData: [],
  })
  const [outbreaks, setOutbreaks] = useState<any[]>([])
  const [startDate, setStartDate] = useState<Date>(new Date(2000, 0, 1))
  const [endDate, setEndDate] = useState<Date>(new Date(2023, 11, 31))
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2000, 0, 1))
  const [playing, setPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [timeWindow, setTimeWindow] = useState(30 * 24 * 60 * 60 * 1000) // 30 days in milliseconds
  const [visibleOutbreak, setVisibleOutbreak] = useState<any | null>(null)
  const [language, setLanguage] = useState<"english" | "hausa" | "yoruba" | "igbo">("english")
  const [showColonies, setShowColonies] = useState(true)
  const [showMastomysCases, setShowMastomysCases] = useState(true)
  const [showLassaCases, setShowLassaCases] = useState(true)
  const [showLassaLocations, setShowLassaLocations] = useState(true)
  const animationRef = useRef<number | null>(null)

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const historicalData = await fetchAllHistoricalData()
        setData(historicalData)

        // Set start and end dates based on data
        if (historicalData.allData.length > 0) {
          const dates = historicalData.allData.map((item) => item.date.getTime())
          setStartDate(new Date(Math.min(...dates)))
          setEndDate(new Date(Math.max(...dates)))
          setCurrentDate(new Date(Math.min(...dates)))
        }

        // Detect outbreaks
        const detectedOutbreaks = detectOutbreaks([...historicalData.mastomysCases, ...historicalData.lassaCases])
        setOutbreaks(detectedOutbreaks)

        setLoading(false)
      } catch (err) {
        console.error("Error fetching historical data:", err)
        setError("Failed to load historical data. Please try again later.")
        setLoading(false)
      }
    }

    fetchData()

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // Animation loop
  useEffect(() => {
    if (playing) {
      const animate = () => {
        setCurrentDate((prevDate) => {
          const newDate = new Date(prevDate.getTime() + 86400000 * playbackSpeed) // Advance by days * speed

          // Stop at end date
          if (newDate > endDate) {
            setPlaying(false)
            return endDate
          }

          animationRef.current = requestAnimationFrame(animate)
          return newDate
        })
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [playing, endDate, playbackSpeed])

  // Handle play/pause
  const handlePlayPause = () => {
    setPlaying(!playing)
  }

  // Handle reset
  const handleReset = () => {
    setCurrentDate(startDate)
    setPlaying(false)
  }

  // Handle date change
  const handleDateChange = (date: Date) => {
    setCurrentDate(date)
  }

  // Handle speed change
  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed)
  }

  // Check if a data point is visible based on current date and time window
  const isDataPointVisible = (date: Date) => {
    const dataTime = date.getTime()
    const currentTime = currentDate.getTime()
    return dataTime <= currentTime && dataTime >= currentTime - timeWindow
  }

  // Handle marker click
  const handleMarkerClick = (item: any) => {
    console.log("Marker clicked:", item)
    // You could show details, zoom to location, etc.
  }

  // Handle outbreak marker click
  const handleOutbreakClick = (outbreak: any) => {
    setVisibleOutbreak(outbreak)
  }

  // Close outbreak alert
  const handleCloseOutbreakAlert = () => {
    setVisibleOutbreak(null)
  }

  // Render loading state
  if (loading) {
    return (
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-black/60 backdrop-blur-md rounded-lg p-4 flex items-center">
        <Loader2 className="w-5 h-5 text-cyan-400 animate-spin mr-2" />
        <span className="text-sm text-white">Loading historical data...</span>
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-black/60 backdrop-blur-md rounded-lg p-4 flex items-center text-red-400">
        <AlertTriangle className="w-5 h-5 mr-2" />
        <span className="text-sm">{error}</span>
      </div>
    )
  }

  // Filter visible data points
  const visibleColonies = data.colonies.filter((item: any) => showColonies && isDataPointVisible(item.date))

  const visibleMastomysCases = data.mastomysCases.filter(
    (item: any) => showMastomysCases && isDataPointVisible(item.date),
  )

  const visibleLassaCases = data.lassaCases.filter((item: any) => showLassaCases && isDataPointVisible(item.date))

  const visibleLassaLocations = data.lassaLocations.filter(
    (item: any) => showLassaLocations && isDataPointVisible(item.date),
  )

  // Filter visible outbreaks
  const visibleOutbreaks = outbreaks.filter((outbreak: any) => {
    const outbreakStart = outbreak.startDate.getTime()
    const outbreakEnd = outbreak.endDate.getTime()
    const currentTime = currentDate.getTime()
    return currentTime >= outbreakStart && currentTime <= outbreakEnd
  })

  return (
    <>
      {/* Timeline control */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-2xl px-4">
        <TimelineControl
          startDate={startDate}
          endDate={endDate}
          currentDate={currentDate}
          onDateChange={handleDateChange}
          playing={playing}
          onPlayPause={handlePlayPause}
          onReset={handleReset}
          playbackSpeed={playbackSpeed}
          onSpeedChange={handleSpeedChange}
        />
      </div>

      {/* Data filters */}
      <div className="absolute top-20 right-4 z-10">
        <Card className="bg-black/60 backdrop-blur-md border-cyan-500/30 shadow-[0_0_15px_rgba(0,255,255,0.2)] p-3 w-64">
          <h3 className="text-xs font-medium text-cyan-400 mb-2">Data Layers</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="colonies"
                checked={showColonies}
                onChange={() => setShowColonies(!showColonies)}
                className="mr-2 h-3 w-3 accent-orange-500"
              />
              <label htmlFor="colonies" className="text-xs text-orange-300">
                Mastomys Colonies
              </label>
              <Badge className="ml-auto text-[10px] bg-orange-500/30 text-orange-200">{visibleColonies.length}</Badge>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="mastomysCases"
                checked={showMastomysCases}
                onChange={() => setShowMastomysCases(!showMastomysCases)}
                className="mr-2 h-3 w-3 accent-red-500"
              />
              <label htmlFor="mastomysCases" className="text-xs text-red-300">
                Mastomys Cases
              </label>
              <Badge className="ml-auto text-[10px] bg-red-500/30 text-red-200">{visibleMastomysCases.length}</Badge>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="lassaCases"
                checked={showLassaCases}
                onChange={() => setShowLassaCases(!showLassaCases)}
                className="mr-2 h-3 w-3 accent-red-700"
              />
              <label htmlFor="lassaCases" className="text-xs text-red-300">
                Lassa Fever Cases
              </label>
              <Badge className="ml-auto text-[10px] bg-red-700/30 text-red-200">{visibleLassaCases.length}</Badge>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="lassaLocations"
                checked={showLassaLocations}
                onChange={() => setShowLassaLocations(!showLassaLocations)}
                className="mr-2 h-3 w-3 accent-purple-500"
              />
              <label htmlFor="lassaLocations" className="text-xs text-purple-300">
                Confirmed Locations
              </label>
              <Badge className="ml-auto text-[10px] bg-purple-500/30 text-purple-200">
                {visibleLassaLocations.length}
              </Badge>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-700">
            <h3 className="text-xs font-medium text-cyan-400 mb-2">Language</h3>
            <Tabs defaultValue="english" value={language} onValueChange={(value) => setLanguage(value as any)}>
              <TabsList className="grid grid-cols-4 h-7">
                <TabsTrigger value="english" className="text-[10px] py-0.5">
                  English
                </TabsTrigger>
                <TabsTrigger value="hausa" className="text-[10px] py-0.5">
                  Hausa
                </TabsTrigger>
                <TabsTrigger value="yoruba" className="text-[10px] py-0.5">
                  Yoruba
                </TabsTrigger>
                <TabsTrigger value="igbo" className="text-[10px] py-0.5">
                  Igbo
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-700 flex items-center">
            <Info className="w-3 h-3 text-cyan-400 mr-1" />
            <span className="text-[10px] text-gray-400">Active outbreaks: {visibleOutbreaks.length}</span>
          </div>
        </Card>
      </div>

      {/* Map markers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* This would be replaced with actual map markers using the map's API */}
        {/* For demonstration, we're just showing the markers without proper positioning */}

        {/* Colonies */}
        {visibleColonies.map((colony: any) => (
          <AnimatedMapMarker
            key={colony.id}
            latitude={colony.latitude}
            longitude={colony.longitude}
            type="colony"
            size={8}
            opacity={0.7}
            visible={true}
            onClick={() => handleMarkerClick(colony)}
          />
        ))}

        {/* Mastomys cases */}
        {visibleMastomysCases.map((mCase: any) => (
          <AnimatedMapMarker
            key={mCase.id}
            latitude={mCase.latitude}
            longitude={mCase.longitude}
            type="mastomys-case"
            size={10}
            opacity={0.8}
            visible={true}
            severity={mCase.severity}
            onClick={() => handleMarkerClick(mCase)}
          />
        ))}

        {/* Lassa fever cases */}
        {visibleLassaCases.map((lfCase: any) => (
          <AnimatedMapMarker
            key={lfCase.id}
            latitude={lfCase.latitude}
            longitude={lfCase.longitude}
            type="lassa-case"
            size={12}
            opacity={0.9}
            visible={true}
            severity={lfCase.severity}
            onClick={() => handleMarkerClick(lfCase)}
          />
        ))}

        {/* Lassa fever locations */}
        {visibleLassaLocations.map((location: any) => (
          <AnimatedMapMarker
            key={location.id}
            latitude={location.latitude}
            longitude={location.longitude}
            type="lassa-location"
            size={14}
            opacity={1}
            visible={true}
            onClick={() => handleMarkerClick(location)}
          />
        ))}

        {/* Outbreaks */}
        {visibleOutbreaks.map((outbreak: any) => (
          <AnimatedMapMarker
            key={outbreak.id}
            latitude={outbreak.latitude}
            longitude={outbreak.longitude}
            type="outbreak"
            size={20}
            opacity={1}
            pulse={true}
            visible={true}
            severity={outbreak.severity}
            onClick={() => handleOutbreakClick(outbreak)}
          />
        ))}
      </div>

      {/* Outbreak alert */}
      {visibleOutbreak && (
        <OutbreakAlert
          outbreak={visibleOutbreak}
          visible={!!visibleOutbreak}
          onClose={handleCloseOutbreakAlert}
          language={language}
        />
      )}
    </>
  )
}
