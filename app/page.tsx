"use client"

import { useEffect, useState, useRef } from "react"
import { CesiumMap } from "@/components/cesium-map"
import { FallbackMap } from "@/components/fallback-map"
import { WeatherPanel } from "@/components/weather-panel"
import { ControlPanel } from "@/components/control-panel"
import { RiskAssessmentPanel } from "@/components/risk-assessment-panel"
import { LoadingScreen } from "@/components/loading-screen"
import { SmartHeader } from "@/components/smart-header"
import { FooterTicker } from "@/components/footer-ticker"
import { ColoniesPanel } from "@/components/colonies-panel"
import { AnalyticsPanel } from "@/components/analytics-panel"
import { SettingsPanel } from "@/components/settings-panel"
import { RiskLegend } from "@/components/risk-legend"
import { RealTimeMapIntegration } from "@/components/real-time-map-integration"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [useFallbackMap, setUseFallbackMap] = useState(false)
  const [showWeatherPanel, setShowWeatherPanel] = useState(false)
  const [showRiskPanel, setShowRiskPanel] = useState(false)
  const [showControlPanel, setShowControlPanel] = useState(false)
  const [showColoniesPanel, setShowColoniesPanel] = useState(false)
  const [showAnalyticsPanel, setShowAnalyticsPanel] = useState(false)
  const [showSettingsPanel, setShowSettingsPanel] = useState(false)
  const lastScrollY = useRef(0)
  const [headerVisible, setHeaderVisible] = useState(true)
  const mapRef = useRef(null)

  useEffect(() => {
    // Simulate loading time for resources
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    // Check if Cesium is available after a timeout
    const cesiumCheckTimer = setTimeout(() => {
      if (!(window as any).Cesium) {
        console.warn("Cesium not available, using fallback map")
        setUseFallbackMap(true)
      }
    }, 5000)

    // Handle scroll for header visibility
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY.current) {
        setHeaderVisible(false)
      } else {
        setHeaderVisible(true)
      }
      lastScrollY.current = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      clearTimeout(timer)
      clearTimeout(cesiumCheckTimer)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const togglePanel = (panel: string, currentState: boolean) => {
    // Close all panels first
    setShowWeatherPanel(false)
    setShowRiskPanel(false)
    setShowControlPanel(false)
    setShowColoniesPanel(false)
    setShowAnalyticsPanel(false)
    setShowSettingsPanel(false)

    // Then open the selected panel if it wasn't already open
    if (!currentState) {
      switch (panel) {
        case "weather":
          setShowWeatherPanel(true)
          break
        case "risk":
          setShowRiskPanel(true)
          break
        case "control":
          setShowControlPanel(true)
          break
        case "colonies":
          setShowColoniesPanel(true)
          break
        case "analytics":
          setShowAnalyticsPanel(true)
          break
        case "settings":
          setShowSettingsPanel(true)
          break
      }
    }
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="root-container fixed inset-0 w-full h-full overflow-hidden">
      {/* Smart Header (Collapsible) with Navigation */}
      <SmartHeader
        visible={headerVisible}
        onToggleWeather={() => togglePanel("weather", showWeatherPanel)}
        onToggleRisk={() => togglePanel("risk", showRiskPanel)}
        onToggleControl={() => togglePanel("control", showControlPanel)}
        onToggleColonies={() => togglePanel("colonies", showColoniesPanel)}
        onToggleAnalytics={() => togglePanel("analytics", showAnalyticsPanel)}
        onToggleSettings={() => togglePanel("settings", showSettingsPanel)}
        onToggleAIHub={() => {}}
      />

      {/* Central Map Area */}
      <div className="map-core absolute inset-0 w-full h-full" ref={mapRef}>
        {useFallbackMap ? <FallbackMap /> : <CesiumMap />}
      </div>

      {/* Real-time tracking integration */}
      <RealTimeMapIntegration mapComponent={mapRef.current} />

      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-[800]">
        <RiskLegend />
      </div>

      {/* Floating Panels - Only shown when toggled */}
      {showWeatherPanel && (
        <div className="absolute top-16 left-4 z-[900]">
          <WeatherPanel />
        </div>
      )}

      {showRiskPanel && (
        <div className="absolute top-16 left-4 z-[900]">
          <RiskAssessmentPanel />
        </div>
      )}

      {showControlPanel && (
        <div className="absolute top-16 right-4 z-[900]">
          <ControlPanel />
        </div>
      )}

      {showColoniesPanel && (
        <div className="absolute top-16 left-4 z-[900]">
          <ColoniesPanel />
        </div>
      )}

      {showAnalyticsPanel && (
        <div className="absolute top-16 right-4 z-[900]">
          <AnalyticsPanel />
        </div>
      )}

      {showSettingsPanel && (
        <div className="absolute top-16 right-4 z-[900]">
          <SettingsPanel />
        </div>
      )}

      {/* Footer Ticker */}
      <FooterTicker />
    </div>
  )
}
