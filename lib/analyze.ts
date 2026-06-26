import Anthropic from '@anthropic-ai/sdk'
import { generateObject } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { AnalysisOutputSchema, type AnalysisOutput } from '@/lib/ai/schema'
import { COMPETITOR_RESEARCH_PROMPT, SYSTEM_PROMPT } from '@/lib/ai/prompt'
import { FIXTURE_ANALYSIS } from '@/lib/ai/fixtures'
import { preprocessHtml, scrapePage } from '@/lib/scrape'

const MODEL = 'claude-sonnet-4-6'

export async function analyzeLandingPage(url: string): Promise<AnalysisOutput> {
  if (process.env.E2E_FIXTURES === '1') return FIXTURE_ANALYSIS

  const { html } = await scrapePage(url)
  const content = preprocessHtml(html)

  const research = await researchCompetitors(content)

  const { object } = await generateObject({
    model: anthropic(MODEL),
    schema: AnalysisOutputSchema,
    system: SYSTEM_PROMPT,
    prompt: `Landing page copy:\n\n${content}\n\nCompetitive research brief:\n\n${research || 'No competitor research available.'}`
  })

  return object
}

// Uses the official Anthropic SDK's web search server tool to find and read competitor
// landing pages. Degrades gracefully (returns '') so generation still succeeds without it.
async function researchCompetitors(pageContent: string): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) return ''

  try {
    const client = new Anthropic()
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 2048,
      tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 5 }],
      messages: [
        {
          role: 'user',
          content: `${COMPETITOR_RESEARCH_PROMPT}\n\nLanding page copy:\n\n${pageContent}`
        }
      ]
    })

    return message.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('\n')
      .trim()
  } catch {
    return ''
  }
}
