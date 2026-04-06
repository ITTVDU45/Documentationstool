import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Documentation Tool"
export const size = { width: 1200, height: 600 }
export const contentType = "image/png"

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #1e293b, #2563eb)",
          color: "white",
          padding: 48,
          alignItems: "center",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 24, opacity: 0.9 }}>Documentation Tool</div>
          <div style={{ fontSize: 56, fontWeight: 700 }}>Structured Project Docs + PDF</div>
          <div style={{ fontSize: 28, opacity: 0.9 }}>App Router · react-hook-form · zod · Puppeteer</div>
        </div>
      </div>
    ),
    size
  )
}
