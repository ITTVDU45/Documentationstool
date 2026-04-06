export const displayTemplates = [
  {
    id: "grid-2-image-left-text-right",
    label: "Grid 2 (Links Bild, Rechts Text)",
    needsImage1: true,
    allowsImage2: false,
  },
  {
    id: "grid-2-text-left-image-right",
    label: "Grid 2 (Links Text, Rechts Bild)",
    needsImage1: true,
    allowsImage2: false,
  },
  {
    id: "text-bullet-points",
    label: "Text mit Bulletpoints",
    needsImage1: false,
    allowsImage2: false,
  },
  {
    id: "background-image-overlay-text",
    label: "Background Image mit Text",
    needsImage1: true,
    allowsImage2: false,
  },
  {
    id: "hero-image-title-subtitle",
    label: "Hero Image mit Titel/Subtitel",
    needsImage1: true,
    allowsImage2: false,
  },
  {
    id: "two-image-gallery-with-text",
    label: "2-Bild Galerie mit Text",
    needsImage1: true,
    allowsImage2: true,
  },
  {
    id: "timeline-steps",
    label: "Timeline Steps",
    needsImage1: false,
    allowsImage2: false,
  },
  {
    id: "stats-cards-with-summary",
    label: "Stats Cards mit Summary",
    needsImage1: false,
    allowsImage2: false,
  },
  {
    id: "feature-list-with-icons",
    label: "Feature List mit Icons",
    needsImage1: false,
    allowsImage2: false,
  },
  {
    id: "quote-highlight-with-supporting-text",
    label: "Quote Highlight mit Supporting Text",
    needsImage1: false,
    allowsImage2: false,
  },
] as const

export type DisplayTemplateId = (typeof displayTemplates)[number]["id"]

export const defaultDisplayTemplateId: DisplayTemplateId = "grid-2-image-left-text-right"

export function getTemplateMeta(templateId: DisplayTemplateId) {
  return (
    displayTemplates.find((item) => item.id === templateId) ??
    displayTemplates[0]
  )
}
