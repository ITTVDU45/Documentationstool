"use client"

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from "react"

import { defaultProjectData } from "@/lib/default-project-data"
import type { ProjectDocumentationInput } from "@/lib/validation/project-documentation-schema"

const STORAGE_KEY = "documentation-tool-projects-v1"
const LEGACY_STORAGE_KEY = "documentation-tool-draft-v1"

interface DocumentationProject {
  id: string
  name: string
  data: ProjectDocumentationInput
  created_at: string
}

interface ProjectStoreState {
  projects: DocumentationProject[]
  active_project_id: string | null
}

interface DocumentationFormContextValue {
  projects: DocumentationProject[]
  activeProjectId: string | null
  data: ProjectDocumentationInput | null
  activeProjectName: string | null
  createProject: (
    projectName: string,
    seedProjectOverview?: Partial<ProjectDocumentationInput["project_overview"]>
  ) => string | null
  selectProject: (projectId: string) => void
  renameProject: (projectId: string, projectName: string) => void
  deleteProject: (projectId: string) => void
  setData: (next: ProjectDocumentationInput) => void
  resetData: () => void
}

const DocumentationFormContext = createContext<DocumentationFormContextValue | null>(null)

interface DocumentationFormProviderProps {
  children: React.ReactNode
}

function subscribeToHydration() {
  return () => {}
}

function useIsHydrated() {
  return useSyncExternalStore(subscribeToHydration, () => true, () => false)
}

function generateProjectId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID()
  return `project-${Date.now()}`
}

function getDraftWithoutHeavyImages(next: ProjectDocumentationInput): ProjectDocumentationInput {
  const cleanedSectionPresentations = Object.fromEntries(
    Object.entries(next.section_presentations).map(([sectionId, presentation]) => [
      sectionId,
      {
        ...presentation,
        image_1_data_url: "",
        image_2_data_url: "",
      },
    ])
  ) as ProjectDocumentationInput["section_presentations"]

  return {
    ...next,
    project_overview: {
      ...next.project_overview,
      banner_image_data_url: "",
    },
    section_presentations: cleanedSectionPresentations,
  }
}

function getStateWithoutHeavyImages(state: ProjectStoreState): ProjectStoreState {
  return {
    ...state,
    projects: state.projects.map((project) => ({
      ...project,
      data: getDraftWithoutHeavyImages(project.data),
    })),
  }
}

function persistStoreSafely(nextState: ProjectStoreState) {
  if (typeof window === "undefined") return

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState))
    return
  } catch (error) {
    const isQuotaError =
      error instanceof DOMException && error.name === "QuotaExceededError"
    if (!isQuotaError) return
  }

  try {
    const reducedState = getStateWithoutHeavyImages(nextState)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reducedState))
    console.warn(
      "Draft war zu groß für localStorage. Bilder wurden aus den gespeicherten Entwürfen entfernt."
    )
  } catch {
    console.warn("Draft konnte nicht in localStorage gespeichert werden.")
  }
}

function getDefaultState(): ProjectStoreState {
  return {
    projects: [],
    active_project_id: null,
  }
}

function normalizeProjectData(input: Partial<ProjectDocumentationInput> | undefined): ProjectDocumentationInput {
  if (!input) return structuredClone(defaultProjectData)
  return {
    ...structuredClone(defaultProjectData),
    ...input,
    project_overview: {
      ...structuredClone(defaultProjectData.project_overview),
      ...(input.project_overview ?? {}),
    },
    section_presentations: {
      ...structuredClone(defaultProjectData.section_presentations),
      ...(input.section_presentations ?? {}),
    },
  }
}

function loadInitialState(): ProjectStoreState {
  if (typeof window === "undefined") return getDefaultState()

  try {
    const storedState = window.localStorage.getItem(STORAGE_KEY)
    if (storedState) {
      const parsedState = JSON.parse(storedState) as ProjectStoreState
      if (Array.isArray(parsedState.projects)) {
        return {
          ...parsedState,
          projects: parsedState.projects.map((project) => ({
            ...project,
            data: normalizeProjectData(project.data),
          })),
        }
      }
    }
  } catch {
    return getDefaultState()
  }

  // migration for old single-project draft
  try {
    const legacyDraft = window.localStorage.getItem(LEGACY_STORAGE_KEY)
    if (!legacyDraft) return getDefaultState()
    const parsedLegacyDraft = JSON.parse(legacyDraft) as ProjectDocumentationInput
    const migratedProject: DocumentationProject = {
      id: generateProjectId(),
      name: "Migriertes Projekt",
      data: normalizeProjectData(parsedLegacyDraft),
      created_at: new Date().toISOString(),
    }
    return {
      projects: [migratedProject],
      active_project_id: migratedProject.id,
    }
  } catch {
    return getDefaultState()
  }
}

