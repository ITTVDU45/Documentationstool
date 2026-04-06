export interface PresentationOpenRecord {
  projectId: string
  projectName: string
  openedAt: string
  baseUrl: string
}

const STORAGE_KEY = "documentation-tool-presentation-opens-v1"
const MAX_ENTRIES = 20

function isBrowser() {
  return typeof window !== "undefined"
}

export function loadPresentationHistory(): PresentationOpenRecord[] {
  if (!isBrowser()) return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is PresentationOpenRecord =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as PresentationOpenRecord).projectId === "string" &&
        typeof (item as PresentationOpenRecord).projectName === "string" &&
        typeof (item as PresentationOpenRecord).openedAt === "string" &&
        typeof (item as PresentationOpenRecord).baseUrl === "string"
    )
  } catch {
    return []
  }
}

export function recordPresentationOpen(entry: {
  projectId: string
  projectName: string
  baseUrl: string
}) {
  if (!isBrowser()) return
  const openedAt = new Date().toISOString()
  const previous = loadPresentationHistory().filter((row) => row.projectId !== entry.projectId)
  const next: PresentationOpenRecord[] = [
    { ...entry, openedAt },
    ...previous,
  ].slice(0, MAX_ENTRIES)
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    /* ignore quota */
  }
}

export function clearPresentationHistory() {
  if (!isBrowser()) return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}
