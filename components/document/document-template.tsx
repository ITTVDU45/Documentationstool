import type { DisplayTemplateId } from "@/lib/display-templates"
import type { SectionId } from "@/lib/section-ids"
import { sectionsMeta } from "@/lib/sections-meta"
import type { ProjectDocumentationInput } from "@/lib/validation/project-documentation-schema"

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function normalizeValue(value: unknown): string {
  if (typeof value === "string") return value
  if (typeof value === "number" || typeof value === "boolean") return String(value)
  if (Array.isArray(value)) return value.map((item) => normalizeValue(item)).join(", ")
  if (value && typeof value === "object") return JSON.stringify(value)
  return ""
}

function getSectionRows(sectionId: SectionId, data: ProjectDocumentationInput) {
  const sectionData = data[sectionId]
  return Object.entries(sectionData as Record<string, unknown>)
    .filter(([key]) => !key.endsWith("_data_url"))
    .map(([key, value]) => ({
      label: key.replace(/_/g, " "),
      value: normalizeValue(value),
    }))
}

function renderRowsAsCards(rows: Array<{ label: string; value: string }>) {
  return rows
    .map(
      (row) => `
      <div class="field">
        <h3>${escapeHtml(row.label)}</h3>
        <p>${escapeHtml(row.value || "-").replace(/\n/g, "<br/>")}</p>
      </div>
    `
    )
    .join("")
}

function renderTemplateSectionHtml({
  templateId,
  rows,
  image1,
  image2,
}: {
  templateId: DisplayTemplateId
  rows: Array<{ label: string; value: string }>
  image1: string
  image2: string
}) {
  const bullets = rows
    .filter((row) => row.value.trim().length > 0)
    .slice(0, 8)
    .map((row) => `<li>${escapeHtml(`${row.label}: ${row.value}`)}</li>`)
    .join("")

  if (templateId === "grid-2-image-left-text-right")
    return `<div class="template grid2">${image1 ? `<img class="img" src="${escapeHtml(image1)}" alt="section image"/>` : ""}<div class="field-grid">${renderRowsAsCards(rows)}</div></div>`

  if (templateId === "grid-2-text-left-image-right")
    return `<div class="template grid2"><div class="field-grid">${renderRowsAsCards(rows)}</div>${image1 ? `<img class="img" src="${escapeHtml(image1)}" alt="section image"/>` : ""}</div>`

  if (templateId === "text-bullet-points")
    return `<ul class="bullets">${bullets || "<li>-</li>"}</ul>`

  if (templateId === "background-image-overlay-text")
    return `<div class="bg-overlay">${image1 ? `<img class="bg-image" src="${escapeHtml(image1)}" alt="background"/>` : ""}<div class="overlay"><ul class="bullets">${bullets || "<li>-</li>"}</ul></div></div>`

  if (templateId === "hero-image-title-subtitle")
    return `${image1 ? `<img class="hero-image" src="${escapeHtml(image1)}" alt="hero"/>` : ""}<div class="field-grid">${renderRowsAsCards(rows)}</div>`

  if (templateId === "two-image-gallery-with-text")
    return `<div class="gallery">${image1 ? `<img class="img" src="${escapeHtml(image1)}" alt="image 1"/>` : ""}${image2 ? `<img class="img" src="${escapeHtml(image2)}" alt="image 2"/>` : ""}</div><div class="field-grid">${renderRowsAsCards(rows)}</div>`

  if (templateId === "timeline-steps")
    return `<ol class="timeline">${bullets || "<li>-</li>"}</ol>`

  if (templateId === "stats-cards-with-summary")
    return `<div class="stats-grid">${renderRowsAsCards(rows)}</div>`

  if (templateId === "feature-list-with-icons")
    return `<ul class="feature-list">${bullets ? bullets.replaceAll("<li>", "<li>◆ ") : "<li>-</li>"}</ul>`

  return `<blockquote class="quote">${escapeHtml(rows[0]?.value || "-")}</blockquote><ul class="bullets">${bullets || "<li>-</li>"}</ul>`
}

function renderBannerImage(dataUrl: string) {
  if (!dataUrl || !dataUrl.startsWith("data:image/")) return ""
  return `
    <div class="banner-wrapper">
      <img class="banner-image" src="${escapeHtml(dataUrl)}" alt="Project banner" />
    </div>
  `
}

export function getDocumentTemplateHtml(data: ProjectDocumentationInput) {
  const sectionsHtml = sectionsMeta
    .map((section) => {
      const presentation = data.section_presentations[section.id]
      const rows = getSectionRows(section.id, data)
      return `
      <section>
        <h2>${escapeHtml(section.title)}</h2>
        <p class="section-description">${escapeHtml(section.description)}</p>
        ${renderTemplateSectionHtml({
          templateId: presentation.template,
          rows,
          image1: presentation.image_1_data_url,
          image2: presentation.image_2_data_url,
        })}
      </section>
      `
    })
    .join("")

  return `
    <article class="doc">
      <header class="hero">
        ${renderBannerImage(data.project_overview.banner_image_data_url)}
        <h1>${escapeHtml(data.project_overview.project_name || "Project Documentation")}</h1>
        <p>${escapeHtml(data.project_overview.short_description || "No description provided.")}</p>
      </header>
      ${sectionsHtml}
    </article>
  `
}
