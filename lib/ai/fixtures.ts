import type { AnalysisOutput } from '@/lib/ai/schema'

// Deterministic output used when E2E_FIXTURES=1 so end-to-end tests can run without
// scraping, web search, or calling Claude. Ordered by impact_score descending.
// Variants are templates (with [placeholders]) inspired by competitor strategy -- never
// fabricated numbers, quotes, or competitor names in the copy itself.
export const FIXTURE_ANALYSIS: AnalysisOutput = {
  competitors: [
    { name: 'Linear', url: 'https://linear.app' },
    { name: 'Vercel', url: 'https://vercel.com' },
    { name: 'Retool', url: 'https://retool.com' }
  ],
  hypotheses: [
    {
      section: 'headline',
      problem: 'The headline describes the product category instead of the outcome the visitor wants.',
      current_copy: 'The all-in-one platform for modern teams',
      variants: [
        {
          copy: 'Ship faster: cut your release cycle from [weeks] to [days]',
          evidence: 'Linear leads with a quantified speed outcome - plug in your real before/after numbers.'
        },
        {
          copy: 'The workspace that gets [your core job] done in [timeframe]',
          evidence: 'Vercel headlines a concrete time-to-value - fill in the job and timeframe you can prove.'
        },
        {
          copy: 'Stop [specific pain]. Start shipping.',
          evidence: 'Retool frames the headline against the cost of the status quo - name the pain your buyers feel.'
        }
      ],
      impact_score: 9,
      effort_score: 2,
      rationale: 'A specific, quantified outcome in the headline raises perceived value within the first 5 seconds, matching how the strongest competitors open.'
    },
    {
      section: 'cta',
      problem: 'The primary CTA is generic and adds friction by implying a long commitment.',
      current_copy: 'Get started',
      variants: [
        {
          copy: 'Start free, no card required',
          evidence: 'Linear and Vercel remove payment risk at the primary CTA - use only if your trial truly needs no card.'
        },
        {
          copy: 'Try it free for [trial length]',
          evidence: 'Retool anchors the CTA on a concrete trial length - set your real trial duration.'
        },
        {
          copy: 'Create your free [workspace]',
          evidence: 'Linear pairs an action verb with the product\'s core noun - swap in your own object.'
        }
      ],
      impact_score: 8,
      effort_score: 1,
      rationale: 'Removing risk and signalling zero cost lowers friction at the decision point, a lever every benchmarked competitor pulls.'
    },
    {
      section: 'social_proof',
      problem: 'Social proof is a vague logo strip with no credibility or relevance to the buyer.',
      current_copy: 'Trusted by teams everywhere',
      variants: [
        {
          copy: 'Trusted by [number] teams shipping every day',
          evidence: 'Linear quantifies adoption instead of asserting trust - drop in your real active-team count.'
        },
        {
          copy: '"[Result they got]" - [Name], [Title] at [Company]',
          evidence: 'Retool opens social proof with a specific outcome quote - use a real, attributable customer quote.'
        },
        {
          copy: 'Backed by teams at [logo], [logo], and [logo]',
          evidence: 'Vercel pairs proof with recognizable named logos - show real customer logos you can use.'
        }
      ],
      impact_score: 7,
      effort_score: 3,
      rationale: 'Concrete numbers and recognizable names convert abstract trust into verifiable evidence, as the strongest competitor pages do.'
    },
    {
      section: 'pricing',
      problem: 'Pricing leads with the highest tier, anchoring visitors on cost before value.',
      current_copy: 'Enterprise - $99/user/mo',
      variants: [
        {
          copy: 'Free for [solo builders]. Scale to [Pro] at [$price]/user/mo as your team grows.',
          evidence: 'Vercel anchors on a free entry tier before paid - map this to your real tiers.'
        },
        {
          copy: 'Start free. Upgrade to [Pro] for [$price]/user/mo, cancel anytime.',
          evidence: 'Linear pairs a free tier with low-commitment upgrade language.'
        },
        {
          copy: 'Free forever for [small teams] - [Pro] from [$price]/user/mo',
          evidence: 'Retool leads pricing with a durable free plan.'
        }
      ],
      impact_score: 6,
      effort_score: 4,
      rationale: 'Anchoring on a low-friction entry point reduces sticker shock, mirroring how competitors structure their pricing page.'
    },
    {
      section: 'features',
      problem: 'Features are listed as capabilities, not benefits the buyer cares about.',
      current_copy: 'Real-time sync, API access, role-based permissions',
      variants: [
        {
          copy: 'Everyone sees the same data instantly. Automate your stack with the API. Control who can touch what.',
          evidence: 'Linear frames each feature as a job-to-be-done - keep your real capabilities, lead with the outcome.'
        },
        {
          copy: 'No more [stale data], [manual exports], or [permission headaches]',
          evidence: 'Retool frames features by the pain they remove - name the real pains your features solve.'
        },
        {
          copy: 'Real-time for your team. API for your tools. Control for your admins.',
          evidence: 'Vercel maps each capability to the audience that benefits.'
        }
      ],
      impact_score: 5,
      effort_score: 3,
      rationale: 'Reframing capabilities as outcomes connects each feature to a buyer goal, as competitor feature sections do.'
    },
    {
      section: 'subheadline',
      problem: 'The subheadline repeats the headline instead of handling the next objection.',
      current_copy: 'Built for teams that move fast',
      variants: [
        {
          copy: 'Set up in [setup time]. No migration, no training, cancel anytime.',
          evidence: 'Vercel pre-empts setup-effort objections - use your real onboarding time.'
        },
        {
          copy: 'Up and running in [minutes] - no migration required',
          evidence: 'Linear quantifies time-to-first-value - fill in your real setup time.'
        },
        {
          copy: 'Import in one click. Cancel anytime.',
          evidence: 'Retool handles the lock-in objection early.'
        }
      ],
      impact_score: 4,
      effort_score: 2,
      rationale: 'Using the subheadline to pre-empt the top objection keeps momentum toward the CTA, as competitor pages do.'
    }
  ]
}
