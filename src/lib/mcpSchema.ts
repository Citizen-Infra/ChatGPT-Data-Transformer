/**
 * MCP output schemas — aligned with Portable-ChatGPT-Data-Transformer repo.
 * Used so the zip matches what Claude / Python transformer produce.
 */

export const USAGE_MODES_CATEGORIES = [
  { id: "idea_sensemaking", label: "Idea generation & sensemaking", definition: "Exploring ideas, pressure-testing assumptions, working through complex questions, thinking out loud.", examples_of_signals: ["what if", "help me think", "pressure test", "does this make sense", "map out"] },
  { id: "writing_editing", label: "Writing & editing", definition: "Drafting, rewriting, refining tone, summarizing, restructuring text.", examples_of_signals: ["rewrite", "edit", "tighten", "make this clearer", "tone", "draft"] },
  { id: "business_planning", label: "Business & project planning", definition: "Product strategy, planning next steps, positioning, roadmaps, prioritization.", examples_of_signals: ["mvp", "roadmap", "strategy", "positioning", "launch plan", "next steps"] },
  { id: "research_explanation", label: "Research & explanation", definition: "Asking for background, definitions, comparisons, explanations to build understanding.", examples_of_signals: ["what is", "why does", "explain", "compare", "definition", "research"] },
  { id: "technical_coding", label: "Technical / coding help", definition: "Coding, debugging, technical design, implementation guidance.", examples_of_signals: ["error", "stack trace", "function", "api", "schema", "python", "javascript"] },
  { id: "personal_reflection", label: "Personal reflection & sensemaking", definition: "Values exploration, emotional processing, identity/meaning questions.", examples_of_signals: ["i feel", "i'm struggling", "what does it mean", "relationship", "values"] },
  { id: "other_mixed", label: "Other / mixed", definition: "Items that do not cleanly fit a primary category or are low-confidence.", examples_of_signals: [] as string[] },
] as const;

export const PROBLEM_TYPES = [
  { id: "work_process", label: "Work process & workflow" },
  { id: "product_strategy", label: "Product strategy & go-to-market" },
  { id: "tooling_build", label: "Tooling & infrastructure building" },
  { id: "writing_publishing", label: "Writing & publishing" },
  { id: "research_sensemaking", label: "Research & sensemaking" },
  { id: "community_organizing", label: "Community & organizing" },
  { id: "personal_life", label: "Personal life & relationships" },
  { id: "other_mixed", label: "Other / mixed" },
] as const;

export const PROJECT_TYPES = [
  { id: "writing_publishing", label: "Writing / Publishing" },
  { id: "product_tool_building", label: "Product / Tool Building" },
  { id: "research_frameworks", label: "Research / Framework Development" },
  { id: "business_strategy", label: "Business / Strategy" },
  { id: "creative_experimental", label: "Creative / Experimental" },
  { id: "other_mixed", label: "Other / Mixed" },
] as const;

export const DETECTION_METADATA = {
  explicit_project_markers: ["my project is", "I'm working on a project", "this project is about", "for this project", "the project I'm building", "I'm calling this", "I want to turn this into a project", "this started as a project", "I've been developing", "I'm prototyping", "I'm launching", "I'm building", "I'm designing", "I'm writing", "I'm working on", "I've been working on", "I want to ship", "I want to release", "I want to publish"],
  artifact_terms: ["project", "mvp", "roadmap", "feature", "deck", "prototype", "spec", "schema", "outline", "draft", "article", "essay", "book", "calculator", "tool", "framework", "model"],
  problem_markers: ["I'm trying to", "I need to", "the problem is", "I'm stuck", "I'm worried", "how do I"],
  promotion_rules: {
    project_threshold: ">= 3 distinct conversations OR >= 1 sustained deep thread OR explicit project naming",
    problem_required: "Each project should attempt a 'problem_statement' and 'problem_type'. If unclear, set to 'other_mixed' with low confidence.",
  },
} as const;

/** Fixed worldview lens taxonomy (WORLDVIEW_MAPPING_RULES) */
export const WORLDVIEW_LENSES_TAXONOMY = [
  { lens_id: "power_ethics_impacts", label: "Power, ethics, and downstream impacts", description: "A recurring lens that emphasizes who benefits, who bears risk, and what consequences follow." },
  { lens_id: "systems_over_isolated_fixes", label: "Systems over isolated fixes", description: "Focus on systemic patterns and interdependencies rather than one-off solutions." },
  { lens_id: "anti_extractive_skepticism", label: "Skepticism of extractive or centralized models", description: "Recurring caution about models that extract value or centralize control without reciprocity." },
  { lens_id: "agency_context_preservation", label: "Preserving agency and context", description: "Emphasis on keeping agency, context, and meaning intact when designing or deploying systems." },
] as const;
