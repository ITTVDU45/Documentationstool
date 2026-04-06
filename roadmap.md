Next.js/React/TypeScript App for Project Documentation & PDF Generation

Diese Map zeigt den Aufbau und die Funktionsweise einer Web‑Applikation, die du mit Next.js, React und TypeScript entwickeln kannst. Sie enthält ein interaktives Formular, das alle Felder aus deiner Projektvorlage abdeckt, und eine PDF‑Exportfunktion, die deine Projektbeschreibung als herunterladbares PDF bereitstellt.

1. Überblick und Ziel der Anwendung

Die Applikation soll zwei Kernaufgaben erfüllen:

Interaktives Formular – Ein React‑Formular, das sämtliche Felder der von dir definierten Projektvorlage abdeckt (Name, Ziel, Kernidee, Technologie‑Stack, Marktpotenzial, Monetarisierung, Verdienstmöglichkeiten, Kosten, Roadmap etc.). Nutzer können dieses Formular ausfüllen, speichern und später bearbeiten.
PDF‑Download – Nach Ausfüllen des Formulars kann der Nutzer ein PDF generieren und herunterladen. Hierzu wird auf dem Server eine PDF‑Datei erzeugt (z. B. mit Puppeteer), die den Formularinhalt als sauber formatiertes Dokument enthält.

Diese Lösung hilft dir, Projekte strukturiert zu erfassen und sofort als professionelles Dokument zu exportieren – für interne Zwecke, Kundenpräsentationen oder Investoren.

2. Technologie‑Stack
Next.js mit TypeScript – erlaubt Server‑Side Rendering (SSR) und API‑Routen. Ein neues Projekt lässt sich mit npx create-next-app@latest --typescript starten.
React – für die Formular‑ und UI‑Komponenten.
TypeScript – erhöht die Typensicherheit bei Formularfeldern und API‑Methoden.
Puppeteer – Node‑Library zur Steuerung eines headless Chrome. Puppeteer kann HTML zuverlässig in PDF umwandeln und ist ideal für pixelgenaue Dokumente.
Optional: react-hook-form für komfortables Formular‑Handling, zod zur Validierung, Tailwind oder shadcn‑UI für das Styling.
Warum Puppeteer statt PDF‑Lib?

Die Library pdf-lib erlaubt das Erstellen und Bearbeiten von PDFs, wird aber weniger gepflegt; für komplexe HTML‑zu‑PDF‑Umwandlungen werden moderne Browser‑Engines wie Puppeteer oder Playwright empfohlen. Puppeteer rendert HTML inklusive CSS und JavaScript exakt und ist daher besser geeignet.

3. Seiten und Routen
Pfad	Zweck	Beschreibung
/	Hauptformular‑Seite	Enthält das interaktive Formular mit allen Projektfeldern. Benutzer können Daten eingeben und speichern (z. B. lokal per Zustand oder persistiert in einer Datenbank).
/api/generate-pdf	API‑Route zur PDF‑Erstellung	Nimmt via POST die Projektdaten entgegen, rendert eine HTML‑Vorlage als React‑Komponente zu einem String und erzeugt daraus mit Puppeteer eine PDF. Die Route gibt die PDF als Buffer zurück oder speichert sie für spätere Downloads.
/_app.tsx	Root‑Komponente	Bindet globales CSS, UI‑Bibliotheken und eventuell Kontextprovider (Theme, Formularstatus).
components/ProjectForm.tsx	Form‑Komponente	Enthält alle Eingabefelder und Validierungslogik.
components/DocumentTemplate.tsx	PDF‑Template	Stellt den Inhalt des PDFs dar (z. B. Abschnittsüberschriften, Tabellen) und nimmt Props für die Projektinformationen entgegen.
4. Datenmodelle und Typen

Definiere in einer Datei types.ts sämtliche benötigten Typen. Beispiel:

export interface ProjectData {
  projectName: string;
  shortDescription: string;
  projectType: string;
  client: string;
  contactPerson: string;
  objectives: string;
  keyIdea: string;
  vision: string;
  techStack: string;
  roadmap: string;
  marketPotential: string;
  monetization: string;
  revenueScenarios: RevenueScenarios;
  costStructure: CostStructure;
  profitability: string;
  billingModel: string;
  risks: string;
  nextSteps: string;
  // …weitere Felder nach Bedarf
}

