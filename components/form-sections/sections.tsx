"use client"

import Image from "next/image"
import { useRef, useState, type ChangeEvent, type DragEvent, type ReactNode } from "react"
import type { UseFormReturn } from "react-hook-form"
import { useFieldArray } from "react-hook-form"

import { SectionShell } from "@/components/form-sections/section-shell"
import { TextareaField, TextInputField } from "@/components/form-sections/section-fields"
import { displayTemplates, type DisplayTemplateId } from "@/lib/display-templates"
import { sectionIds, type SectionId } from "@/lib/section-ids"
import { Button } from "@/components/ui/button"
import { FormControl, FormDescription, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { ProjectDocumentationInput } from "@/lib/validation/project-documentation-schema"

interface SectionProps {
  form: UseFormReturn<ProjectDocumentationInput>
}

interface DynamicCostTableProps {
  form: UseFormReturn<ProjectDocumentationInput>
  title: string
  name: "cost_structure.one_time_costs" | "cost_structure.recurring_costs" | "cost_structure.variable_hidden_costs"
}

interface DynamicMilestoneTableProps {
  form: UseFormReturn<ProjectDocumentationInput>
}

const allTemplateOptions = displayTemplates.map((template) => template.id)
const sectionTemplateOptionsBySection = sectionIds.reduce(
  (accumulator, sectionId) => {
    accumulator[sectionId] = allTemplateOptions
    return accumulator
  },
  {} as Record<SectionId, readonly DisplayTemplateId[]>
)

function getSectionTemplateOptions(sectionId: SectionId) {
  return sectionTemplateOptionsBySection[sectionId]
}

function Grid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 lg:grid-cols-2">{children}</div>
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ""))
    reader.onerror = () => reject(new Error("Bild konnte nicht gelesen werden."))
    reader.readAsDataURL(file)
  })
}

function BannerImageField({ form }: SectionProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  async function processBannerFile(
    file: File,
    onChange: (value: string) => void
  ) {
    if (!file.type.startsWith("image/")) {
      form.setError("project_overview.banner_image_data_url", {
        type: "manual",
        message: "Bitte ein gültiges Bild auswählen.",
      })
      return
    }

    try {
      const imageAsDataUrl = await readFileAsDataUrl(file)
      onChange(imageAsDataUrl)
      form.clearErrors("project_overview.banner_image_data_url")
    } catch {
      form.setError("project_overview.banner_image_data_url", {
        type: "manual",
        message: "Bild konnte nicht verarbeitet werden.",
      })
    }
  }

  return (
    <FormField
      control={form.control}
      name="project_overview.banner_image_data_url"
      render={({ field, fieldState }) => (
        <FormItem className="space-y-3">
          <div className="space-y-1">
            <p className="text-sm font-medium">Banner-Bild (für PDF-Header)</p>
            <FormDescription>
              Empfohlen: JPG/PNG/WebP, Landscape-Format.
            </FormDescription>
          </div>
          <FormControl>
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                onChange={async (event: ChangeEvent<HTMLInputElement>) => {
                  const file = event.target.files?.[0]
                  if (!file) return
                  await processBannerFile(file, field.onChange)
                }}
              />
              <div
                role="button"
                tabIndex={0}
                className={`rounded-xl border-2 border-dashed p-6 text-center transition ${
                  isDragActive
                    ? "border-primary bg-primary/5"
                    : "border-border bg-muted/30"
                }`}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" && event.key !== " ") return
                  event.preventDefault()
                  fileInputRef.current?.click()
                }}
                onDragOver={(event: DragEvent<HTMLDivElement>) => {
                  event.preventDefault()
                  setIsDragActive(true)
                }}
                onDragLeave={() => setIsDragActive(false)}
                onDrop={async (event: DragEvent<HTMLDivElement>) => {
                  event.preventDefault()
                  setIsDragActive(false)
                  const file = event.dataTransfer.files?.[0]
                  if (!file) return
                  await processBannerFile(file, field.onChange)
                }}
              >
                <p className="text-sm font-medium">
                  Bild hierher ziehen oder klicken zum Auswählen
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Unterstützt: PNG, JPG, WebP, GIF
                </p>
              </div>
            </div>
          </FormControl>
          {field.value ? (
            <div className="space-y-2 rounded-xl border border-border p-3">
              <Image
                src={field.value}
                alt="Banner Vorschau"
                width={1600}
                height={420}
                unoptimized
                className="h-40 w-full rounded-lg object-cover"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => field.onChange("")}
              >
                Banner entfernen
              </Button>
            </div>
          ) : null}
          {fieldState.error ? (
            <p className="text-sm text-destructive">{fieldState.error.message}</p>
          ) : null}
        </FormItem>
      )}
    />
  )
}

