import { defaultDisplayTemplateId } from "@/lib/display-templates"
import { sectionIds } from "@/lib/section-ids"
import type { CostItem, MilestoneItem, ProjectDocumentation, RevenueScenario } from "@/types/project-documentation"

function getDefaultRevenueScenario(name: string): RevenueScenario {
  return {
    name,
    assumptions: "",
    customers_per_month: "",
    average_order_value: "",
    monthly_revenue: "",
  }
}

function getDefaultCostItem(): CostItem {
  return { label: "", amount: "", note: "" }
}

function getDefaultMilestone(): MilestoneItem {
  return { title: "", status: "not-started", target_date: "" }
}

const defaultSectionPresentations = sectionIds.reduce(
  (accumulator, sectionId) => {
    accumulator[sectionId] = {
      template: defaultDisplayTemplateId,
      image_1_data_url: "",
      image_2_data_url: "",
    }
    return accumulator
  },
  {} as ProjectDocumentation["section_presentations"]
)

export const defaultProjectData: ProjectDocumentation = {
  section_presentations: defaultSectionPresentations,
  project_overview: {
    banner_image_data_url: "",
    project_name: "",
    short_description: "",
    project_type: "",
    client_company: "",
    contact_person: "",
    company_email: "",
    company_phone: "",
    company_location: "",
    responsibilities: "",
  },
  initial_situation_problem: {
    current_situation: "",
    existing_problems: "",
    reason_for_start: "",
    consequences_if_not_implemented: "",
  },
  goals: {
    main_goal: "",
    sub_goals: "",
    short_term_goals: "",
    mid_term_goals: "",
    long_term_goals: "",
    kpis_success_metrics: "",
  },
  core_idea_solution: {
    core_concept: "",
    value_proposition: "",
    differentiation: "",
    unique_selling_points: "",
  },
  target_group: {
    primary_target_group: "",
    secondary_target_group: "",
    characteristics: "",
    user_roles: "",
  },
  vision_target_state: {
    desired_end_state: "",
    user_experience_goals: "",
    brand_external_perception: "",
    long_term_vision: "",
  },
  scope_features: {
    included_services: "",
    excluded_services: "",
    mvp_scope: "",
    later_expansion_stages: "",
  },
  requirements: {
    functional_requirements: "",
    non_functional_requirements: "",
    legal_organizational_requirements: "",
  },
  frontend_backend_features: {
    frontend_features: "",
    backend_features: "",
    automations: "",
    integrations: "",
  },
  technical_concept: {
    frontend_stack: "",
    backend_stack: "",
    database: "",
    hosting: "",
    authentication: "",
    storage: "",
    architecture: "",
    entities_data_model: "",
    permissions: "",
    apis: "",
  },
  design_ux_concept: {
    visual_style: "",
    ux_goals: "",
    responsiveness: "",
    accessibility: "",
  },
  content_data_concept: {
    content_types: "",
    ownership_maintenance: "",
    information_architecture: "",
    seo_relevant_content: "",
  },
  sales_marketing_concept: {
    sales_strategy: "",
    marketing_channels: "",
    funnel_conversion_logic: "",
    email_automation_strategy: "",
  },
  market_potential: {
    market_environment: "",
    demand: "",
    target_market: "",
    competition: "",
    opportunities: "",
  },
  monetization_business_model: {
    revenue_model: "",
    pricing_strategy: "",
    recurring_revenue: "",
    upsells_add_ons: "",
  },
  revenue_scenarios: {
    assumptions: "",
    conservative_scenario: getDefaultRevenueScenario("Conservative"),
    realistic_scenario: getDefaultRevenueScenario("Realistic"),
    optimistic_scenario: getDefaultRevenueScenario("Optimistic"),
    scaling_effects: "",
  },
  cost_structure: {
    one_time_costs: [getDefaultCostItem()],
    recurring_costs: [getDefaultCostItem()],
    variable_hidden_costs: [getDefaultCostItem()],
  },
  profitability: {
    revenue_vs_cost: "",
    break_even: "",
    roi: "",
    profitability_assessment: "",
  },
  billing_invoice_model: {
    project_billing_model: "",
    one_time_invoice_items: "",
    recurring_invoice_items: "",
    example_pricing: "",
  },
  roadmap_phases: {
    concept: "",
    design: "",
    development: "",
    testing: "",
    launch: "",
    scaling: "",
  },
  milestones: {
    milestone_list: [getDefaultMilestone()],
  },
  current_status: {
    global_status: "",
    completed_work: "",
    work_in_progress: "",
    open_tasks: "",
    blockers: "",
  },
  risks_challenges: {
    technical_risks: "",
    business_risks: "",
    organizational_risks: "",
    countermeasures: "",
  },
  scaling_potential: {
    technical_scaling: "",
    business_scaling: "",
    new_target_groups_markets: "",
  },
  communication_coordination: {
    meeting_rhythm: "",
    communication_channels: "",
    documentation_sources: "",
  },
  next_steps: {
    immediate_next_steps: "",
    priorities: "",
    open_decisions: "",
  },
  management_summary: {
    project_summary: "",
    recommendation: "",
  },
  appendix: {
    relevant_links: "",
    files_documents: "",
    notes: "",
  },
}
