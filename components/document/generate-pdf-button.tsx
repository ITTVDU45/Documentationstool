"use client"

import { useState } from "react"
import { Download, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { ProjectDocumentationInput } from "@/lib/validation/project-documentation-schema"

interface GeneratePdfButtonProps {
  data: ProjectDocumentationInput
}

function downloadBlob({ blob, fileName }: { blob: Blob; fileName: string }) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

export function GeneratePdfButton({ data }: GeneratePdfButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  async function handleGeneratePdf() {
    setIsLoading(true)
    setErrorMessage("")
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null
        const message = payload?.message ?? "PDF konnte nicht erstellt werden."
        throw new Error(message)
      }

      const blob = await response.blob()
      const fileName = `${(data.project_overview.project_name || "project-documentation").replace(/\s+/g, "-").toLowerCase()}.pdf`
      downloadBlob({ blob, fileName })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unbekannter Fehler bei der PDF-Erstellung."
      setErrorMessage(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <Button type="button" onClick={handleGeneratePdf} disabled={isLoading}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
        PDF generieren
      </Button>
      {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
    </div>
  )
}
