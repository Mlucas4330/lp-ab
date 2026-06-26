import { SECTION_LABEL } from '@/lib/constants'
import type { Section } from '@/lib/enums'

export interface PlanStep {
  section: Section
  problem: string
  currentCopy: string
  chosenCopy: string | null
  chosenEvidence: string | null
}

export interface PlanCompetitor {
  name: string
  url: string
}

export function buildPlanMarkdown(
  url: string,
  steps: PlanStep[],
  competitors: PlanCompetitor[]
): string {
  const lines = [`# A/B test plan`, ``, `Source: ${url}`]

  if (competitors.length > 0) {
    lines.push(``, `Benchmarked against: ${competitors.map((c) => `${c.name} (${c.url})`).join(', ')}`)
  }

  for (const step of steps) {
    const chosen = step.chosenCopy ?? 'Keep current copy'
    lines.push(
      ``,
      `## ${SECTION_LABEL[step.section]}`,
      ``,
      `**Problem:** ${step.problem}`,
      ``,
      `**Current:** ${step.currentCopy}`,
      ``,
      `**Chosen:** ${chosen}`
    )
    if (step.chosenEvidence) lines.push(``, `**Why:** ${step.chosenEvidence}`)
  }

  return lines.join('\n')
}
