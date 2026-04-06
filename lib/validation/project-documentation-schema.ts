import { displayTemplates } from "@/lib/display-templates"
import { sectionIds } from "@/lib/section-ids"
import { z } from "zod"

const textFieldSchema = z.string().trim()
const emailFieldSchema = z
  .string()
  .trim()
  .refine((value) => value === "" || z.string().email().safeParse(value).success, "Bitte eine gültige E-Mail eingeben.")
const phoneFieldSchema = z
  .string()
  .trim()
  .refine((value) => value === "" || /^[+\d()\-./\s]{6,25}$/.test(value), "Bitte eine gültige Telefonnummer eingeben.")

const scenarioSchema = z.object({
  name: textFieldSchema,
  assumptions: textFieldSchema,
  customers_per_month: textFieldSchema,
  average_order_value: textFieldSchema,
  monthly_revenue: textFieldSchema,
})

const costItemSchema = z.object({
  label: textFieldSchema,
  amount: textFieldSchema,
  note: textFieldSchema,
})

const milestoneSchema = z.object({
  title: textFieldSchema,
  status: z.enum(["not-started", "in-progress", "done", "blocked"]),
  target_date: textFieldSchema,
})

const displayTemplateEnumValues = displayTemplates.map((template) => template.id) as [
  (typeof displayTemplates)[number]["id"],
  ...(typeof displayTemplates)[number]["id"][],
]

const sectionPresentationSchema = z.object({
  template: z.enum(displayTemplateEnumValues),
  image_1_data_url: z
    .string()
    .trim()
    .refine((value) => value === "" || value.startsWith("data:image/"), "Bild 1 muss ein Bild sein."),
  image_2_data_url: z
    .string()
    .trim()
    .refine((value) => value === "" || value.startsWith("data:image/"), "Bild 2 muss ein Bild sein."),
})

const sectionPresentationsSchema = z.object(
  Object.fromEntries(sectionIds.map((sectionId) => [sectionId, sectionPresentationSchema])) as Record<
    (typeof sectionIds)[number],
    typeof sectionPresentationSchema
  >
)

