"use client"

import Link from "next/link"
import { useEffect } from "react"

import { ProjectDocumentationForm } from "@/components/form/project-documentation-form"
import { useDocumentationForm } from "@/components/form/documentation-form-provider"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ProjectDetailPageProps {
  projectId: string
}

export function ProjectDetailPage({ projectId }: ProjectDetailPageProps) {
  const { projects, activeProjectId, selectProject } = useDocumentationForm()

  useEffect(() => {
    if (activeProjectId === projectId) return
    if (!projects.some((project) => project.id === projectId)) return
    selectProject(projectId)
  }, [activeProjectId, projectId, projects, selectProject])

  const hasProject = projects.some((project) => project.id === projectId)
  if (!hasProject) {
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
    <div className="mx-auto w-full max-w-[1600px] px-2 py-4 sm:px-4">
      <ProjectDocumentationForm />
    </div>
  )
}
