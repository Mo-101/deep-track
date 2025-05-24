"use client"

import { Chart, ChartContainer, ChartTooltip, ChartTooltipContent, Area, AreaChart, XAxis } from "@/components/ui/chart"

const data = [
  { month: "Jan", risk: 45 },
  { month: "Feb", risk: 52 },
  { month: "Mar", risk: 48 },
  { month: "Apr", risk: 61 },
  { month: "May", risk: 55 },
  { month: "Jun", risk: 67 },
  { month: "Jul", risk: 68 },
]

export function RiskChart() {
  return (
    <div className="h-[100px] w-full">
      <ChartContainer data={data} className="h-full">
        <Chart className="h-full">
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={false} />
          <AreaChart>
            <Area
              dataKey="risk"
              fill="url(#colorRisk)"
              stroke="#eab308"
              strokeWidth={2}
              activeDot={{ fill: "#eab308", r: 4, strokeWidth: 2, stroke: "#854d0e" }}
            />
            <defs>
              <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
              </linearGradient>
            </defs>
          </AreaChart>
          <ChartTooltip
            content={
              <ChartTooltipContent
                className="bg-gray-900/90 border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.2)]"
                labelClassName="text-yellow-400"
                itemClassName="text-gray-300"
              />
            }
          />
        </Chart>
      </ChartContainer>
    </div>
  )
}