export interface RevenueScenarios {
  conservative: Scenario;
  realistic: Scenario;
  optimistic: Scenario;
}

export interface Scenario {
  customersPerMonth: number;
  averageRevenue: number;
}

export interface CostStructure {
  oneTimeCosts: number;
  monthlyCosts: number;
  variableCosts?: number;
}

Diese Typen geben dem Formular und der PDF‑Generierung eine klare Struktur und unterstützen TypeScript beim Erkennen von Fehlern.

5. Formular‑Komponente

Die Formular‑Komponente ProjectForm.tsx enthält die Eingabefelder. Du kannst useState wie im Beispiel verwendet wird; besser geeignet ist aber eine Library wie react‑hook‑form, die komplexe Formulare mit Validierung elegant handhabt. Die Felder sollten den Abschnitten deiner Markdown‑Vorlage entsprechen (Projektname, Ausgangssituation, Ziele, Kernidee, Zielbild, Leistungsumfang, Technologie‑Stack, Marktpotenzial, Monetarisierung, Verdienstmöglichkeiten, Kosten, Wirtschaftlichkeit, Rechnungsmodelle, Roadmap, aktueller Status, Risiken etc.).

Wichtig ist eine Validierung (Pflichtfelder, Zahlenbereiche), damit das PDF später plausible Daten enthält. Beispiel‑Code (vereinfacht):

import { useForm } from 'react-hook-form';
import type { ProjectData } from '../types';

export default function ProjectForm({ onSubmit }: { onSubmit: (data: ProjectData) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<ProjectData>();
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Projektname</label>
        <input type="text" {...register('projectName', { required: true })} />
        {errors.projectName && <span>Bitte ausfüllen.</span>}
      </div>
      {/* Weitere Felder ... */}
      <button type="submit">PDF erstellen</button>
    </form>
  );
}
6. PDF‑Generation mit Puppeteer

Die API‑Route /api/generate-pdf wird serverseitig ausgeführt und hat Zugriff auf Node‑Bibliotheken. Die Funktionsweise in drei Schritten:

HTML‑Template rendern – Mit react-dom/server wird die Komponente DocumentTemplate zu einem HTML‑String gerendert. DocumentTemplate nimmt die Projektdaten als Props entgegen und baut daraus strukturiertes HTML (Überschriften, Absätze, Tabellen, Listen).
Puppeteer starten – Ein headless Chrome wird gestartet. Die HTML‑Seite wird mittels page.setContent() geladen und ggf. mit inline‑CSS versehen.
PDF erzeugen – page.pdf() erstellt das PDF. Du kannst entweder den Pfad angeben, um das PDF in public/documents/ zu speichern, oder den Buffer zurückgeben, damit das PDF sofort zum Download bereitsteht.

Ein vereinfachtes Beispiel (API‑Route in pages/api/generate-pdf.ts):

import type { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';
import React from 'react';
import { renderToString } from 'react-dom/server';
import DocumentTemplate from '../../components/DocumentTemplate';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  const data = req.body as ProjectData;
  const html = renderToString(<DocumentTemplate {...data} />);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(`<!DOCTYPE html><html><head><meta charset="utf-8" />
    <style>body { font-family: sans-serif; }</style>
    </head><body>${html}</body></html>`);
  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="project.pdf"');
  return res.status(200).send(pdfBuffer);
}

Auf der Client‑Seite nutzt du fetch oder axios, um die Daten per POST zu senden und die PDF‑Datei als blob herunterzuladen. Der Artikel zeigt, wie der Download ausgelöst wird: Ein POST an /api/generate-pdf mit responseType: 'arraybuffer' liefert den PDF‑Buffer; anschließend wird aus den Binärdaten ein Blob erstellt und via temporärem Link heruntergeladen.

7. Dokumenten‑Template (PDF)

In components/DocumentTemplate.tsx definierst du, wie das PDF aussehen soll. Verwende HTML‑Semantik: <h1> und <h2> für Überschriften, <p> für Textabsätze, <table> für tabellarische Daten (z. B. Umsatz‑ und Kostenübersicht). Füge CSS inline oder in der API‑Route hinzu, um Schriftart, Abstände und Seitenränder zu definieren. Da Puppeteer das komplette DOM rendert, kannst du sogar Tailwind‑Klassen benutzen.

