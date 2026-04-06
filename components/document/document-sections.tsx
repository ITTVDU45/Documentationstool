"use client"

import Image from "next/image"

import { displayTemplates, type DisplayTemplateId } from "@/lib/display-templates"
import type { SectionId } from "@/lib/section-ids"
import { sectionsMeta } from "@/lib/sections-meta"
import type { ProjectDocumentationInput } from "@/lib/validation/project-documentation-schema"

interface DocumentSectionsProps {
  data: ProjectDocumentationInput
}

interface SectionRenderInput {
  title: string
  rows: Array<{ label: string; value: string }>
  image1: string
  image2: string
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
  const sourceEntries = Object.entries(sectionData as Record<string, unknown>).filter(
    ([key]) => !key.endsWith("_data_url")
  )
  return sourceEntries.map(([key, value]) => ({
    label: key.replace(/_/g, " "),
    value: normalizeValue(value),
  }))
}

function getTemplateRowsAsBullets(rows: Array<{ label: string; value: string }>) {
  return rows
    .filter((row) => row.value.trim().length > 0)
    .slice(0, 8)
    .map((row) => `${row.label}: ${row.value}`)
}

function SectionTemplateView({
  templateId,
  section,
}: {
  templateId: DisplayTemplateId
  section: SectionRenderInput
}) {
  const bulletPoints = getTemplateRowsAsBullets(section.rows)
  const textBlock = (
    <div className="space-y-3">
      {section.rows.map((row) => (
        <div key={row.label} className="rounded-lg border border-border bg-card p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {row.label}
          </p>
          <p className="mt-1 whitespace-pre-wrap text-sm">{row.value || "-"}</p>
        </div>
      ))}
    </div>
  )

  if (templateId === "grid-2-image-left-text-right")
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {section.image1 ? (
          <Image
            src={section.image1}
            alt={`${section.title} image`}
            width={1200}
            height={700}
            className="h-full min-h-56 w-full rounded-xl border border-border object-cover"
            unoptimized
          />
        ) : null}
        {textBlock}
      </div>
    )

  if (templateId === "grid-2-text-left-image-right")
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {textBlock}
        {section.image1 ? (
          <Image
            src={section.image1}
            alt={`${section.title} image`}
            width={1200}
            height={700}
            className="h-full min-h-56 w-full rounded-xl border border-border object-cover"
            unoptimized
          />
        ) : null}
      </div>
    )

  if (templateId === "text-bullet-points")
    return (
      <ul className="list-disc space-y-2 pl-5 text-sm leading-7">
        {bulletPoints.length > 0 ? bulletPoints.map((item) => <li key={item}>{item}</li>) : <li>-</li>}
      </ul>
    )

  if (templateId === "background-image-overlay-text")
    return (
      <div className="relative overflow-hidden rounded-xl border border-border">
        {section.image1 ? (
          <Image
            src={section.image1}
            alt={`${section.title} background`}
            width={1600}
            height={800}
            className="h-72 w-full object-cover"
            unoptimized
          />
        ) : (
          <div className="h-72 w-full bg-muted" />
        )}
        <div className="absolute inset-0 bg-black/45 p-5 text-white">
          <ul className="list-disc space-y-2 pl-5 text-sm">
            {bulletPoints.length > 0 ? bulletPoints.map((item) => <li key={item}>{item}</li>) : <li>-</li>}
          </ul>
        </div>
      </div>
    )

  if (templateId === "hero-image-title-subtitle")
    return (
      <div className="space-y-4">
        {section.image1 ? (
          <Image
            src={section.image1}
            alt={`${section.title} hero`}
            width={1600}
            height={800}
            className="h-72 w-full rounded-xl border border-border object-cover"
            unoptimized
          />
        ) : null}
        <div className="rounded-xl border border-border p-4">{textBlock}</div>
      </div>
    )

  if (templateId === "two-image-gallery-with-text")
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          {section.image1 ? (
            <Image src={section.image1} alt={`${section.title} image 1`} width={1200} height={700} className="h-52 w-full rounded-xl border border-border object-cover" unoptimized />
          ) : null}
          {section.image2 ? (
            <Image src={section.image2} alt={`${section.title} image 2`} width={1200} height={700} className="h-52 w-full rounded-xl border border-border object-cover" unoptimized />
          ) : null}
        </div>
        {textBlock}
      </div>
    )

  if (templateId === "timeline-steps")
    return (
      <ol className="space-y-3">
        {bulletPoints.length > 0
          ? bulletPoints.map((item, index) => (
              <li key={item} className="rounded-lg border border-border bg-card p-3 text-sm">
                <span className="mr-2 font-semibold text-primary">{index + 1}.</span>
                {item}
              </li>
            ))
          : <li className="rounded-lg border border-border bg-card p-3 text-sm">-</li>}
      </ol>
    )

  if (templateId === "stats-cards-with-summary")
    return (
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {section.rows.map((row) => (
          <div key={row.label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{row.label}</p>
            <p className="mt-2 text-sm font-medium">{row.value || "-"}</p>
          </div>
        ))}
      </div>
    )

  if (templateId === "feature-list-with-icons")
    return (
      <ul className="space-y-2">
        {bulletPoints.length > 0
          ? bulletPoints.map((item) => (
              <li key={item} className="rounded-lg border border-border bg-card p-3 text-sm">
                <span className="mr-2 text-primary">◆</span>
                {item}
              </li>
            ))
          : <li className="rounded-lg border border-border bg-card p-3 text-sm">-</li>}
      </ul>
    )

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-4">
      <blockquote className="border-l-4 border-primary pl-4 text-sm italic">
        {bulletPoints[0] || "-"}
      </blockquote>
      <ul className="list-disc space-y-2 pl-5 text-sm">
        {bulletPoints.slice(1).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

export function DocumentSections({ data }: DocumentSectionsProps) {
  return (
    <div className="space-y-10">
      {sectionsMeta.map((section) => {
        const presentation = data.section_presentations[section.id]
        const renderRows = getSectionRows(section.id, data)
        return (
          <section key={section.id} className="space-y-4 border-b border-border pb-8 last:border-none">
            <header className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">{section.title}</h2>
              <p className="text-sm text-muted-foreground">{section.description}</p>
              <p className="text-xs text-muted-foreground">
                Sektions-Template: {displayTemplates.find((template) => template.id === presentation.template)?.label}
              </p>
            </header>
            <SectionTemplateView
              templateId={presentation.template}
              section={{
                title: section.title,
                rows: renderRows,
                image1: presentation.image_1_data_url,
                image2: presentation.image_2_data_url,
              }}
            />
          </section>
        )
      })}
    </div>
  )
}
