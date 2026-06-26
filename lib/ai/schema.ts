import { z } from 'zod'
import { SECTIONS } from '@/lib/enums'

export const VariantSchema = z.object({
  copy: z.string(),
  evidence: z.string()
})

export const HypothesisSchema = z.object({
  section: z.enum(SECTIONS),
  problem: z.string(),
  current_copy: z.string(),
  variants: z.array(VariantSchema).length(3),
  impact_score: z.number().int().min(1).max(10),
  effort_score: z.number().int().min(1).max(10),
  rationale: z.string()
})

export const CompetitorSchema = z.object({
  name: z.string(),
  url: z.string()
})

export const AnalysisOutputSchema = z.object({
  competitors: z.array(CompetitorSchema).max(4),
  hypotheses: z.array(HypothesisSchema).min(5).max(8)
})

export type VariantOutput = z.infer<typeof VariantSchema>
export type CompetitorOutput = z.infer<typeof CompetitorSchema>
export type HypothesisOutput = z.infer<typeof HypothesisSchema>
export type AnalysisOutput = z.infer<typeof AnalysisOutputSchema>
