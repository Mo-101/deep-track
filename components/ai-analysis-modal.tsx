"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, ArrowRight, Check, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

type AnalysisStep = {
  name: string
  status: "pending" | "processing" | "completed"
  result?: string
}

type Props = {
  onClose: () => void
}

export function AIAnalysisModal({ onClose }: Props) {
  const [steps, setSteps] = useState<AnalysisStep[]>([
    { name: "Weather data analysis", status: "pending" },
    { name: "Population density mapping", status: "pending" },
    { name: "Historical pattern correlation", status: "pending" },
    { name: "Risk factor calculation", status: "pending" },
    { name: "Predictive modeling", status: "pending" },
  ])
  const [currentStep, setCurrentStep] = useState(0)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [analysisResult, setAnalysisResult] = useState("")
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const runAnalysis = async () => {
      // Simulate the analysis process
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i)

        // Update current step to processing
        setSteps((prev) => prev.map((step, idx) => (idx === i ? { ...step, status: "processing" } : step)))

        // Simulate processing time
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Generate a result for this step
        let stepResult = ""
        switch (i) {
          case 0:
            stepResult =
              "Detected increased humidity (78%) and temperature patterns consistent with rodent habitat expansion."
            break
          case 1:
            stepResult = "Identified 3 high-density clusters in Lagos and Ibadan regions with 72% confidence."
            break
          case 2:
            stepResult = "Correlation coefficient of 0.83 between current patterns and historical outbreaks."
            break
          case 3:
            stepResult = "Combined risk factors indicate 68% probability of increased transmission in next 30 days."
            break
          case 4:
            stepResult =
              "Predictive model suggests focusing preventive measures in Lagos, Ibadan, and surrounding areas."
            break
        }

        // Update step to completed with result
        setSteps((prev) =>
          prev.map((step, idx) => (idx === i ? { ...step, status: "completed", result: stepResult } : step)),
        )

        // Update progress
        setProgress(((i + 1) / steps.length) * 100)
      }

      // Set final analysis result
      setAnalysisResult(
        "Based on DeepSeek AI analysis of current weather patterns, rodent population density, and historical data, there is a significant risk (68% probability) of increased Lassa fever transmission in the Lagos and Ibadan regions over the next 30 days. Preventive measures should be prioritized in these areas, with particular focus on communities near identified rodent population clusters. Recommend increased surveillance and public health messaging.",
      )

      setAnalysisComplete(true)
    }

    runAnalysis()
  }, [])

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-yellow-500/30 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2 text-yellow-400">
            <AlertTriangle className="h-5 w-5" />
            DeepSeek AI Risk Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Analysis Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" indicatorClassName="bg-yellow-500" />
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  step.status === "pending"
                    ? "border-gray-700 bg-gray-800/50"
                    : step.status === "processing"
                      ? "border-yellow-500/50 bg-yellow-950/20"
                      : "border-green-500/50 bg-green-950/20"
                }`}
              >
                <div className="flex items-center gap-2">
                  {step.status === "pending" && (
                    <div className="h-5 w-5 rounded-full border border-gray-600 flex items-center justify-center">
                      <span className="text-xs text-gray-400">{index + 1}</span>
                    </div>
                  )}
                  {step.status === "processing" && <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />}
                  {step.status === "completed" && (
                    <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="h-3 w-3 text-black" />
                    </div>
                  )}

                  <h3
                    className={`text-sm font-medium ${
                      step.status === "pending"
                        ? "text-gray-400"
                        : step.status === "processing"
                          ? "text-yellow-400"
                          : "text-green-400"
                    }`}
                  >
                    {step.name}
                  </h3>
                </div>

                {step.result && <div className="mt-2 ml-7 text-sm text-gray-300">{step.result}</div>}
              </div>
            ))}
          </div>

          {analysisComplete && (
            <div className="mt-6 p-4 border border-yellow-500/30 bg-yellow-950/10 rounded-lg">
              <h3 className="text-sm font-medium text-yellow-400 mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Analysis Conclusion
              </h3>
              <p className="text-sm text-gray-300">{analysisResult}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white"
            onClick={onClose}
          >
            Close
          </Button>
          {analysisComplete && (
            <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
              View Detailed Report
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
