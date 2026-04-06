import type { SectionId } from "@/lib/section-ids"

export interface SectionMeta {
  id: SectionId
  title: string
  description: string
}

export const sectionsMeta: SectionMeta[] = [
  { id: "project_overview", title: "1. Project Overview", description: "Grunddaten des Projekts" },
  { id: "initial_situation_problem", title: "2. Initial Situation / Problem", description: "Ausgangslage und Herausforderungen" },
  { id: "goals", title: "3. Goals", description: "Strategische und operative Ziele" },
  { id: "core_idea_solution", title: "4. Core Idea / Solution", description: "Kernidee und Positionierung" },
  { id: "target_group", title: "5. Target Group", description: "Primäre und sekundäre Zielgruppen" },
  { id: "vision_target_state", title: "6. Vision / Target State", description: "Langfristiges Zielbild" },
  { id: "scope_features", title: "7. Scope / Features", description: "In Scope, Out of Scope, MVP" },
  { id: "requirements", title: "8. Requirements", description: "Funktionale und nicht-funktionale Anforderungen" },
  { id: "frontend_backend_features", title: "9. Frontend / Backend Features", description: "Features und Integrationen" },
  { id: "technical_concept", title: "10. Technical Concept", description: "Tech-Stack und Architektur" },
  { id: "design_ux_concept", title: "11. Design / UX Concept", description: "Designziele und Accessibility" },
  { id: "content_data_concept", title: "12. Content / Data Concept", description: "Datenverantwortung und IA" },
  { id: "sales_marketing_concept", title: "13. Sales / Marketing Concept", description: "Vertrieb, Marketing, Funnel" },
  { id: "market_potential", title: "14. Market Potential", description: "Markt, Wettbewerb, Chancen" },
  { id: "monetization_business_model", title: "15. Monetization / Business Model", description: "Umsatzmodell und Pricing" },
  { id: "revenue_scenarios", title: "16. Revenue Scenarios", description: "Szenarien und Skalierungseffekte" },
  { id: "cost_structure", title: "17. Cost Structure", description: "Einmalige und laufende Kosten" },
  { id: "profitability", title: "18. Profitability", description: "Break-even, ROI, Bewertung" },
  { id: "billing_invoice_model", title: "19. Billing / Invoice Model", description: "Abrechnungslogik" },
  { id: "roadmap_phases", title: "20. Roadmap / Phases", description: "Phasen und zeitliche Planung" },
  { id: "milestones", title: "21. Milestones", description: "Meilensteine inkl. Status und Datum" },
  { id: "current_status", title: "22. Current Status", description: "Aktueller Projektstand" },
  { id: "risks_challenges", title: "23. Risks / Challenges", description: "Risiken und Gegenmaßnahmen" },
  { id: "scaling_potential", title: "24. Scaling Potential", description: "Technische und geschäftliche Skalierung" },
  { id: "communication_coordination", title: "25. Communication / Coordination", description: "Kommunikationsrahmen" },
  { id: "next_steps", title: "26. Next Steps", description: "Priorisierte nächste Schritte" },
  { id: "management_summary", title: "27. Management Summary", description: "Executive Summary" },
  { id: "appendix", title: "28. Appendix", description: "Links, Anhänge, Notizen" },
]
