You are a senior fullstack engineer and product-minded software architect.

I want you to build a modern, scalable, production-ready web application with:

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- react-hook-form
- zod
- Puppeteer for PDF generation

## Project Goal

Build a “Project Documentation App” where users can fill out a structured business/project form and generate a professional PDF document from it.

This app should combine:

1. **Docusaurus as inspiration**
   Use Docusaurus as inspiration for:
   - UI/UX patterns
   - documentation layout
   - sidebar navigation
   - structured section rendering
   - clean reading experience
   - content hierarchy
   - section-based architecture

2. **uDocumentGenerator as base model**
   Use the idea of uDocumentGenerator as a conceptual starting point / baseline for document generation flow, but adapt the entire product to my own business case:
   - structured project data input
   - modular form system
   - form-to-document flow
   - PDF export
   - modern dashboard/documentation UI

Do NOT copy these repositories literally.
Use them only as inspiration for architecture, UX, information hierarchy, and modularity.

---

## Main Product Idea

The app should allow users to:

- create a project documentation
- fill out all project/business fields in an interactive form
- navigate through the form in structured sections
- preview the documentation in a clean document-style layout
- generate and download a PDF from the entered data

The experience should feel like:
- a mix of a modern admin/dashboard
- a documentation system
- a structured business planning tool

---

## My Required Structure

The form and generated document must support the following sections:

### 1. Project Overview
- project name
- short description
- project type
- client / company
- contact person
- responsibilities

### 2. Initial Situation / Problem
- current situation
- existing problems
- reason for starting the project
- consequences if not implemented

### 3. Goals
- main goal
- sub-goals
- short-term goals
- mid-term goals
- long-term goals
- KPIs / success metrics

### 4. Core Idea / Solution
- core concept
- value proposition
- differentiation from previous solutions
- unique selling points

### 5. Target Group
- primary target group
- secondary target group
- characteristics
- user roles

### 6. Vision / Target State
- desired end state
- user experience goals
- brand / external perception
- long-term vision

### 7. Scope / Features
- included services
- excluded services
- MVP scope
- later expansion stages

### 8. Requirements
- functional requirements
- non-functional requirements
- legal / organizational requirements

### 9. Frontend / Backend Features
- frontend features
- backend features
- automations
- integrations

### 10. Technical Concept
- frontend stack
- backend stack
- database
- hosting
- authentication
- storage
- architecture
- entities / data model
- permissions
- APIs

### 11. Design / UX Concept
- visual style
- UX goals
- responsiveness
- accessibility

### 12. Content / Data Concept
- content types
- ownership / maintenance
- information architecture
- SEO-relevant content

### 13. Sales / Marketing Concept
- sales strategy
- marketing channels
- funnel / conversion logic
- email / automation strategy

### 14. Market Potential
- market environment
- demand
- target market
- competition
- opportunities

### 15. Monetization / Business Model
- revenue model
- pricing strategy
- recurring revenue
- upsells / add-ons

### 16. Revenue Scenarios
- assumptions
- conservative scenario
- realistic scenario
- optimistic scenario
- scaling effects

### 17. Cost Structure
- one-time costs
- recurring costs
- variable / hidden costs

### 18. Profitability
- revenue vs cost
- break-even
- ROI
- profitability assessment

### 19. Billing / Invoice Model
- project billing model
- one-time invoice items
- recurring invoice items
- example pricing

### 20. Roadmap / Phases
- concept
- design
- development
- testing
- launch
- scaling

### 21. Milestones
- milestone list with status and target date

### 22. Current Status
- global status
- completed work
- work in progress
- open tasks
- blockers

### 23. Risks / Challenges
- technical risks
- business risks
- organizational risks
- countermeasures

### 24. Scaling Potential
- technical scaling
- business scaling
- new target groups / markets

### 25. Communication / Coordination
- meeting rhythm
- communication channels
- documentation sources

### 26. Next Steps
- immediate next steps
- priorities
- open decisions

