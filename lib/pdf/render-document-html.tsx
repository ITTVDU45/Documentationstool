import { getDocumentTemplateHtml } from "@/components/document/document-template"
import type { ProjectDocumentationInput } from "@/lib/validation/project-documentation-schema"

const documentStyles = `
  * { box-sizing: border-box; }
  body {
    margin: 0;
    color: #111827;
    background: #ffffff;
    font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }
  .doc {
    padding: 48px;
  }
  .hero {
    margin-bottom: 24px;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 20px;
  }
  .hero h1 {
    font-size: 30px;
    margin: 0 0 8px;
  }
  .hero p {
    margin: 0;
    color: #4b5563;
  }
  .banner-wrapper {
    margin-bottom: 14px;
  }
  .banner-image {
    width: 100%;
    height: 220px;
    object-fit: cover;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
  }
  section {
    margin-bottom: 28px;
    page-break-inside: avoid;
  }
  .section-description {
    margin: 0 0 10px;
    color: #6b7280;
    font-size: 12px;
  }
  h2 {
    margin: 0 0 12px;
    font-size: 19px;
  }
  .template.grid2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    align-items: start;
  }
  .img {
    width: 100%;
    height: 220px;
    object-fit: cover;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
  }
  .hero-image {
    width: 100%;
    height: 240px;
    object-fit: cover;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
    margin-bottom: 12px;
  }
  .gallery {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 12px;
  }
  .bullets,
  .feature-list {
    margin: 0;
    padding-left: 18px;
  }
  .bullets li,
  .feature-list li,
  .timeline li {
    margin-bottom: 6px;
    line-height: 1.5;
    font-size: 12px;
  }
  .timeline {
    margin: 0;
    padding-left: 20px;
  }
  .quote {
    margin: 0 0 12px;
    border-left: 4px solid #1d4ed8;
    padding-left: 10px;
    font-style: italic;
    font-size: 12px;
  }
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  .bg-overlay {
    position: relative;
    min-height: 220px;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #e5e7eb;
  }
  .bg-image {
    width: 100%;
    height: 220px;
    object-fit: cover;
  }
  .overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    color: #fff;
    padding: 12px;
  }
  .field-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .field {
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 12px;
  }
  .field h3 {
    margin: 0 0 8px;
    font-size: 11px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #6b7280;
  }
  .field p {
    margin: 0;
    line-height: 1.5;
    font-size: 12px;
  }
`

export function renderDocumentHtml(data: ProjectDocumentationInput) {
  const body = getDocumentTemplateHtml(data)
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>${documentStyles}</style>
      </head>
      <body>${body}</body>
    </html>
  `
}
