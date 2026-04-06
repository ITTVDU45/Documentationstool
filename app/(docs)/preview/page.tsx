"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { DocumentPreview } from "@/components/document/document-preview"
import { GeneratePdfButton } from "@/components/document/generate-pdf-button"
import { useDocumentationForm } from "@/components/form/documentation-form-provider"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function PreviewPage() {
  const { data, activeProjectId } = useDocumentationForm()
  const backToFormHref = activeProjectId ? `/project/${activeProjectId}` : "/"

  if (!data) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-4 px-4 py-8">
        <p className="text-sm text-muted-foreground">
          Kein aktives Projekt vorhanden. Bitte zuerst ein Projekt anlegen.
        </p>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück zum Projekt-Setup
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link href={backToFormHref} className={cn(buttonVariants({ variant: "outline" }))}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück zum Formular
        </Link>
        <GeneratePdfButton data={data} />
      </div>
      <DocumentPreview data={data} />
    </div>
  )
}
