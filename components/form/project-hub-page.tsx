"use client"

import Link from "next/link"
import { useEffect, useMemo } from "react"
import { ArrowLeft, FileText, Presentation } from "lucide-react"

import { useDocumentationForm } from "@/components/form/documentation-form-provider"
import { Button, buttonVariants } from "@/components/ui/button"
import { buildPresentationOpenUrl, getPresentationAppUrl } from "@/lib/presentation-app-url"
import { recordPresentationOpen } from "@/lib/presentation-history"
import { cn } from "@/lib/utils"

interface ProjectHubPageProps {
  projectId: string
}

export function ProjectHubPage({ projectId }: ProjectHubPageProps) {
  const { projects, activeProjectId, selectProject } = useDocumentationForm()

  useEffect(() => {
    if (activeProjectId === projectId) return
    if (!projects.some((project) => project.id === projectId)) return
    selectProject(projectId)
  }, [activeProjectId, projectId, projects, selectProject])

  const project = useMemo(
    () => projects.find((item) => item.id === projectId) ?? null,
    [projects, projectId]
  )

  const presentationBaseUrl = useMemo(() => getPresentationAppUrl(), [])
  const canOpenPresentation = Boolean(presentationBaseUrl)

  function handleOpenPresentation() {
    if (!project || !presentationBaseUrl) return
    const url = buildPresentationOpenUrl({
      externalProjectId: projectId,
      projectName: project.name,
    })
    if (!url) return
    window.open(url, "_blank", "noopener,noreferrer")
    recordPresentationOpen({
      projectId,
      projectName: project.name,
      baseUrl: presentationBaseUrl,
    })
  }

  if (!project) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-4 px-4 py-8">
        <p className="text-sm text-muted-foreground">
          Das angeforderte Projekt wurde nicht gefunden.
        </p>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          Zurück zum Dashboard
        </Link>
      </div>
    )
  }

  if (activeProjectId !== projectId) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-8 text-sm text-muted-foreground">
        Projekt wird geladen...
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8">
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Dashboard
        </Link>
      </div>

      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">{project.name}</h1>
        <p className="text-sm text-muted-foreground">
          Wähle, ob du die Dokumentation bearbeiten oder die Präsentations-App öffnen möchtest.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="h-5 w-5" />
          </div>
          <h2 className="font-medium tracking-tight">Dokumentation</h2>
          <p className="mt-1 flex-1 text-sm text-muted-foreground">
            Strukturierte Sektionen, Vorschau und PDF-Export.
          </p>
          <Link
            href={`/project/${projectId}/documentation`}
            className={cn(buttonVariants(), "mt-4 w-full sm:w-auto")}
          >
            Bearbeiten
          </Link>
        </div>

        <div className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Presentation className="h-5 w-5" />
          </div>
          <h2 className="font-medium tracking-tight">Präsentation</h2>
          <p className="mt-1 flex-1 text-sm text-muted-foreground">
            Öffnet die externe Präsentations-App in einem neuen Tab (presentation-ai).
          </p>
          {!canOpenPresentation ? (
            <p className="mt-4 text-xs text-muted-foreground">
              Setze <code className="rounded bg-muted px-1 py-0.5">NEXT_PUBLIC_PRESENTATION_APP_URL</code> in
              der <code className="rounded bg-muted px-1 py-0.5">.env</code>, z. B.{" "}
              <code className="rounded bg-muted px-1 py-0.5">http://localhost:3001</code>.
            </p>
          ) : null}
          <Button
            type="button"
            variant="secondary"
            className="mt-4 w-full sm:w-auto"
            disabled={!canOpenPresentation}
            onClick={handleOpenPresentation}
          >
            Präsentation öffnen
          </Button>
        </div>
      </div>
    </div>
  )
}
