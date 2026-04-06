/**
 * Basis-URL der optional separat betriebenen presentation-ai-Instanz (Next.js-App).
 * Client: NEXT_PUBLIC_* wird beim Build eingebettet.
 */
export function getPresentationAppUrl(): string | null {
  const raw =
    typeof process !== "undefined" ? process.env.NEXT_PUBLIC_PRESENTATION_APP_URL : undefined
  const trimmed = raw?.trim() ?? ""
  if (!trimmed) return null
  try {
    const parsed = new URL(trimmed)
    if (!parsed.protocol.startsWith("http")) return null
    const path = parsed.pathname.replace(/\/$/, "")
    return `${parsed.origin}${path === "/" ? "" : path}`
  } catch {
    return null
  }
}

export function buildPresentationOpenUrl(options: {
  externalProjectId?: string
  projectName?: string
}): string | null {
  const base = getPresentationAppUrl()
  if (!base) return null
  const url = new URL(base)
  if (options.externalProjectId)
    url.searchParams.set("external_project_id", options.externalProjectId)
  if (options.projectName) url.searchParams.set("project_name", options.projectName)
  return url.toString()
}
