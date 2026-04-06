import type { DisplayTemplateId } from "@/lib/display-templates"
import type { SectionId } from "@/lib/section-ids"

export interface KeyValueItem {
  label: string
  value: string
}

export interface RevenueScenario {
  name: string
  assumptions: string
  customers_per_month: string
  average_order_value: string
  monthly_revenue: string
}

export interface MilestoneItem {
  title: string
  status: "not-started" | "in-progress" | "done" | "blocked"
  target_date: string
}

export interface CostItem {
  label: string
  amount: string
  note: string
}

export interface SectionPresentation {
  template: DisplayTemplateId
  image_1_data_url: string
  image_2_data_url: string
}

export interface ProjectDocumentation {
  section_presentations: Record<SectionId, SectionPresentation>
  project_overview: {
    banner_image_data_url: string
    project_name: string
    short_description: string
    project_type: string
    client_company: string
    contact_person: string
    company_email: string
    company_phone: string
    company_location: string
    responsibilities: string
  }
  initial_situation_problem: {
    current_situation: string
    existing_problems: string
    reason_for_start: string
    consequences_if_not_implemented: string
  }
  goals: {
    main_goal: string
    sub_goals: string
    short_term_goals: string
    mid_term_goals: string
    long_term_goals: string
    kpis_success_metrics: string
  }
  core_idea_solution: {
    core_concept: string
    value_proposition: string
    differentiation: string
    unique_selling_points: string
  }
  target_group: {
    primary_target_group: string
    secondary_target_group: string
    characteristics: string
    user_roles: string
  }
  vision_target_state: {
    desired_end_state: string
    user_experience_goals: string
    brand_external_perception: string
    long_term_vision: string
  }
  scope_features: {
    included_services: string
    excluded_services: string
    mvp_scope: string
    later_expansion_stages: string
  }
  requirements: {
    functional_requirements: string
    non_functional_requirements: string
    legal_organizational_requirements: string
  }
  frontend_backend_features: {
    frontend_features: string
    backend_features: string
    automations: string
    integrations: string
  }
  technical_concept: {
    frontend_stack: string
    backend_stack: string
    database: string
    hosting: string
    authentication: string
    storage: string
    architecture: string
    entities_data_model: string
    permissions: string
    apis: string
  }
  design_ux_concept: {
    visual_style: string
    ux_goals: string
    responsiveness: string
    accessibility: string
  }
  content_data_concept: {
    content_types: string
    ownership_maintenance: string
    information_architecture: string
    seo_relevant_content: string
  }
  sales_marketing_concept: {
    sales_strategy: string
    marketing_channels: string
    funnel_conversion_logic: string
    email_automation_strategy: string
  }
  market_potential: {
    market_environment: string
    demand: string
    target_market: string
    competition: string
    opportunities: string
  }
  monetization_business_model: {
    revenue_model: string
    pricing_strategy: string
    recurring_revenue: string
    upsells_add_ons: string
  }
  revenue_scenarios: {
    assumptions: string
    conservative_scenario: RevenueScenario
    realistic_scenario: RevenueScenario
    optimistic_scenario: RevenueScenario
    scaling_effects: string
  }
  cost_structure: {
    one_time_costs: CostItem[]
    recurring_costs: CostItem[]
    variable_hidden_costs: CostItem[]
  }
  profitability: {
    revenue_vs_cost: string
    break_even: string
    roi: string
    profitability_assessment: string
  }
  billing_invoice_model: {
    project_billing_model: string
    one_time_invoice_items: string
    recurring_invoice_items: string
    example_pricing: string
  }
  roadmap_phases: {
    concept: string
    design: string
    development: string
    testing: string
    launch: string
    scaling: string
  }
  milestones: {
    milestone_list: MilestoneItem[]
  }
  current_status: {
    global_status: string
    completed_work: string
    work_in_progress: string
    open_tasks: string
    blockers: string
  }
  risks_challenges: {
    technical_risks: string
    business_risks: string
    organizational_risks: string
    countermeasures: string
  }
  scaling_potential: {
    technical_scaling: string
    business_scaling: string
    new_target_groups_markets: string
  }
  communication_coordination: {
    meeting_rhythm: string
    communication_channels: string
    documentation_sources: string
  }
  next_steps: {
    immediate_next_steps: string
    priorities: string
    open_decisions: string
  }
  management_summary: {
    project_summary: string
    recommendation: string
  }
  appendix: {
    relevant_links: string
    files_documents: string
    notes: string
  }
}