export function DocumentationFormProvider({ children }: DocumentationFormProviderProps) {
  const isHydrated = useIsHydrated()
  const [storeState, setStoreState] = useState<ProjectStoreState>(loadInitialState)

  const activeProject = useMemo(() => {
    if (!storeState.active_project_id) return null
    return (
      storeState.projects.find((project) => project.id === storeState.active_project_id) ??
      null
    )
  }, [storeState.active_project_id, storeState.projects])

  const createProject = useCallback((
    projectName: string,
    seedProjectOverview?: Partial<ProjectDocumentationInput["project_overview"]>
  ) => {
    const normalizedName = projectName.trim()
    if (!normalizedName) return null

    const createdProject: DocumentationProject = {
      id: generateProjectId(),
      name: normalizedName,
      data: {
        ...structuredClone(defaultProjectData),
        project_overview: {
          ...structuredClone(defaultProjectData.project_overview),
          project_name: normalizedName,
          ...(seedProjectOverview ?? {}),
        },
      },
      created_at: new Date().toISOString(),
    }

    setStoreState((previousState) => {
      const nextState: ProjectStoreState = {
        projects: [...previousState.projects, createdProject],
        active_project_id: createdProject.id,
      }
      persistStoreSafely(nextState)
      return nextState
    })
    return createdProject.id
  }, [])

  const selectProject = useCallback((projectId: string) => {
    setStoreState((previousState) => {
      if (!previousState.projects.some((project) => project.id === projectId)) return previousState
      const nextState: ProjectStoreState = {
        ...previousState,
        active_project_id: projectId,
      }
      persistStoreSafely(nextState)
      return nextState
    })
  }, [])

  const renameProject = useCallback((projectId: string, projectName: string) => {
    const normalizedName = projectName.trim()
    if (!normalizedName) return

    setStoreState((previousState) => {
      if (!previousState.projects.some((project) => project.id === projectId)) return previousState
      const nextProjects = previousState.projects.map((project) =>
        project.id === projectId ? { ...project, name: normalizedName } : project
      )
      const nextState: ProjectStoreState = {
        ...previousState,
        projects: nextProjects,
      }
      persistStoreSafely(nextState)
      return nextState
    })
  }, [])

  const deleteProject = useCallback((projectId: string) => {
    setStoreState((previousState) => {
      if (!previousState.projects.some((project) => project.id === projectId)) return previousState
      const nextProjects = previousState.projects.filter((project) => project.id !== projectId)
      const nextActiveId =
        previousState.active_project_id === projectId
          ? (nextProjects[0]?.id ?? null)
          : previousState.active_project_id
      const nextState: ProjectStoreState = {
        projects: nextProjects,
        active_project_id: nextActiveId,
      }
      persistStoreSafely(nextState)
      return nextState
    })
  }, [])

  const setData = useCallback((next: ProjectDocumentationInput) => {
    setStoreState((previousState) => {
      if (!previousState.active_project_id) return previousState
      const nextProjects = previousState.projects.map((project) =>
        project.id === previousState.active_project_id ? { ...project, data: next } : project
      )
      const nextState: ProjectStoreState = {
        ...previousState,
        projects: nextProjects,
      }
      persistStoreSafely(nextState)
      return nextState
    })
  }, [])

  const resetData = useCallback(() => {
    setStoreState((previousState) => {
      if (!previousState.active_project_id) return previousState
      const nextProjects = previousState.projects.map((project) =>
        project.id === previousState.active_project_id
          ? { ...project, data: structuredClone(defaultProjectData) }
          : project
      )
      const nextState: ProjectStoreState = {
        ...previousState,
        projects: nextProjects,
      }
      persistStoreSafely(nextState)
      return nextState
    })
  }, [])

  const value = useMemo(
    () => ({
      projects: storeState.projects,
      activeProjectId: storeState.active_project_id,
      data: activeProject?.data ?? null,
      activeProjectName: activeProject?.name ?? null,
      createProject,
      selectProject,
      renameProject,
      deleteProject,
      setData,
      resetData,
    }),
    [activeProject?.data, activeProject?.name, createProject, deleteProject, renameProject, resetData, selectProject, setData, storeState.active_project_id, storeState.projects]
  )

  return (
    <DocumentationFormContext.Provider value={value}>
      {isHydrated ? children : null}
    </DocumentationFormContext.Provider>
  )
}

export function useDocumentationForm() {
  const context = useContext(DocumentationFormContext)
  if (!context) throw new Error("useDocumentationForm muss innerhalb von DocumentationFormProvider verwendet werden")
  return context
}