Zum Beispiel:

export default function DocumentTemplate(props: ProjectData) {
  return (
    <div>
      <h1>{props.projectName}</h1>
      <p>{props.shortDescription}</p>
      <h2>Ziele</h2>
      <p>{props.objectives}</p>
      {/* Weitere Abschnitte ... */}
      <h2>Umsatzszenarien</h2>
      <table>
        <thead><tr><th>Scenario</th><th>Kunden/Monat</th><th>Ø Umsatz</th></tr></thead>
        <tbody>
          <tr><td>Konservativ</td><td>{props.revenueScenarios.conservative.customersPerMonth}</td><td>{props.revenueScenarios.conservative.averageRevenue}</td></tr>
          <tr><td>Realistisch</td><td>{props.revenueScenarios.realistic.customersPerMonth}</td><td>{props.revenueScenarios.realistic.averageRevenue}</td></tr>
          <tr><td>Optimistisch</td><td>{props.revenueScenarios.optimistic.customersPerMonth}</td><td>{props.revenueScenarios.optimistic.averageRevenue}</td></tr>
        </tbody>
      </table>
      <h2>Kostenstruktur</h2>
      <p>Einmalige Kosten: {props.costStructure.oneTimeCosts} €</p>
      <p>Monatliche Kosten: {props.costStructure.monthlyCosts} €</p>
    </div>
  );
}

Achte darauf, nur einfache HTML‑Elemente zu verwenden, weil komplexe Framework‑Komponenten manchmal nicht korrekt gerendert werden. Stilregeln (z. B. Font Size, Farben) sollten in der API‑Route als Inline‑Styles hinzugefügt werden.

8. Datenfluss und Komponenten‑Interaktion

Für die Übersicht zeigt das folgende Diagramm den Ablauf von der Dateneingabe bis zur PDF‑Ausgabe:

ProjectForm – Der Benutzer gibt alle Projektdaten ein und löst per Button einen Download aus.
onSubmit Handler – Sammelt die Formularwerte und sendet sie an die API‑Route.
API Route (/api/generate-pdf) – Empfängt die Daten, rendert das Dokumenttemplate und generiert das PDF mit Puppeteer.
Antwort – Der Server sendet den PDF‑Buffer zurück. Im Browser wird daraus ein Blob erstellt und als Datei heruntergeladen.
Diagramm (vereinfachter Datenfluss)

9. Erweiterungen und Verbesserungen
Persistenz: Speichere Formularinhalte in einer Datenbank (z. B. PostgreSQL oder MongoDB). In Next.js kannst du mit prisma ein ORM nutzen.
Benutzer‑Authentifizierung: Lasse Nutzer sich anmelden, um ihre Projekte zu verwalten. NextAuth.js oder Clerk bieten fertige Lösungen.
Formular‑Versionierung: Lege pro Projekt mehrere Versionen der Beschreibung an (z. B. verschiedene Fortschrittsstände).
Rich‑Text‑Editor: Für längere Texte könnten Editoren wie TipTap oder Lexical integriert werden.
Mehrsprachigkeit: Wenn du unterschiedliche Sprachen brauchst, nutze next-translate oder next-i18next.
Alternative PDF‑Generatoren: Sollte Puppeteer zu schwergewichtig sein, probiere Playwright aus oder nutze einen externen PDF‑API‑Service.
10. Fazit

Mit Next.js, React und TypeScript lässt sich eine professionelle, anpassbare Projektverwaltungs‑ und PDF‑Export‑Lösung bauen. Du startest mit create-next-app --typescript, implementierst ein strukturiertes Formular und nutzt eine serverseitige API‑Route mit Puppeteer, um die eingegebenen Daten als PDF zu generieren. Der Einsatz von React für die PDF‑Vorlage ermöglicht dir, denselben Komponenten‑Stack für Web‑UI und Dokumenten‑Rendering zu verwenden.
Die klar definierte Struktur erleichtert künftige Erweiterungen – sei es eine Datenbank, Authentifizierung oder weitere Exportformate.