function DynamicCostTable({ form, title, name }: DynamicCostTableProps) {
  const fieldArray = useFieldArray({ control: form.control, name })

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{title}</h4>
        <Button type="button" variant="outline" size="sm" onClick={() => fieldArray.append({ label: "", amount: "", note: "" })}>
          Zeile hinzufügen
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Position</TableHead>
            <TableHead>Betrag</TableHead>
            <TableHead>Notiz</TableHead>
            <TableHead className="w-[96px]">Aktion</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fieldArray.fields.map((field, index) => (
            <TableRow key={field.id}>
              <TableCell>
                <Input {...form.register(`${name}.${index}.label`)} placeholder="z. B. Setup" />
              </TableCell>
              <TableCell>
                <Input {...form.register(`${name}.${index}.amount`)} placeholder="z. B. 2.500 EUR" />
              </TableCell>
              <TableCell>
                <Input {...form.register(`${name}.${index}.note`)} placeholder="Zusatzinfo" />
              </TableCell>
              <TableCell>
                <Button type="button" variant="ghost" size="sm" onClick={() => fieldArray.remove(index)} disabled={fieldArray.fields.length <= 1}>
                  Entfernen
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function DynamicMilestoneTable({ form }: DynamicMilestoneTableProps) {
  const fieldArray = useFieldArray({ control: form.control, name: "milestones.milestone_list" })

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Milestone List</h4>
        <Button type="button" variant="outline" size="sm" onClick={() => fieldArray.append({ title: "", status: "not-started", target_date: "" })}>
          Milestone hinzufügen
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titel</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Zieldatum</TableHead>
            <TableHead className="w-[96px]">Aktion</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fieldArray.fields.map((field, index) => (
            <TableRow key={field.id}>
              <TableCell>
                <Input {...form.register(`milestones.milestone_list.${index}.title`)} placeholder="Milestone" />
              </TableCell>
              <TableCell>
                <FormField
                  control={form.control}
                  name={`milestones.milestone_list.${index}.status`}
                  render={({ field: statusField }) => (
                    <FormItem>
                      <FormControl>
                        <Select value={statusField.value} onValueChange={statusField.onChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="not-started">Not Started</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="done">Done</SelectItem>
                            <SelectItem value="blocked">Blocked</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell>
                <Input type="date" {...form.register(`milestones.milestone_list.${index}.target_date`)} />
              </TableCell>
              <TableCell>
                <Button type="button" variant="ghost" size="sm" onClick={() => fieldArray.remove(index)} disabled={fieldArray.fields.length <= 1}>
                  Entfernen
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function ProjectOverviewSection({ form }: SectionProps) {
  return (
    <SectionShell title="Project Overview" description="Basisdaten zum Projekt und zu den Verantwortlichen." templateOptions={getSectionTemplateOptions("project_overview")}>
      <BannerImageField form={form} />
      <Grid>
        <TextInputField form={form} name="project_overview.project_name" label="Project Name" />
        <TextInputField form={form} name="project_overview.project_type" label="Project Type" />
        <TextInputField form={form} name="project_overview.client_company" label="Client / Company" />
        <TextInputField form={form} name="project_overview.contact_person" label="Contact Person" />
        <TextInputField form={form} name="project_overview.company_email" label="Company Email" type="email" />
        <TextInputField form={form} name="project_overview.company_phone" label="Company Phone" />
        <TextInputField form={form} name="project_overview.company_location" label="Company Location" />
      </Grid>
      <TextareaField form={form} name="project_overview.short_description" label="Short Description" />
      <TextareaField form={form} name="project_overview.responsibilities" label="Responsibilities" />
    </SectionShell>
  )
}

export function InitialSituationProblemSection({ form }: SectionProps) {
  return (
    <SectionShell title="Initial Situation / Problem" description="Warum startet dieses Projekt?" templateOptions={getSectionTemplateOptions("initial_situation_problem")}>
      <TextareaField form={form} name="initial_situation_problem.current_situation" label="Current Situation" />
      <TextareaField form={form} name="initial_situation_problem.existing_problems" label="Existing Problems" />
      <TextareaField form={form} name="initial_situation_problem.reason_for_start" label="Reason for Starting the Project" />
      <TextareaField form={form} name="initial_situation_problem.consequences_if_not_implemented" label="Consequences if not Implemented" />
    </SectionShell>
  )
}

export function GoalsSection({ form }: SectionProps) {
  return (
    <SectionShell title="Goals" description="Projektziele und KPIs." templateOptions={getSectionTemplateOptions("goals")}>
      <TextareaField form={form} name="goals.main_goal" label="Main Goal" />
      <TextareaField form={form} name="goals.sub_goals" label="Sub-goals" />
      <Grid>
        <TextareaField form={form} name="goals.short_term_goals" label="Short-term Goals" />
        <TextareaField form={form} name="goals.mid_term_goals" label="Mid-term Goals" />
      </Grid>
      <TextareaField form={form} name="goals.long_term_goals" label="Long-term Goals" />
      <TextareaField form={form} name="goals.kpis_success_metrics" label="KPIs / Success Metrics" />
    </SectionShell>
  )
}

export function CoreIdeaSolutionSection({ form }: SectionProps) {
  return (
    <SectionShell title="Core Idea / Solution" description="Wertversprechen und Differenzierung." templateOptions={getSectionTemplateOptions("core_idea_solution")}>
      <TextareaField form={form} name="core_idea_solution.core_concept" label="Core Concept" />
      <TextareaField form={form} name="core_idea_solution.value_proposition" label="Value Proposition" />
      <TextareaField form={form} name="core_idea_solution.differentiation" label="Differentiation" />
      <TextareaField form={form} name="core_idea_solution.unique_selling_points" label="Unique Selling Points" />
    </SectionShell>
  )
}

export function TargetGroupSection({ form }: SectionProps) {
  return (
    <SectionShell title="Target Group" description="Zielgruppen- und Rollenbild." templateOptions={getSectionTemplateOptions("target_group")}>
      <Grid>
        <TextareaField form={form} name="target_group.primary_target_group" label="Primary Target Group" />
        <TextareaField form={form} name="target_group.secondary_target_group" label="Secondary Target Group" />
      </Grid>
      <TextareaField form={form} name="target_group.characteristics" label="Characteristics" />
      <TextareaField form={form} name="target_group.user_roles" label="User Roles" />
    </SectionShell>
  )
}

export function VisionTargetStateSection({ form }: SectionProps) {
  return (
    <SectionShell title="Vision / Target State" description="Gewünschter Endzustand und Außenwirkung." templateOptions={getSectionTemplateOptions("vision_target_state")}>
      <TextareaField form={form} name="vision_target_state.desired_end_state" label="Desired End State" />
      <TextareaField form={form} name="vision_target_state.user_experience_goals" label="User Experience Goals" />
      <TextareaField form={form} name="vision_target_state.brand_external_perception" label="Brand / External Perception" />
      <TextareaField form={form} name="vision_target_state.long_term_vision" label="Long-term Vision" />
    </SectionShell>
  )
}

export function ScopeFeaturesSection({ form }: SectionProps) {
  return (
    <SectionShell title="Scope / Features" description="Leistungsumfang für MVP und spätere Erweiterung." templateOptions={getSectionTemplateOptions("scope_features")}>
      <Grid>
        <TextareaField form={form} name="scope_features.included_services" label="Included Services" />
        <TextareaField form={form} name="scope_features.excluded_services" label="Excluded Services" />
      </Grid>
      <TextareaField form={form} name="scope_features.mvp_scope" label="MVP Scope" />
      <TextareaField form={form} name="scope_features.later_expansion_stages" label="Later Expansion Stages" />
    </SectionShell>
  )
}

export function RequirementsSection({ form }: SectionProps) {
  return (
    <SectionShell title="Requirements" description="Anforderungen auf allen Ebenen." templateOptions={getSectionTemplateOptions("requirements")}>
      <TextareaField form={form} name="requirements.functional_requirements" label="Functional Requirements" />
      <TextareaField form={form} name="requirements.non_functional_requirements" label="Non-functional Requirements" />
      <TextareaField form={form} name="requirements.legal_organizational_requirements" label="Legal / Organizational Requirements" />
    </SectionShell>
  )
}

export function FrontendBackendFeaturesSection({ form }: SectionProps) {
  return (
    <SectionShell title="Frontend / Backend Features" description="Produkt- und Integrations-Features." templateOptions={getSectionTemplateOptions("frontend_backend_features")}>
      <Grid>
        <TextareaField form={form} name="frontend_backend_features.frontend_features" label="Frontend Features" />
        <TextareaField form={form} name="frontend_backend_features.backend_features" label="Backend Features" />
      </Grid>
      <TextareaField form={form} name="frontend_backend_features.automations" label="Automations" />
      <TextareaField form={form} name="frontend_backend_features.integrations" label="Integrations" />
    </SectionShell>
  )
}

export function TechnicalConceptSection({ form }: SectionProps) {
  return (
    <SectionShell title="Technical Concept" description="Stack, Infrastruktur und Datenmodell." templateOptions={getSectionTemplateOptions("technical_concept")}>
      <Grid>
        <TextInputField form={form} name="technical_concept.frontend_stack" label="Frontend Stack" />
        <TextInputField form={form} name="technical_concept.backend_stack" label="Backend Stack" />
        <TextInputField form={form} name="technical_concept.database" label="Database" />
        <TextInputField form={form} name="technical_concept.hosting" label="Hosting" />
        <TextInputField form={form} name="technical_concept.authentication" label="Authentication" />
        <TextInputField form={form} name="technical_concept.storage" label="Storage" />
      </Grid>
      <TextareaField form={form} name="technical_concept.architecture" label="Architecture" />
      <TextareaField form={form} name="technical_concept.entities_data_model" label="Entities / Data Model" />
      <TextareaField form={form} name="technical_concept.permissions" label="Permissions" />
      <TextareaField form={form} name="technical_concept.apis" label="APIs" />
    </SectionShell>
  )
}

export function DesignUxConceptSection({ form }: SectionProps) {
  return (
    <SectionShell title="Design / UX Concept" description="Visuelle und UX-relevante Leitplanken." templateOptions={getSectionTemplateOptions("design_ux_concept")}>
      <TextareaField form={form} name="design_ux_concept.visual_style" label="Visual Style" />
      <TextareaField form={form} name="design_ux_concept.ux_goals" label="UX Goals" />
      <TextareaField form={form} name="design_ux_concept.responsiveness" label="Responsiveness" />
      <TextareaField form={form} name="design_ux_concept.accessibility" label="Accessibility" />
    </SectionShell>
  )
}

export function ContentDataConceptSection({ form }: SectionProps) {
  return (
    <SectionShell title="Content / Data Concept" description="Content-Ownership und Informationsarchitektur." templateOptions={getSectionTemplateOptions("content_data_concept")}>
      <TextareaField form={form} name="content_data_concept.content_types" label="Content Types" />
      <TextareaField form={form} name="content_data_concept.ownership_maintenance" label="Ownership / Maintenance" />
      <TextareaField form={form} name="content_data_concept.information_architecture" label="Information Architecture" />
      <TextareaField form={form} name="content_data_concept.seo_relevant_content" label="SEO-relevant Content" />
    </SectionShell>
  )
}

export function SalesMarketingConceptSection({ form }: SectionProps) {
  return (
    <SectionShell title="Sales / Marketing Concept" description="Go-to-market und Funnel-Logik." templateOptions={getSectionTemplateOptions("sales_marketing_concept")}>
      <TextareaField form={form} name="sales_marketing_concept.sales_strategy" label="Sales Strategy" />
      <TextareaField form={form} name="sales_marketing_concept.marketing_channels" label="Marketing Channels" />
      <TextareaField form={form} name="sales_marketing_concept.funnel_conversion_logic" label="Funnel / Conversion Logic" />
      <TextareaField form={form} name="sales_marketing_concept.email_automation_strategy" label="Email / Automation Strategy" />
    </SectionShell>
  )
}

export function MarketPotentialSection({ form }: SectionProps) {
  return (
    <SectionShell title="Market Potential" description="Marktumfeld, Wettbewerb und Chancen." templateOptions={getSectionTemplateOptions("market_potential")}>
      <TextareaField form={form} name="market_potential.market_environment" label="Market Environment" />
      <TextareaField form={form} name="market_potential.demand" label="Demand" />
      <TextareaField form={form} name="market_potential.target_market" label="Target Market" />
      <TextareaField form={form} name="market_potential.competition" label="Competition" />
      <TextareaField form={form} name="market_potential.opportunities" label="Opportunities" />
    </SectionShell>
  )
}

export function MonetizationBusinessModelSection({ form }: SectionProps) {
  return (
    <SectionShell title="Monetization / Business Model" description="Erlösmodell und Pricing." templateOptions={getSectionTemplateOptions("monetization_business_model")}>
      <TextareaField form={form} name="monetization_business_model.revenue_model" label="Revenue Model" />
      <TextareaField form={form} name="monetization_business_model.pricing_strategy" label="Pricing Strategy" />
      <TextareaField form={form} name="monetization_business_model.recurring_revenue" label="Recurring Revenue" />
      <TextareaField form={form} name="monetization_business_model.upsells_add_ons" label="Upsells / Add-ons" />
    </SectionShell>
  )
}

function ScenarioFields({
  form,
  title,
  base,
}: {
  form: UseFormReturn<ProjectDocumentationInput>
  title: string
  base: "revenue_scenarios.conservative_scenario" | "revenue_scenarios.realistic_scenario" | "revenue_scenarios.optimistic_scenario"
}) {
  return (
    <div className="space-y-3 rounded-xl border border-border p-4">
      <h4 className="font-medium">{title}</h4>
      <Grid>
        <TextInputField form={form} name={`${base}.customers_per_month`} label="Customers / Month" />
        <TextInputField form={form} name={`${base}.average_order_value`} label="Average Revenue / Customer" />
      </Grid>
      <TextInputField form={form} name={`${base}.monthly_revenue`} label="Monthly Revenue" />
      <TextareaField form={form} name={`${base}.assumptions`} label="Assumptions" rows={3} />
    </div>
  )
}

export function RevenueScenariosSection({ form }: SectionProps) {
  return (
    <SectionShell title="Revenue Scenarios" description="Konservatives, realistisches und optimistisches Szenario." templateOptions={getSectionTemplateOptions("revenue_scenarios")}>
      <TextareaField form={form} name="revenue_scenarios.assumptions" label="General Assumptions" />
      <ScenarioFields form={form} title="Conservative Scenario" base="revenue_scenarios.conservative_scenario" />
      <ScenarioFields form={form} title="Realistic Scenario" base="revenue_scenarios.realistic_scenario" />
      <ScenarioFields form={form} title="Optimistic Scenario" base="revenue_scenarios.optimistic_scenario" />
      <TextareaField form={form} name="revenue_scenarios.scaling_effects" label="Scaling Effects" />
    </SectionShell>
  )
}

export function CostStructureSection({ form }: SectionProps) {
  return (
    <SectionShell title="Cost Structure" description="Tabellen für Kostenblöcke." templateOptions={getSectionTemplateOptions("cost_structure")}>
      <DynamicCostTable form={form} title="One-time Costs" name="cost_structure.one_time_costs" />
      <DynamicCostTable form={form} title="Recurring Costs" name="cost_structure.recurring_costs" />
      <DynamicCostTable form={form} title="Variable / Hidden Costs" name="cost_structure.variable_hidden_costs" />
    </SectionShell>
  )
}

export function ProfitabilitySection({ form }: SectionProps) {
  return (
    <SectionShell title="Profitability" description="Wirtschaftlichkeitsbewertung." templateOptions={getSectionTemplateOptions("profitability")}>
      <TextareaField form={form} name="profitability.revenue_vs_cost" label="Revenue vs Cost" />
      <TextareaField form={form} name="profitability.break_even" label="Break-even" />
      <TextareaField form={form} name="profitability.roi" label="ROI" />
      <TextareaField form={form} name="profitability.profitability_assessment" label="Profitability Assessment" />
    </SectionShell>
  )
}

export function BillingInvoiceModelSection({ form }: SectionProps) {
  return (
    <SectionShell title="Billing / Invoice Model" description="Abrechnung und Beispiel-Pricing." templateOptions={getSectionTemplateOptions("billing_invoice_model")}>
      <TextareaField form={form} name="billing_invoice_model.project_billing_model" label="Project Billing Model" />
      <TextareaField form={form} name="billing_invoice_model.one_time_invoice_items" label="One-time Invoice Items" />
      <TextareaField form={form} name="billing_invoice_model.recurring_invoice_items" label="Recurring Invoice Items" />
      <TextareaField form={form} name="billing_invoice_model.example_pricing" label="Example Pricing" />
    </SectionShell>
  )
}

export function RoadmapPhasesSection({ form }: SectionProps) {
  return (
    <SectionShell title="Roadmap / Phases" description="Von Konzept bis Skalierung." templateOptions={getSectionTemplateOptions("roadmap_phases")}>
      <Grid>
        <TextareaField form={form} name="roadmap_phases.concept" label="Concept" />
        <TextareaField form={form} name="roadmap_phases.design" label="Design" />
        <TextareaField form={form} name="roadmap_phases.development" label="Development" />
        <TextareaField form={form} name="roadmap_phases.testing" label="Testing" />
        <TextareaField form={form} name="roadmap_phases.launch" label="Launch" />
        <TextareaField form={form} name="roadmap_phases.scaling" label="Scaling" />
      </Grid>
    </SectionShell>
  )
}

export function MilestonesSection({ form }: SectionProps) {
  return (
    <SectionShell title="Milestones" description="Liste der Meilensteine mit Datum und Status." templateOptions={getSectionTemplateOptions("milestones")}>
      <DynamicMilestoneTable form={form} />
    </SectionShell>
  )
}

export function CurrentStatusSection({ form }: SectionProps) {
  return (
    <SectionShell title="Current Status" description="Aktueller Fortschritt und Blocker." templateOptions={getSectionTemplateOptions("current_status")}>
      <TextInputField form={form} name="current_status.global_status" label="Global Status" />
      <TextareaField form={form} name="current_status.completed_work" label="Completed Work" />
      <TextareaField form={form} name="current_status.work_in_progress" label="Work in Progress" />
      <TextareaField form={form} name="current_status.open_tasks" label="Open Tasks" />
      <TextareaField form={form} name="current_status.blockers" label="Blockers" />
    </SectionShell>
  )
}

export function RisksChallengesSection({ form }: SectionProps) {
  return (
    <SectionShell title="Risks / Challenges" description="Risiken strukturiert erfassen und absichern." templateOptions={getSectionTemplateOptions("risks_challenges")}>
      <TextareaField form={form} name="risks_challenges.technical_risks" label="Technical Risks" />
      <TextareaField form={form} name="risks_challenges.business_risks" label="Business Risks" />
      <TextareaField form={form} name="risks_challenges.organizational_risks" label="Organizational Risks" />
      <TextareaField form={form} name="risks_challenges.countermeasures" label="Countermeasures" />
    </SectionShell>
  )
}

export function ScalingPotentialSection({ form }: SectionProps) {
  return (
    <SectionShell title="Scaling Potential" description="Skalierung aus technischer und Business-Sicht." templateOptions={getSectionTemplateOptions("scaling_potential")}>
      <TextareaField form={form} name="scaling_potential.technical_scaling" label="Technical Scaling" />
      <TextareaField form={form} name="scaling_potential.business_scaling" label="Business Scaling" />
      <TextareaField form={form} name="scaling_potential.new_target_groups_markets" label="New Target Groups / Markets" />
    </SectionShell>
  )
}

export function CommunicationCoordinationSection({ form }: SectionProps) {
  return (
    <SectionShell title="Communication / Coordination" description="Meeting-Rhythmus und Dokumentationsquellen." templateOptions={getSectionTemplateOptions("communication_coordination")}>
      <TextInputField form={form} name="communication_coordination.meeting_rhythm" label="Meeting Rhythm" />
      <TextInputField form={form} name="communication_coordination.communication_channels" label="Communication Channels" />
      <TextareaField form={form} name="communication_coordination.documentation_sources" label="Documentation Sources" />
    </SectionShell>
  )
}

export function NextStepsSection({ form }: SectionProps) {
  return (
    <SectionShell title="Next Steps" description="Unmittelbare To-dos und Entscheidungen." templateOptions={getSectionTemplateOptions("next_steps")}>
      <TextareaField form={form} name="next_steps.immediate_next_steps" label="Immediate Next Steps" />
      <TextareaField form={form} name="next_steps.priorities" label="Priorities" />
      <TextareaField form={form} name="next_steps.open_decisions" label="Open Decisions" />
    </SectionShell>
  )
}

export function ManagementSummarySection({ form }: SectionProps) {
  return (
    <SectionShell title="Management Summary" description="Kurzfassung für Stakeholder." templateOptions={getSectionTemplateOptions("management_summary")}>
      <TextareaField form={form} name="management_summary.project_summary" label="Project Summary" rows={5} />
      <TextareaField form={form} name="management_summary.recommendation" label="Recommendation" rows={5} />
    </SectionShell>
  )
}

export function AppendixSection({ form }: SectionProps) {
  return (
    <SectionShell title="Appendix" description="Ergänzende Quellen und Notizen." templateOptions={getSectionTemplateOptions("appendix")}>
      <TextareaField form={form} name="appendix.relevant_links" label="Relevant Links" />
      <TextareaField form={form} name="appendix.files_documents" label="Files / Documents" />
      <TextareaField form={form} name="appendix.notes" label="Notes" />
    </SectionShell>
  )
}

export const sectionComponentMap = {
  project_overview: ProjectOverviewSection,
  initial_situation_problem: InitialSituationProblemSection,
  goals: GoalsSection,
  core_idea_solution: CoreIdeaSolutionSection,
  target_group: TargetGroupSection,
  vision_target_state: VisionTargetStateSection,
  scope_features: ScopeFeaturesSection,
  requirements: RequirementsSection,
  frontend_backend_features: FrontendBackendFeaturesSection,
  technical_concept: TechnicalConceptSection,
  design_ux_concept: DesignUxConceptSection,
  content_data_concept: ContentDataConceptSection,
  sales_marketing_concept: SalesMarketingConceptSection,
  market_potential: MarketPotentialSection,
  monetization_business_model: MonetizationBusinessModelSection,
  revenue_scenarios: RevenueScenariosSection,
  cost_structure: CostStructureSection,
  profitability: ProfitabilitySection,
  billing_invoice_model: BillingInvoiceModelSection,
  roadmap_phases: RoadmapPhasesSection,
  milestones: MilestonesSection,
  current_status: CurrentStatusSection,
  risks_challenges: RisksChallengesSection,
  scaling_potential: ScalingPotentialSection,
  communication_coordination: CommunicationCoordinationSection,
  next_steps: NextStepsSection,
  management_summary: ManagementSummarySection,
  appendix: AppendixSection,
} as const
