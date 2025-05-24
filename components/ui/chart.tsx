"use client"

import * as React from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  Tooltip as RechartsTooltip,
  AreaChart as RechartsAreaChart,
  Line as RechartsLine,
  Area as RechartsArea,
} from "recharts"

type ChartContainerProps = {
  children: React.ReactNode
  data: any[]
  className?: string
}

export function ChartContainer({ children, data, className }: ChartContainerProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      {React.cloneElement(children as React.ReactElement, { data })}
    </ResponsiveContainer>
  )
}

type ChartProps = {
  children: React.ReactNode
  data: any[]
  className?: string
}

export function Chart({ children, className }: ChartProps) {
  return <RechartsLineChart className={className}>{children}</RechartsLineChart>
}

export const XAxis = RechartsXAxis
export const YAxis = RechartsYAxis
export const LineChart = RechartsLineChart
export const Line = RechartsLine
export const AreaChart = RechartsAreaChart
export const Area = RechartsArea

type ChartTooltipProps = {
  content: React.ReactNode
}

export function ChartTooltip({ content }: ChartTooltipProps) {
  return <RechartsTooltip content={content} wrapperStyle={{ outline: "none" }} />
}

type ChartTooltipContentProps = React.HTMLAttributes<HTMLDivElement> & {
  labelClassName?: string
  itemClassName?: string
}

export function ChartTooltipContent({ className, labelClassName, itemClassName, ...props }: ChartTooltipContentProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <TooltipContent className={className} {...props} />
        </TooltipTrigger>
      </Tooltip>
    </TooltipProvider>
  )
}
