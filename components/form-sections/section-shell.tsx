"use client"

import Image from "next/image"
import { createContext, useContext, useEffect, useMemo, useRef, useState, type ChangeEvent, type DragEvent, type ReactNode } from "react"
import type { UseFormReturn } from "react-hook-form"
import { ImageIcon } from "lucide-react"

import { displayTemplates, getTemplateMeta, type DisplayTemplateId } from "@/lib/display-templates"
import type { SectionId } from "@/lib/section-ids"
import type { ProjectDocumentationInput } from "@/lib/validation/project-documentation-schema"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SectionShellProviderProps {
  sectionId: SectionId
  form: UseFormReturn<ProjectDocumentationInput>
  children: ReactNode
}

interface SectionShellContextValue {
  sectionId: SectionId
  form: UseFormReturn<ProjectDocumentationInput>
}

const SectionShellContext = createContext<SectionShellContextValue | null>(null)

interface SectionShellProps {
  title: string
  description: string
  templateOptions?: readonly DisplayTemplateId[]
  children: ReactNode
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ""))
    reader.onerror = () => reject(new Error("Bild konnte nicht gelesen werden."))
    reader.readAsDataURL(file)
  })
}

function SectionImageDropzone({
  fieldName,
  label,
}: {
  fieldName: `section_presentations.${SectionId}.image_1_data_url` | `section_presentations.${SectionId}.image_2_data_url`
  label: string
}) {
  const context = useContext(SectionShellContext)
  const [isDragActive, setIsDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  if (!context) return null
  const { form } = context

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                onChange={async (event: ChangeEvent<HTMLInputElement>) => {
                  const file = event.target.files?.[0]
                  if (!file) return
                  if (!file.type.startsWith("image/")) return
                  const dataUrl = await readFileAsDataUrl(file)
                  field.onChange(dataUrl)
                }}
              />
              <div
                role="button"
                tabIndex={0}
                className={`rounded-lg border border-dashed px-3 py-4 text-center text-xs transition ${
                  isDragActive ? "border-primary bg-primary/5" : "border-border bg-muted/30"
                }`}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" && event.key !== " ") return
                  event.preventDefault()
                  fileInputRef.current?.click()
                }}
                onDragOver={(event: DragEvent<HTMLDivElement>) => {
                  event.preventDefault()
                  setIsDragActive(true)
                }}
                onDragLeave={() => setIsDragActive(false)}
                onDrop={async (event: DragEvent<HTMLDivElement>) => {
                  event.preventDefault()
                  setIsDragActive(false)
                  const file = event.dataTransfer.files?.[0]
                  if (!file || !file.type.startsWith("image/")) return
                  const dataUrl = await readFileAsDataUrl(file)
                  field.onChange(dataUrl)
                }}
              >
                <p className="font-medium">Drag & Drop oder klicken</p>
                <p className="mt-1 text-muted-foreground">PNG, JPG, WebP, GIF</p>
              </div>
            </div>
          </FormControl>
          <FormMessage />
          {field.value ? (
            <Button type="button" size="sm" variant="outline" onClick={() => field.onChange("")}>
              Bild entfernen
            </Button>
          ) : null}
        </FormItem>
      )}
    />
  )
}