export const projectDocumentationSchema = z.object({
  section_presentations: sectionPresentationsSchema,
  project_overview: z.object({
    banner_image_data_url: z
      .string()
      .trim()
      .refine(
        (value) =>
          value === "" || value.startsWith("data:image/"),
        "Banner muss ein Bild sein."
      ),
    project_name: textFieldSchema.min(2, "Projektname ist erforderlich"),
    short_description: textFieldSchema,
    project_type: textFieldSchema,
    client_company: textFieldSchema,
    contact_person: textFieldSchema,
    company_email: emailFieldSchema,
    company_phone: phoneFieldSchema,
    company_location: textFieldSchema,
    responsibilities: textFieldSchema,
  }),
  initial_situation_problem: z.object({
    current_situation: textFieldSchema,
    existing_problems: textFieldSchema,
    reason_for_start: textFieldSchema,
    consequences_if_not_implemented: textFieldSchema,
  }),
  goals: z.object({
    main_goal: textFieldSchema,
    sub_goals: textFieldSchema,
    short_term_goals: textFieldSchema,
    mid_term_goals: textFieldSchema,
    long_term_goals: textFieldSchema,
    kpis_success_metrics: textFieldSchema,
  }),
  core_idea_solution: z.object({
    core_concept: textFieldSchema,
    value_proposition: textFieldSchema,
    differentiation: textFieldSchema,
    unique_selling_points: textFieldSchema,
  }),
  target_group: z.object({
    primary_target_group: textFieldSchema,
    secondary_target_group: textFieldSchema,
    characteristics: textFieldSchema,
    user_roles: textFieldSchema,
  }),
  vision_target_state: z.object({
    desired_end_state: textFieldSchema,
    user_experience_goals: textFieldSchema,
    brand_external_perception: textFieldSchema,
    long_term_vision: textFieldSchema,
  }),
  scope_features: z.object({
    included_services: textFieldSchema,
    excluded_services: textFieldSchema,
    mvp_scope: textFieldSchema,
    later_expansion_stages: textFieldSchema,
  }),
  requirements: z.object({
    functional_requirements: textFieldSchema,
    non_functional_requirements: textFieldSchema,
    legal_organizational_requirements: textFieldSchema,
  }),
  frontend_backend_features: z.object({
    frontend_features: textFieldSchema,
    backend_features: textFieldSchema,
    automations: textFieldSchema,
    integrations: textFieldSchema,
  }),
  technical_concept: z.object({
    frontend_stack: textFieldSchema,
    backend_stack: textFieldSchema,
    database: textFieldSchema,
    hosting: textFieldSchema,
    authentication: textFieldSchema,
    storage: textFieldSchema,
    architecture: textFieldSchema,
    entities_data_model: textFieldSchema,
    permissions: textFieldSchema,
    apis: textFieldSchema,
  }),
  design_ux_concept: z.object({
    visual_style: textFieldSchema,
    ux_goals: textFieldSchema,
    responsiveness: textFieldSchema,
    accessibility: textFieldSchema,
  }),
  content_data_concept: z.object({
    content_types: textFieldSchema,
    ownership_maintenance: textFieldSchema,
    information_architecture: textFieldSchema,
    seo_relevant_content: textFieldSchema,
  }),
  sales_marketing_concept: z.object({
    sales_strategy: textFieldSchema,
    marketing_channels: textFieldSchema,
    funnel_conversion_logic: textFieldSchema,
    email_automation_strategy: textFieldSchema,
  }),
  market_potential: z.object({
    market_environment: textFieldSchema,
    demand: textFieldSchema,
    target_market: textFieldSchema,
    competition: textFieldSchema,
    opportunities: textFieldSchema,
  }),
  monetization_business_model: z.object({
    revenue_model: textFieldSchema,
    pricing_strategy: textFieldSchema,
    recurring_revenue: textFieldSchema,
    upsells_add_ons: textFieldSchema,
  }),
  revenue_scenarios: z.object({
    assumptions: textFieldSchema,
    conservative_scenario: scenarioSchema,
    realistic_scenario: scenarioSchema,
    optimistic_scenario: scenarioSchema,
    scaling_effects: textFieldSchema,
  }),
  cost_structure: z.object({
    one_time_costs: z.array(costItemSchema).min(1),
    recurring_costs: z.array(costItemSchema).min(1),
    variable_hidden_costs: z.array(costItemSchema).min(1),
  }),
  profitability: z.object({
    revenue_vs_cost: textFieldSchema,
    break_even: textFieldSchema,
    roi: textFieldSchema,
    profitability_assessment: textFieldSchema,
  }),
  billing_invoice_model: z.object({
    project_billing_model: textFieldSchema,
    one_time_invoice_items: textFieldSchema,
    recurring_invoice_items: textFieldSchema,
    example_pricing: textFieldSchema,
  }),
  roadmap_phases: z.object({
    concept: textFieldSchema,
    design: textFieldSchema,
    development: textFieldSchema,
    testing: textFieldSchema,
    launch: textFieldSchema,
    scaling: textFieldSchema,
  }),
  milestones: z.object({
    milestone_list: z.array(milestoneSchema).min(1),
  }),
  current_status: z.object({
    global_status: textFieldSchema,
    completed_work: textFieldSchema,
    work_in_progress: textFieldSchema,
    open_tasks: textFieldSchema,
    blockers: textFieldSchema,
  }),
  risks_challenges: z.object({
    technical_risks: textFieldSchema,
    business_risks: textFieldSchema,
    organizational_risks: textFieldSchema,
    countermeasures: textFieldSchema,
  }),
  scaling_potential: z.object({
    technical_scaling: textFieldSchema,
    business_scaling: textFieldSchema,
    new_target_groups_markets: textFieldSchema,
  }),
  communication_coordination: z.object({
    meeting_rhythm: textFieldSchema,
    communication_channels: textFieldSchema,
    documentation_sources: textFieldSchema,
  }),
  next_steps: z.object({
    immediate_next_steps: textFieldSchema,
    priorities: textFieldSchema,
    open_decisions: textFieldSchema,
  }),
  management_summary: z.object({
    project_summary: textFieldSchema,
    recommendation: textFieldSchema,
  }),
  appendix: z.object({
    relevant_links: textFieldSchema,
    files_documents: textFieldSchema,
    notes: textFieldSchema,
  }),
})

export type ProjectDocumentationInput = z.infer<typeof projectDocumentationSchema>
