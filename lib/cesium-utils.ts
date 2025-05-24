// Utility functions for Cesium initialization

/**
 * Creates a Cesium viewer with appropriate configuration based on the available API
 * This handles different versions of Cesium
 */
export async function createCesiumViewer(container: HTMLDivElement | null, accessToken: string) {
  if (!container) {
    throw new Error("Container element is null")
  }

  try {
    // Dynamically import Cesium
    const Cesium = await import("cesium")

    // Set access token
    Cesium.Ion.defaultAccessToken = accessToken

    // Try different initialization approaches based on Cesium version
    let viewer
    let terrainProvider
    let imageryProvider

    // Try to create terrain provider with different API versions
    try {
      // Try newer API first
      if (typeof Cesium.createWorldTerrain === "function") {
        terrainProvider = Cesium.createWorldTerrain()
        console.log("Using Cesium.createWorldTerrain")
      }
      // Try alternative API
      else if (Cesium.Terrain && typeof Cesium.Terrain.fromWorldTerrain === "function") {
        terrainProvider = Cesium.Terrain.fromWorldTerrain()
        console.log("Using Cesium.Terrain.fromWorldTerrain")
      }
      // Try older API
      else if (typeof Cesium.CesiumTerrainProvider === "function") {
        terrainProvider = new Cesium.CesiumTerrainProvider({
          url: Cesium.IonResource.fromAssetId(1),
        })
        console.log("Using Cesium.CesiumTerrainProvider")
      }
    } catch (error) {
      console.warn("Failed to create terrain provider:", error)
      terrainProvider = undefined
    }

    // Try to create imagery provider with different API versions
    try {
      if (typeof Cesium.createWorldImagery === "function") {
        imageryProvider = Cesium.createWorldImagery()
        console.log("Using Cesium.createWorldImagery")
      } else if (Cesium.IonImageryProvider) {
        imageryProvider = new Cesium.IonImageryProvider({ assetId: 3 })
        console.log("Using Cesium.IonImageryProvider")
      } else if (Cesium.ArcGisMapServerImageryProvider) {
        imageryProvider = new Cesium.ArcGisMapServerImageryProvider({
          url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
        })
        console.log("Using Cesium.ArcGisMapServerImageryProvider")
      }
    } catch (error) {
      console.warn("Failed to create imagery provider:", error)
      imageryProvider = undefined
    }

    // Create viewer with the appropriate providers
    try {
      const viewerOptions = {
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
      }

      // Add terrain provider if available
      if (terrainProvider) {
        viewerOptions.terrainProvider = terrainProvider
      }

      // Add imagery provider if available
      if (imageryProvider) {
        viewerOptions.imageryProvider = imageryProvider
      }

      viewer = new Cesium.Viewer(container, viewerOptions)

      // If we couldn't set imagery provider in options, try to add it manually
      if (!viewerOptions.imageryProvider && imageryProvider) {
        viewer.imageryLayers.addImageryProvider(imageryProvider)
      }

      return viewer
    } catch (error) {
      console.error("Failed to create Cesium viewer:", error)
      throw error
    }
  } catch (error) {
    console.error("Failed to initialize Cesium:", error)
    throw error
  }
}