function SectionDisplayControls({ templateOptions }: { templateOptions?: readonly DisplayTemplateId[] }) {
  const context = useContext(SectionShellContext)
  const sectionId = context?.sectionId ?? "project_overview"
  const form = context?.form
  const templatePath = `section_presentations.${sectionId}.template` as const
  const selectedTemplate = (form?.watch(templatePath) ?? displayTemplates[0].id) as DisplayTemplateId
  const allowedTemplateIds = useMemo(
    () => (templateOptions && templateOptions.length > 0 ? templateOptions : displayTemplates.map((template) => template.id)),
    [templateOptions]
  )
  const availableTemplates = useMemo(
    () => displayTemplates.filter((template) => allowedTemplateIds.includes(template.id)),
    [allowedTemplateIds]
  )
  const fallbackTemplate = availableTemplates[0]?.id ?? displayTemplates[0].id
  const effectiveTemplate = allowedTemplateIds.includes(selectedTemplate) ? selectedTemplate : fallbackTemplate
  const templateMeta = getTemplateMeta(effectiveTemplate)
  const image1Path = `section_presentations.${sectionId}.image_1_data_url` as const
  const image2Path = `section_presentations.${sectionId}.image_2_data_url` as const
  const image1Value = (form?.watch(image1Path) ?? "") as string
  const image2Value = (form?.watch(image2Path) ?? "") as string

  useEffect(() => {
    if (!form) return
    if (allowedTemplateIds.includes(selectedTemplate)) return
    form.setValue(templatePath, fallbackTemplate, { shouldDirty: true, shouldValidate: true })
  }, [allowedTemplateIds, fallbackTemplate, form, selectedTemplate, templatePath])

  if (!context || !form) return null

  return (
    <div className="space-y-3 rounded-lg border border-border/70 bg-muted/30 p-3">
      <FormField
        control={form.control}
        name={templatePath}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Darstellungstyp (Pflicht)</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Darstellung wählen" />
                </SelectTrigger>
                <SelectContent>
                  {availableTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid gap-3 md:grid-cols-2">
        {templateMeta.needsImage1 ? (
          <SectionImageDropzone
            fieldName={`section_presentations.${sectionId}.image_1_data_url`}
            label="Bild 1"
          />
        ) : (
          <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-3 text-xs text-muted-foreground">
            <ImageIcon className="h-4 w-4" />
            Template benötigt kein Bild 1
          </div>
        )}
        {templateMeta.allowsImage2 ? (
          <SectionImageDropzone
            fieldName={`section_presentations.${sectionId}.image_2_data_url`}
            label="Bild 2"
          />
        ) : (
          <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-3 text-xs text-muted-foreground">
            <ImageIcon className="h-4 w-4" />
            Template unterstützt kein Bild 2
          </div>
        )}
      </div>
      <SectionTemplatePreview
        templateId={effectiveTemplate}
        image1={image1Value}
        image2={image2Value}
      />
    </div>
  )
}

function SectionTemplatePreview({
  templateId,
  image1,
  image2,
}: {
  templateId: DisplayTemplateId
  image1: string
  image2: string
}) {
  const hasImage1 = Boolean(image1)
  const hasImage2 = Boolean(image2)

  function renderImage({
    src,
    alt,
    className,
  }: {
    src: string
    alt: string
    className: string
  }) {
    if (!src) return <div className={`${className} bg-muted`} />
    return (
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={700}
        unoptimized
        className={`${className} object-cover`}
      />
    )
  }

  const textMock = (
    <div className="space-y-2 rounded-lg border border-border bg-card p-3 text-xs text-muted-foreground">
      <p className="font-medium text-foreground">Template Vorschau</p>
      <p>Das Bild wird im Dokument entsprechend des gewählten Darstellungstyps positioniert.</p>
    </div>
  )

  let content: ReactNode
  if (templateId === "grid-2-image-left-text-right") {
    content = (
      <div className="grid gap-3 md:grid-cols-2">
        {renderImage({ src: image1, alt: "Template Bild links", className: "h-36 w-full rounded-lg border border-border" })}
        {textMock}
      </div>
    )
  } else if (templateId === "grid-2-text-left-image-right") {
    content = (
      <div className="grid gap-3 md:grid-cols-2">
        {textMock}
        {renderImage({ src: image1, alt: "Template Bild rechts", className: "h-36 w-full rounded-lg border border-border" })}
      </div>
    )
  } else if (templateId === "background-image-overlay-text") {
    content = (
      <div className="relative overflow-hidden rounded-lg border border-border">
        {renderImage({ src: image1, alt: "Background", className: "h-40 w-full" })}
        <div className="absolute inset-0 bg-black/45 p-3 text-xs text-white">
          <p className="font-medium">Overlay Text</p>
        </div>
      </div>
    )
  } else if (templateId === "hero-image-title-subtitle") {
    content = (
      <div className="space-y-3">
        {renderImage({ src: image1, alt: "Hero", className: "h-40 w-full rounded-lg border border-border" })}
        {textMock}
      </div>
    )
  } else if (templateId === "two-image-gallery-with-text") {
    content = (
      <div className="space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          {renderImage({ src: image1, alt: "Galerie Bild 1", className: "h-32 w-full rounded-lg border border-border" })}
          {renderImage({ src: image2, alt: "Galerie Bild 2", className: "h-32 w-full rounded-lg border border-border" })}
        </div>
        {textMock}
      </div>
    )
  } else {
    content = textMock
  }

  return (
    <div className="space-y-2 rounded-lg border border-border bg-background p-3">
      <p className="text-xs font-medium text-muted-foreground">Live-Vorschau im Frontend</p>
      {content}
      {!hasImage1 && !hasImage2 ? (
        <p className="text-xs text-muted-foreground">
          Lade ein Bild hoch, um die template-spezifische Darstellung zu sehen.
        </p>
      ) : null}
    </div>
  )
}

export function SectionShellProvider({ sectionId, form, children }: SectionShellProviderProps) {
  return (
    <SectionShellContext.Provider value={{ sectionId, form }}>
      {children}
    </SectionShellContext.Provider>
  )
}

export function SectionShell({ title, description, templateOptions, children }: SectionShellProps) {
  return (
    <Card className="border-border/80 bg-card/95 shadow-sm backdrop-blur">
      <CardHeader>
        <CardTitle className="text-xl tracking-tight">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SectionDisplayControls templateOptions={templateOptions} />
        {children}
      </CardContent>
    </Card>
  )
}
