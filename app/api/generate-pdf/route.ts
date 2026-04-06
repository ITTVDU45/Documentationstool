import { NextResponse } from "next/server"
import puppeteer from "puppeteer"

import { renderDocumentHtml } from "@/lib/pdf/render-document-html"
import { projectDocumentationSchema } from "@/lib/validation/project-documentation-schema"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const parseResult = projectDocumentationSchema.safeParse(payload)
    if (!parseResult.success) {
      return NextResponse.json(
        {
          message: "Ungültige Nutzlast für PDF-Generierung.",
          errors: parseResult.error.flatten(),
        },
        { status: 400 }
      )
    }

    const html = renderDocumentHtml(parseResult.data)
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })

    try {
      const page = await browser.newPage()
      await page.setContent(html, { waitUntil: "networkidle0" })
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "16mm", right: "14mm", bottom: "16mm", left: "14mm" },
      })

      return new NextResponse(Buffer.from(pdfBuffer), {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'attachment; filename="project-documentation.pdf"',
        },
      })
    } finally {
      await browser.close()
    }
  } catch {
    return NextResponse.json(
      {
        message: "PDF konnte serverseitig nicht erstellt werden.",
      },
      { status: 500 }
    )
  }
}
