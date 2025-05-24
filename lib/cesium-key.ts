// This file should not directly expose the Cesium key in client code
export const getCesiumKey = async (): Promise<string> => {
  // This function will call a server action to get the key
  const response = await fetch("/api/cesium-key")
  if (!response.ok) {
    throw new Error("Failed to fetch Cesium key")
  }
  const data = await response.json()
  return data.key
}
