"use client"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipBack, Clock } from "lucide-react"

interface TimelineControlProps {
  startDate: Date
  endDate: Date
  currentDate: Date
  onDateChange: (date: Date) => void
  playing: boolean
  onPlayPause: () => void
  onReset: () => void
  playbackSpeed: number
  onSpeedChange: (speed: number) => void
}

export function TimelineControl({
  startDate,
  endDate,
  currentDate,
  onDateChange,
  playing,
  onPlayPause,
  onReset,
  playbackSpeed,
  onSpeedChange,
}: TimelineControlProps) {
  const totalRange = endDate.getTime() - startDate.getTime()
  const currentPosition = currentDate.getTime() - startDate.getTime()
  const percentage = (currentPosition / totalRange) * 100

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    const newPosition = (value[0] / 100) * totalRange
    const newDate = new Date(startDate.getTime() + newPosition)
    onDateChange(newDate)
  }

  // Handle speed change
  const handleSpeedChange = () => {
    const speeds = [1, 2, 5, 10]
    const currentIndex = speeds.indexOf(playbackSpeed)
    const nextIndex = (currentIndex + 1) % speeds.length
    onSpeedChange(speeds[nextIndex])
  }

  return (
    <div className="bg-black/60 backdrop-blur-md border border-cyan-500/30 rounded-lg p-3 w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Clock className="w-4 h-4 text-cyan-400 mr-1" />
          <span className="text-xs font-medium text-cyan-400">Historical Timeline</span>
        </div>
        <div className="text-xs text-gray-300">{formatDate(currentDate)}</div>
      </div>

      <div className="flex items-center space-x-2 mb-2">
        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6 bg-gray-900/80 border-gray-700 text-white hover:bg-gray-800 hover:text-cyan-400"
          onClick={onReset}
        >
          <SkipBack className="h-3 w-3" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6 bg-gray-900/80 border-gray-700 text-white hover:bg-gray-800 hover:text-cyan-400"
          onClick={onPlayPause}
        >
          {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
        </Button>

        <div className="flex-1">
          <Slider
            defaultValue={[0]}
            value={[percentage]}
            max={100}
            step={0.1}
            onValueChange={handleSliderChange}
            className="h-1.5"
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          className="h-6 px-2 py-0 text-[10px] bg-gray-900/80 border-gray-700 text-white hover:bg-gray-800 hover:text-cyan-400"
          onClick={handleSpeedChange}
        >
          {playbackSpeed}x
        </Button>
      </div>

      <div className="flex justify-between text-[10px] text-gray-400">
        <span>{formatDate(startDate)}</span>
        <span>{formatDate(endDate)}</span>
      </div>
    </div>
  )
}
