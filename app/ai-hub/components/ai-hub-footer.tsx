export function AIHubFooter() {
  return (
    <footer className="h-8 border-t border-purple-500/30 bg-black/90 px-4">
      <div className="h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-xs text-gray-400">System Online</span>
          </div>
          <div className="text-xs text-gray-400">
            Latency: <span className="text-green-400">24ms</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs text-gray-400">
            Memory: <span className="text-purple-400">62%</span>
          </div>
          <div className="text-xs text-gray-400">
            CPU: <span className="text-purple-400">48%</span>
          </div>
          <div className="text-xs text-gray-400">
            GPU: <span className="text-purple-400">76%</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
