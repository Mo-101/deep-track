"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"
import { LoadingScreen } from "./components/loading-screen"

// Dynamically import the CesiumGlobe component to avoid SSR issues
const CesiumGlobe = dynamic(() => import("./components/cesium-globe"), { ssr: false })

export default function WindVisualizationPage() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-black">
      <Suspense fallback={<LoadingScreen />}>
        <CesiumGlobe />
      </Suspense>
    </div>
  )
}
