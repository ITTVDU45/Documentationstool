# Documentation Tool

Eine produktionsnahe Next.js-App für strukturierte Projekt-/Business-Dokumentation mit:

- Docusaurus-inspirierter Informationsarchitektur (Sidebar, klare Lesefläche, Kapitelhierarchie)
- uDocumentGenerator-ähnlichem Form-to-Document-Flow
- PDF-Export über serverseitiges Puppeteer

## Stack

- Next.js App Router
- React + TypeScript (strict)
- Tailwind CSS + shadcn/ui
- react-hook-form + zod
- Puppeteer

## Schnellstart

```bash
npm install
npm run dev
```

App öffnen: [http://localhost:3000](http://localhost:3000)

## Environment

Kopiere `.env.example` nach `.env.local`:

```bash
cp .env.example .env.local
```

Verfügbare Variablen:

- `PUPPETEER_EXECUTABLE_PATH` (optional): eigener Chromium-Pfad für bestimmte Hosting-Umgebungen
- `NEXT_PUBLIC_APP_URL` (optional): Basis-URL für `metadataBase`
- `NEXT_PUBLIC_PRESENTATION_APP_URL` (optional): Basis-URL der separaten **presentation-ai**-Instanz (z. B. `http://localhost:3001`). Ohne diese Variable sind die Buttons „Präsentation öffnen“ deaktiviert; die Dokumentation funktioniert weiterhin.

### Präsentation (presentation-ai)

Die Präsentationsfunktion nutzt das Open-Source-Projekt [presentation-ai](https://github.com/allweonedev/presentation-ai) (MIT). Es ist **kein** Monolith-Merge: die App läuft **eigenständig** mit eigenem Stack (u. a. PostgreSQL, Prisma, NextAuth).

**Lokal neben diesem Repo:**

```bash
git clone https://github.com/allweonedev/presentation-ai.git
cd presentation-ai
# Abhängigkeiten & .env laut Upstream-README (pnpm, Datenbank, OAuth, …)
pnpm install
pnpm dev   # z. B. Port 3001
```

In diesem Projekt in `.env.local` setzen:

```bash
NEXT_PUBLIC_PRESENTATION_APP_URL=http://localhost:3001
```

Optional kann `presentation-ai` als Git-Submodule unter z. B. `external/presentation-ai` liegen – die URL zeigt trotzdem auf den laufenden Dev-Server.

**Routing in dieser App:**

- `/` – Dashboard (Tabs Dokumentation | Präsentation)
- `/project/new` – neues Projekt (Kontaktmaske)
- `/project/[id]` – Projekthub (Dokumentation oder Präsentation)
- `/project/[id]/documentation` – Sektionsformular

## Build & Quality

```bash
npm run lint
npm run build
```

## Architekturüberblick

```text
app/
  (docs)/
    layout.tsx           // FormProvider + Draft-Kontext
    page.tsx             // Dashboard (Tabs)
    project/
      new/page.tsx       // Projekt anlegen
      [id]/page.tsx      // Projekthub
      [id]/documentation/page.tsx  // Formular
    preview/page.tsx     // Dokumentvorschau
  api/generate-pdf/route.ts
  layout.tsx
  opengraph-image.tsx
  twitter-image.tsx
components/
  document/              // Preview, Template, PDF-Button
  form/                  // Form-Container, Provider, Renderer
  form-sections/         // 28 modulare Sektionen
  layout/                // Sidebar, Top-Progress
  ui/                    // shadcn-Komponenten
lib/
  default-project-data.ts
  pdf/render-document-html.tsx
  sections-meta.ts
  validation/project-documentation-schema.ts
types/
  project-documentation.ts
```

## Datenfluss

1. Nutzer füllt Formularsektionen aus (`react-hook-form` + `zod`)
2. Daten werden als Draft in `localStorage` gehalten
3. `/preview` rendert die gleiche Datenbasis read-only
4. `GeneratePdfButton` sendet JSON an `/api/generate-pdf`
5. Route validiert Payload, rendert HTML und erzeugt PDF mit Puppeteer
6. Browser lädt die PDF als Datei herunter

## Design Tokens & UI-Richtlinien

- Farbtoken in `app/globals.css` (hell/dunkel, B2B-neutral)
- Große Radien (`--radius`), ruhige Typografie, klare Abstände
- `glass-panel` Utility für dezente Blur/Glass-Flächen
- Sidebar + Main-Content folgen Dokumentations-UX statt Dashboard-Überladung

## Hosting-Hinweis für Puppeteer

Puppeteer benötigt eine Node-Runtime mit Chromium-Support. Für stabile Produktion:

- bevorzugt: Docker/VM mit kontrollierter Chromium-Installation
- serverless nur, wenn Chromium sauber bereitgestellt ist
- ggf. `PUPPETEER_EXECUTABLE_PATH` setzen

## Änderungs-Checkliste (ohne Brüche)

Bei Änderungen an Signaturen, IDs oder Schemas immer:

1. `types/project-documentation.ts` anpassen
2. `lib/validation/project-documentation-schema.ts` synchron halten
3. `lib/sections-meta.ts` prüfen
4. `components/form-sections/sections.tsx` (Form)
5. `components/document/document-sections.tsx` + `components/document/document-template.tsx` (Preview/PDF)
6. `components/form/section-renderer.tsx` kontrollieren
7. `npm run lint && npm run build` ausführen

## Inspiration sauber übernommen

- **Docusaurus:** nur UX-Muster (Navigation, Lesefluss, Hierarchie), kein Framework-Embedding
- **uDocumentGenerator:** modulare Dokument-Pipeline als konzeptionelle Basis, vollständig an den Business-Use-Case angepasst
