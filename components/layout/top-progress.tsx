"use client"

import { Progress } from "@/components/ui/progress"

interface TopProgressProps {
  value: number
  completedSections: number
  totalSections: number
}

export function TopProgress({ value, completedSections, totalSections }: TopProgressProps) {
  return (
    <div className="space-y-2 rounded-xl border border-border/80 bg-card/95 p-4 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Dokumentations-Fortschritt</span>
        <span className="text-muted-foreground">
          {completedSections} / {totalSections} Sektionen
        </span>
      </div>
      <Progress value={value} />
    </div>
  )
}
