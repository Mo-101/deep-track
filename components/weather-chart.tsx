"use client"

import { Chart, ChartContainer, ChartTooltip, ChartTooltipContent, Line, XAxis, YAxis } from "@/components/ui/chart"

const data = [
  { day: "Mon", temperature: 31, humidity: 78 },
  { day: "Tue", temperature: 32, humidity: 75 },
  { day: "Wed", temperature: 30, humidity: 82 },
  { day: "Thu", temperature: 29, humidity: 85 },
  { day: "Fri", temperature: 30, humidity: 80 },
  { day: "Sat", temperature: 31, humidity: 76 },
  { day: "Sun", temperature: 32, humidity: 72 },
]

export function WeatherChart() {
  return (
    <div className="h-[200px] w-full">
      <ChartContainer data={data} className="h-full">
        <Chart className="h-full">
          <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `${value}°`} />
          <Line
            dataKey="temperature"
            stroke="#06b6d4"
            strokeWidth={2}
            dot={{ fill: "#06b6d4", r: 4 }}
            activeDot={{ fill: "#06b6d4", r: 6, strokeWidth: 2, stroke: "#0e7490" }}
          />
          <Line
            dataKey="humidity"
            stroke="#60a5fa"
            strokeWidth={2}
            dot={{ fill: "#60a5fa", r: 4 }}
            activeDot={{ fill: "#60a5fa", r: 6, strokeWidth: 2, stroke: "#2563eb" }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                className="bg-gray-900/90 border-cyan-500/30 shadow-[0_0_10px_rgba(0,255,255,0.2)]"
                labelClassName="text-cyan-400"
                itemClassName="text-gray-300"
              />
            }
          />
        </Chart>
      </ChartContainer>
    </div>
  )
}
