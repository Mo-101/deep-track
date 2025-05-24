"use client"

import { Brain, Activity, Code, Database, Server } from "lucide-react"

export function SystemComponents() {
  const components = [
    {
      name: "Deepseek R1 7B",
      version: "v1.2.0",
      type: "AI Model",
      icon: Brain,
      performance: 94,
      status: "ONLINE",
    },
    {
      name: "Agent-MNTRK",
      version: "v3.5.2",
      type: "Monitoring System",
      icon: Activity,
      performance: 92,
      status: "ONLINE",
    },
    {
      name: "API-MNTRK",
      version: "v2.1.4",
      type: "Data Exchange",
      icon: Code,
      performance: 98,
      status: "ONLINE",
    },
    {
      name: "Supabase",
      version: "v2.8.0",
      type: "Primary Database",
      icon: Database,
      performance: 96,
      status: "ONLINE",
    },
    {
      name: "Postgres",
      version: "v15.2",
      type: "Fallback Database",
      icon: Server,
      performance: 95,
      status: "ONLINE",
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Server className="h-4 w-4 text-purple-400" />
          <span className="text-sm font-mono text-purple-400">SYSTEM COMPONENTS</span>
        </div>
        <span className="text-xs text-green-400 bg-green-500/20 px-2 py-0.5 rounded">ALL ONLINE</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {components.map((component) => (
          <div key={component.name} className="bg-purple-950/20 rounded-lg p-4 flex flex-col gap-2">
            <div className="flex items-start justify-between">
              <component.icon className="h-6 w-6 text-purple-400" />
              <div className="h-2 w-2 rounded-full bg-green-500" />
            </div>

            <div>
              <div className="text-sm font-medium text-purple-300">{component.name}</div>
              <div className="text-xs text-gray-400">{component.type}</div>
            </div>

            <div className="mt-auto">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Performance</span>
                <span className="text-purple-400">{component.performance}%</span>
              </div>
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-400 rounded-full" style={{ width: `${component.performance}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
