"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react"

import { useDocumentationForm } from "@/components/form/documentation-form-provider"
import { Button, buttonVariants } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { buildPresentationOpenUrl, getPresentationAppUrl } from "@/lib/presentation-app-url"
import {
  loadPresentationHistory,
  type PresentationOpenRecord,
} from "@/lib/presentation-history"
import { cn } from "@/lib/utils"

export function ProjectDashboard() {
  const { projects, activeProjectId, selectProject, renameProject, deleteProject } =
    useDocumentationForm()
  const router = useRouter()
  const [presentationTab, setPresentationTab] = useState<"documentation" | "presentation">(
    "documentation"
  )
  const [presentationHistory, setPresentationHistory] = useState<PresentationOpenRecord[]>([])

  const presentationBaseUrl = getPresentationAppUrl()
  const canOpenPresentation = Boolean(presentationBaseUrl)

  function handleEditProject(projectId: string) {
    selectProject(projectId)
    router.push(`/project/${projectId}`)
  }

  function handleRenameProject(projectId: string, currentName: string) {
    if (typeof window === "undefined") return
    const nextName = window.prompt("Neuer Projektname", currentName)
    if (!nextName || nextName.trim() === currentName.trim()) return
    renameProject(projectId, nextName)
  }

  function handleDeleteProject(projectId: string, projectName: string) {
    if (typeof window === "undefined") return
    const isConfirmed = window.confirm(`Projekt "${projectName}" wirklich löschen?`)
    if (!isConfirmed) return
    deleteProject(projectId)
  }

  function handleOpenPresentationApp() {
    if (!presentationBaseUrl) return
    const url = buildPresentationOpenUrl({}) ?? presentationBaseUrl
    window.open(url, "_blank", "noopener,noreferrer")
  }

  function handleReopenFromHistory(row: PresentationOpenRecord) {
    const url = buildPresentationOpenUrl({
      externalProjectId: row.projectId,
      projectName: row.projectName,
    })
    if (!url) return
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 px-4 py-6">
      <div className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">Projekt-Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Dokumentation und Präsentation – getrennte Bereiche, ein Überblick.
          </p>
        </div>
        <Link href="/project/new" className={cn(buttonVariants())}>
          <Plus className="mr-2 h-4 w-4" />
          Neues Projekt
        </Link>
      </div>

      <Tabs
        value={presentationTab}
        onValueChange={(value) => {
          if (value !== "documentation" && value !== "presentation") return
          setPresentationTab(value)
          if (value === "presentation") setPresentationHistory(loadPresentationHistory())
        }}
      >
        <TabsList aria-label="Bereich wählen">
          <TabsTrigger value="documentation">Dokumentation</TabsTrigger>
          <TabsTrigger value="presentation">Präsentation</TabsTrigger>
        </TabsList>

        <TabsContent value="documentation" className="space-y-4">
          {projects.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
              Noch keine Projekte vorhanden.{" "}
              <Link
                href="/project/new"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Erstes Projekt anlegen
              </Link>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => {
                const isActive = project.id === activeProjectId
                return (
                  <div
                    key={project.id}
                    className={cn(
                      "space-y-3 rounded-xl border p-4 shadow-sm",
                      isActive ? "border-primary bg-primary/5" : "border-border bg-card"
                    )}
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-semibold tracking-tight">{project.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Erstellt: {new Date(project.created_at).toLocaleDateString("de-DE")}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" size="sm" onClick={() => handleEditProject(project.id)}>
                        Öffnen
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleRenameProject(project.id, project.name)}
                      >
                        <Pencil className="mr-1 h-3.5 w-3.5" />
                        Umbenennen
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteProject(project.id, project.name)}
                      >
                        <Trash2 className="mr-1 h-3.5 w-3.5" />
                        Löschen
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="presentation" className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="text-sm font-medium tracking-tight">Präsentations-Generator</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Die App{" "}
              <a
                href="https://github.com/allweonedev/presentation-ai"
                className="text-primary underline-offset-4 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                presentation-ai
              </a>{" "}
              läuft separat (eigener Dev-Server oder Hosting). Hier startest du sie in einem neuen Tab.
            </p>
            {!canOpenPresentation ? (
              <p className="mt-3 text-xs text-muted-foreground">
                Setze{" "}
                <code className="rounded bg-muted px-1 py-0.5">NEXT_PUBLIC_PRESENTATION_APP_URL</code>{" "}
                (z. B. <code className="rounded bg-muted px-1 py-0.5">http://localhost:3001</code>).
              </p>
            ) : null}
            <Button
              type="button"
              className="mt-4"
              disabled={!canOpenPresentation}
              onClick={handleOpenPresentationApp}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Präsentations-App öffnen
            </Button>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <h3 className="text-sm font-medium tracking-tight">Zuletzt aus Projekten geöffnet</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Einträge entstehen, wenn du im Projekthub „Präsentation öffnen“ nutzt (lokal in diesem
              Browser).
            </p>
            {presentationHistory.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">Noch keine Einträge.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {presentationHistory.map((row) => (
                  <li
                    key={`${row.projectId}-${row.openedAt}`}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3 text-sm"
                  >
                    <div>
                      <p className="font-medium">{row.projectName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(row.openedAt).toLocaleString("de-DE")} · {row.baseUrl}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/project/${row.projectId}`}
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                      >
                        Zum Projekt
                      </Link>
                      <Button
                        type="button"
                        size="sm"
                        disabled={!canOpenPresentation}
                        onClick={() => handleReopenFromHistory(row)}
                      >
                        App erneut öffnen
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
