import { Badge } from "@/components/ui/badge"

export function RiskLegend() {
  const riskLevels = [
    { level: "Critical", color: "bg-red-500", textColor: "text-red-50", value: "85-100%" },
    { level: "High", color: "bg-orange-500", textColor: "text-orange-50", value: "70-84%" },
    { level: "Moderate", color: "bg-yellow-500", textColor: "text-yellow-50", value: "50-69%" },
    { level: "Low", color: "bg-green-500", textColor: "text-green-50", value: "25-49%" },
    { level: "Minimal", color: "bg-blue-500", textColor: "text-blue-50", value: "0-24%" },
    { level: "Unknown", color: "bg-gray-500", textColor: "text-gray-50", value: "N/A" },
    { level: "Monitored", color: "bg-purple-500", textColor: "text-purple-50", value: "Active" },
    { level: "Historical", color: "bg-indigo-500", textColor: "text-indigo-50", value: "Past" },
    { level: "Predicted", color: "bg-cyan-500", textColor: "text-cyan-50", value: "Future" },
  ]

  return (
    <>
      <h3 className="text-xs font-medium text-cyan-400 mb-2">Risk Legend</h3>
      <div className="grid grid-cols-3 gap-2">
        {riskLevels.map((risk) => (
          <div key={risk.level} className="flex flex-col items-center">
            <Badge className={`${risk.color} ${risk.textColor} text-[10px] mb-1 w-full justify-center`}>
              {risk.level}
            </Badge>
            <span className="text-[9px] text-gray-300">{risk.value}</span>
          </div>
        ))}
      </div>
    </>
  )
}
