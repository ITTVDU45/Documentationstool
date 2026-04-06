"use client"

import type { UseFormReturn } from "react-hook-form"

import { SectionShellProvider } from "@/components/form-sections/section-shell"
import { sectionComponentMap } from "@/components/form-sections/sections"
import type { SectionId } from "@/lib/section-ids"
import { sectionsMeta } from "@/lib/sections-meta"
import type { ProjectDocumentationInput } from "@/lib/validation/project-documentation-schema"

interface SectionRendererProps {
  activeSectionId: SectionId
  form: UseFormReturn<ProjectDocumentationInput>
}

export function SectionRenderer({ activeSectionId, form }: SectionRendererProps) {
  const sectionId = (sectionsMeta.find((section) => section.id === activeSectionId)?.id ?? sectionsMeta[0].id) as SectionId
  const SectionComponent = sectionComponentMap[sectionId as keyof typeof sectionComponentMap]
  return (
    <SectionShellProvider sectionId={sectionId} form={form}>
      <SectionComponent form={form} />
    </SectionShellProvider>
  )
}
