"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, ArrowRight, CheckCircle2, FileText, RotateCcw } from "lucide-react"
import { useForm, useWatch } from "react-hook-form"

import { GeneratePdfButton } from "@/components/document/generate-pdf-button"
import { SectionRenderer } from "@/components/form/section-renderer"
import { useDocumentationForm } from "@/components/form/documentation-form-provider"
import { SidebarNavigation } from "@/components/layout/sidebar-navigation"
import { TopProgress } from "@/components/layout/top-progress"
import { Button, buttonVariants } from "@/components/ui/button"
import { defaultProjectData } from "@/lib/default-project-data"
import type { SectionId } from "@/lib/section-ids"
import { cn } from "@/lib/utils"
import { Form } from "@/components/ui/form"
import { sectionsMeta } from "@/lib/sections-meta"
import { projectDocumentationSchema, type ProjectDocumentationInput } from "@/lib/validation/project-documentation-schema"

function getSectionCompletionCount(values: ProjectDocumentationInput) {
  return sectionsMeta.filter((section) => {
    const sectionData = values[section.id as keyof ProjectDocumentationInput]
    return JSON.stringify(sectionData).replace(/[{}\[\]":,]/g, "").trim().length > 0
  }).length
}

export function ProjectDocumentationForm() {
  const {
    activeProjectName,
    data,
    setData,
    resetData,
  } = useDocumentationForm()
  const router = useRouter()
  const [activeSectionId, setActiveSectionId] = useState<SectionId>(sectionsMeta[0].id)

  const form = useForm<ProjectDocumentationInput>({
    resolver: zodResolver(projectDocumentationSchema),
    defaultValues: data ?? defaultProjectData,
    mode: "onBlur",
  })

  const watchedData = useWatch({ control: form.control })
  const dataSignature = useMemo(() => JSON.stringify(data ?? defaultProjectData), [data])
  const watchedSignature = useMemo(
    () => JSON.stringify(watchedData ?? {}),
    [watchedData]
  )
  const lastSyncedSignatureRef = useRef(dataSignature)

  useEffect(() => {
    if (!data) return
    if (lastSyncedSignatureRef.current === dataSignature) return
    form.reset(data)
    lastSyncedSignatureRef.current = dataSignature
  }, [data, dataSignature, form])

  useEffect(() => {
    if (!data) return
    if (!watchedData) return
    if (watchedSignature === lastSyncedSignatureRef.current) return
    lastSyncedSignatureRef.current = watchedSignature
    setData(watchedData as ProjectDocumentationInput)
  }, [data, setData, watchedData, watchedSignature])

  const activeIndex = sectionsMeta.findIndex((section) => section.id === activeSectionId)
  const completionCount = getSectionCompletionCount(form.getValues())
  const progressValue = useMemo(() => (completionCount / sectionsMeta.length) * 100, [completionCount])

  async function goToPrevious() {
    if (activeIndex <= 0) return
    setActiveSectionId(sectionsMeta[activeIndex - 1].id)
  }

  async function goForward() {
    const sectionToValidate = sectionsMeta[activeIndex]?.id
    if (sectionToValidate) {
      const isSectionContentValid = await form.trigger(
        sectionToValidate as keyof ProjectDocumentationInput
      )
      const isSectionDisplayValid = await form.trigger(
        `section_presentations.${sectionToValidate}` as keyof ProjectDocumentationInput
      )
      if (!isSectionContentValid || !isSectionDisplayValid) return
    }
    if (activeIndex >= sectionsMeta.length - 1) {
      router.push("/preview")
      return
    }
    setActiveSectionId(sectionsMeta[activeIndex + 1].id)
  }

  const isLastSection = activeIndex >= sectionsMeta.length - 1

  if (!data) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-4 rounded-xl border border-border bg-card/95 p-6 shadow-sm">
        <h2 className="text-xl font-semibold tracking-tight">Kein Projekt ausgewählt</h2>
        <p className="text-sm text-muted-foreground">
          Bitte wähle zuerst ein Projekt im Dashboard aus.
        </p>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zum Projekt-Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col lg:flex-row">
      <SidebarNavigation activeSectionId={activeSectionId} onSectionSelect={setActiveSectionId} />
      <main className="flex-1 space-y-4 p-4 lg:p-8">
        <div className="rounded-xl border border-border bg-card/95 p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Aktives Projekt</p>
          <p className="mt-1 text-sm font-medium">
            Aktives Projekt: {activeProjectName ?? "Unbenanntes Projekt"}
          </p>
          <Link href="/" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-3 inline-flex")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zur Projektübersicht
          </Link>
        </div>
        <TopProgress value={progressValue} completedSections={completionCount} totalSections={sectionsMeta.length} />
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/preview" className={cn(buttonVariants({ variant: "outline" }))}>
            <FileText className="mr-2 h-4 w-4" />
            Preview öffnen
          </Link>
          <Button type="button" variant="ghost" onClick={resetData}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Draft zurücksetzen
          </Button>
          <GeneratePdfButton data={form.getValues()} />
        </div>
        <Form {...form}>
          <form className="space-y-4">
            <SectionRenderer activeSectionId={activeSectionId} form={form} />
            <div className="flex items-center justify-between rounded-xl border border-border bg-card/95 p-4 shadow-sm backdrop-blur">
              <Button type="button" variant="outline" onClick={goToPrevious} disabled={activeIndex <= 0}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Vorherige Sektion
              </Button>
              <span className="text-sm text-muted-foreground">{sectionsMeta[activeIndex]?.title}</span>
              <Button type="button" onClick={goForward}>
                {isLastSection ? (
                  <>
                    Fertigstellen
                    <CheckCircle2 className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Nächste Sektion
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </main>
    </div>
  )
}
