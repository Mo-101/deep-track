export function LoadingScreen() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-black text-white">
      <div className="mb-4 text-2xl font-bold text-cyan-400">DEEPTRACK™ WIND VISUALIZATION</div>
      <div className="h-2 w-64 overflow-hidden rounded-full bg-gray-800">
        <div className="animate-pulse-x h-full w-1/2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"></div>
      </div>
      <div className="mt-4 text-sm text-gray-400">Initializing Cesium Engine...</div>
    </div>
  )
}
