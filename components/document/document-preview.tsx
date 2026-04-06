import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DocumentSections } from "@/components/document/document-sections"
import type { ProjectDocumentationInput } from "@/lib/validation/project-documentation-schema"

interface DocumentPreviewProps {
  data: ProjectDocumentationInput
}

export function DocumentPreview({ data }: DocumentPreviewProps) {
  return (
    <Card className="border-border/80 bg-card/95 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl tracking-tight">Dokumentvorschau</CardTitle>
        <CardDescription>Diese Vorschau entspricht der Reihenfolge und Struktur des PDF-Exports.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="rounded-xl border border-border bg-background p-6 print:border-none print:p-0">
          {data.project_overview.banner_image_data_url ? (
            <Image
              src={data.project_overview.banner_image_data_url}
              alt="Banner Vorschau"
              width={1600}
              height={420}
              unoptimized
              className="mb-6 h-56 w-full rounded-xl border border-border object-cover"
            />
          ) : null}
          <DocumentSections data={data} />
        </div>
      </CardContent>
    </Card>
  )
}
