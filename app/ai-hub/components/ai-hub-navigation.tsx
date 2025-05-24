"use client"

import { Activity, Grid, Radio, Workflow, AlertTriangle, Terminal, Map } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AIHubNavigation() {
  return (
    <nav className="border-b border-purple-500/30 bg-black/90">
      <div className="flex items-center gap-1 px-2 h-10">
        <Button variant="ghost" size="sm" className="h-8 text-purple-400 hover:bg-purple-950/30">
          <Activity className="h-4 w-4 mr-2" />
          Dashboard
        </Button>
        <Button variant="ghost" size="sm" className="h-8 text-gray-400 hover:text-purple-400 hover:bg-purple-950/30">
          <Grid className="h-4 w-4 mr-2" />
          Components
        </Button>
        <Button variant="ghost" size="sm" className="h-8 text-gray-400 hover:text-purple-400 hover:bg-purple-950/30">
          <Radio className="h-4 w-4 mr-2" />
          Stations
        </Button>
        <Button variant="ghost" size="sm" className="h-8 text-gray-400 hover:text-purple-400 hover:bg-purple-950/30">
          <Workflow className="h-4 w-4 mr-2" />
          Activity
        </Button>
        <Button variant="ghost" size="sm" className="h-8 text-gray-400 hover:text-purple-400 hover:bg-purple-950/30">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Alerts
        </Button>
        <Button variant="ghost" size="sm" className="h-8 text-gray-400 hover:text-purple-400 hover:bg-purple-950/30">
          <Terminal className="h-4 w-4 mr-2" />
          Terminal
        </Button>
        <Button variant="ghost" size="sm" className="h-8 text-gray-400 hover:text-purple-400 hover:bg-purple-950/30">
          <Map className="h-4 w-4 mr-2" />
          Map
        </Button>
      </div>
    </nav>
  )
}