### 27. Management Summary
- project summary
- recommendation

### 28. Appendix
- relevant links
- files / documents
- notes

---

## Product Requirements

### A. Application Architecture
Build the app with a clean, scalable architecture.

Use a modular structure such as:

- app/
  - page.tsx
  - preview/page.tsx
  - api/generate-pdf/route.ts
- components/
  - layout/
  - navigation/
  - form/
  - form-sections/
  - document/
- lib/
  - validation/
  - pdf/
  - helpers/
- types/
- data/

Each major section of the form must be its own reusable component.

---

### B. UI / UX Requirements

The UI should be inspired by documentation software.

Implement:
- left sidebar navigation with all sections
- main content area for the active form section
- top progress indicator
- autosave / draft feel
- clean typography
- spacious layout
- responsive design
- dashboard/document hybrid experience

I want the UX to feel:
- modern
- premium
- highly structured
- easy to scan
- easy to maintain
- modular and reusable

Use Docusaurus-inspired ideas such as:
- hierarchical navigation
- section clarity
- readable document layouts
- clean spacing and typography
- strong information architecture

---

### C. Form Experience

Build a multi-step form system with:
- sidebar section switching
- previous / next actions
- validation per section
- overall validation schema
- progress tracking
- save draft to localStorage
- restore previous draft on reload

Use:
- react-hook-form
- zod
- strong TypeScript typing

---

### D. Data Model

Create a complete TypeScript data model for the full project documentation.

Use:
- interfaces / types for all sections
- nested objects where useful
- reusable types for scenarios, milestones, costs, KPIs, etc.

Create a central schema for validation.

---

### E. Document Preview

Create a preview mode/page that renders the entered form data like a professional documentation page.

This preview should:
- look like a documentation site / business concept document
- use headings, subheadings, paragraphs, tables, lists
- support large content blocks
- be printable
- closely match the future PDF output

---

### F. PDF Generation

Implement PDF generation using Puppeteer.

Requirements:
- route: `/api/generate-pdf`
- send structured form data via POST
- render a React `DocumentTemplate` server-side to HTML
- use Puppeteer to generate an A4 PDF
- return the PDF as downloadable response
- include loading and error handling in frontend

PDF should contain:
- professional layout
- all form sections
- consistent typography
- tables for revenue/cost/milestones
- page-friendly spacing
- optional cover/title section

---

### G. Core Components to Build

Create at minimum:

1. `ProjectDocumentationForm`
2. `SidebarNavigation`
3. `SectionRenderer`
4. `DocumentPreview`
5. `DocumentTemplate`
6. `GeneratePdfButton`
7. validation schemas
8. TypeScript types
9. API route for PDF generation

---

### H. Design System

Use:
- Tailwind CSS
- shadcn/ui components
- cards
- accordions where useful
- textarea-heavy business UI
- table UI for scenarios and milestones
- badges/status indicators

Use a neutral, premium design.
Avoid playful styles.
This is a serious B2B documentation product.

---

### I. Developer Expectations

I want production-quality code.

Please:
- write clean and well-structured code
- separate concerns properly
- avoid spaghetti code
- use reusable components
- use strong typings
- add helper functions where needed
- make the codebase easy to expand later
- prepare it so database persistence can be added later

---

### J. What I Want You to Output

Please generate:

1. the full folder structure
2. the main TypeScript types
3. the zod validation schema
4. the main page layout
5. the sidebar navigation
6. modular form section components
7. preview page
8. document template
9. PDF API route
10. helper functions for download flow
11. example styling
12. a first fully working MVP implementation

Also explain briefly:
- the architecture decisions
- how Docusaurus-inspired UX was interpreted
- how the uDocumentGenerator-like baseline was adapted to my custom business case

Important:
Do not build a generic docs site.
Build a structured form-to-document SaaS-style app for project/business documentation.

Start with the architecture and folder structure first, then generate the implementation.