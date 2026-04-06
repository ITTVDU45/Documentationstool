import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Documentation Tool"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0f172a, #1d4ed8)",
          color: "white",
          padding: 56,
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 760 }}>
          <div style={{ fontSize: 28, opacity: 0.8 }}>Project Documentation App</div>
          <div style={{ fontSize: 74, fontWeight: 700, lineHeight: 1.05 }}>Form to Document, Built for Teams</div>
          <div style={{ fontSize: 30, opacity: 0.92 }}>Docusaurus-inspired UX with structured PDF export pipeline</div>
        </div>
      </div>
    ),
    size
  )
}
