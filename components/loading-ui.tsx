export function LoadingUI() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gray-900/80 backdrop-blur-sm">
      <div className="h-12 w-12 rounded-full border-4 border-t-cyan-500 border-r-cyan-500 border-b-transparent border-l-transparent animate-spin mb-4"></div>
      <p className="text-cyan-400 animate-pulse">Loading...</p>
    </div>
  )
}
