import { Home, BarChart2, FileText, Settings, Cloud, AlertTriangle } from "lucide-react"

export function MobileNav() {
  return (
    <div className="pt-6 pb-8">
      <h2 className="text-xl font-bold mb-6 px-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
        DeepTrack
      </h2>

      <nav>
        <ul className="space-y-2">
          <li>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-2 text-cyan-400 bg-cyan-950/30 border-l-2 border-cyan-400"
            >
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:bg-gray-800/50 hover:text-cyan-300 transition"
            >
              <Cloud className="h-5 w-5" />
              <span>Weather Data</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:bg-gray-800/50 hover:text-cyan-300 transition"
            >
              <AlertTriangle className="h-5 w-5" />
              <span>Risk Assessment</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:bg-gray-800/50 hover:text-cyan-300 transition"
            >
              <BarChart2 className="h-5 w-5" />
              <span>Analytics</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:bg-gray-800/50 hover:text-cyan-300 transition"
            >
              <FileText className="h-5 w-5" />
              <span>Reports</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:bg-gray-800/50 hover:text-cyan-300 transition"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  )
}
