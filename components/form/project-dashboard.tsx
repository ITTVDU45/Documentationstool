"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Pencil, Plus, Trash2 } from "lucide-react"

import { useDocumentationForm } from "@/components/form/documentation-form-provider"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ProjectDashboard() {
  const { projects, activeProjectId, selectProject, renameProject, deleteProject } =
    useDocumentationForm()
  const router = useRouter()

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

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 px-4 py-6">
      <div className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">Projekt-Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Wähle ein bestehendes Projekt oder lege ein neues über die Maske an.
          </p>
        </div>
        <Link href="/project/new" className={cn(buttonVariants())}>
          <Plus className="mr-2 h-4 w-4" />
          Neues Projekt
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Noch keine Projekte vorhanden.{" "}
          <Link href="/project/new" className="font-medium text-primary underline-offset-4 hover:underline">
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
                    Bearbeiten
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
    </div>
  )
}
