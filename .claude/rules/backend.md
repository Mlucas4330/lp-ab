## Database schema

```
users
- id                 (uuid, PK)
- email              (text, unique)
- name               (text)
- avatar_url         (text, nullable)
- plan               (enum: SUBSCRIPTION_PLAN, default: free)
- stripe_customer_id (text, nullable)
- analyses_count     (int, default: 0)   <- free tier usage gate
- created_at         (timestamp)

subscriptions
- id                     (uuid, PK)
- user_id                (FK -> users.id)
- stripe_subscription_id (text, unique)
- plan                   (enum: SUBSCRIPTION_PLAN)
- status                 (text: active | canceled | past_due)
- current_period_end     (timestamp)
- created_at             (timestamp)

analyses
- id          (uuid, PK)
- user_id     (FK -> users.id)
- url         (text)
- competitors (jsonb, nullable: { name, url }[] benchmarked against)
- created_at  (timestamp)

hypotheses
- id             (uuid, PK)
- analysis_id    (FK -> analyses.id)
- section        (enum: SECTIONS)
- problem        (text)
- current_copy   (text)
- impact_score   (int, 1-10)
- effort_score   (int, 1-10)
- rationale      (text)
- status         (enum: HYPOTHESIS_STATUS, default: pending)
- created_at     (timestamp)

variants
- id             (uuid, PK)
- hypothesis_id  (FK -> hypotheses.id)
- copy           (text)
- evidence       (text, nullable: competitor pattern this variant borrows/beats)
- status         (enum: VARIANT_STATUS, default: proposed)
- created_at     (timestamp)
```

**Relations**

```
users       1 -> N  analyses
analyses    1 -> N  hypotheses
hypotheses  1 -> N  variants
users       1 -> 1  subscriptions
```

## API routes

### Auth

`GET|POST /api/auth/[...nextauth]`
Standard NextAuth catch-all. Handles Google OAuth callback, session creation, and user upsert into `users` on first login.

### Analyses

`POST /api/analyses`
Core route. Chain: check usage gate -> Puppeteer scrape -> preprocess HTML -> Claude API -> persist -> return.

Request:

```json
{ "url": "https://example.com" }
```

Response:

```json
{
  "analysis": {
    "id": "uuid",
    "url": "https://example.com",
    "created_at": "timestamp",
    "hypotheses": [ ...HypothesisRow[] ]
  }
}
```

Errors:

- `403` - free tier limit reached
- `422` - invalid or unsupported URL
- `502` - Puppeteer scrape failed
- `500` - Claude API or DB failure

**Usage gate logic:**

```typescript
if (user.plan === 'free' && user.analyses_count >= 3) {
    return Response.json({ error: 'limit_reached' }, { status: 403 })
}
```

`GET /api/analyses`
Returns analysis history. Free users: last 3. Paid: paginated.

Query params: `?page=1&limit=10`

Response:

```json
{
  "analyses": [ ...AnalysisRow[] ],
  "total": 12,
  "page": 1
}
```

`GET /api/analyses/[id]`
Returns one analysis with all hypotheses. Returns `404` if not found or not owned by the requesting user.

### Hypotheses

`PATCH /api/hypotheses/[id]`
Updates `status` only. Validates against `HYPOTHESIS_STATUS` enum.

Request:

```json
{ "status": "testing" }
```

Response: updated hypothesis row.

### Variants

`PATCH /api/variants/[id]`
Updates `status` only. Validates against `VARIANT_STATUS` enum. Ownership enforced by joining
`variants -> hypotheses -> analyses` on the requesting user.

Request:

```json
{ "status": "winner" }
```

Response: updated variant row.

### Billing

`POST /api/billing/checkout`
Creates Stripe Checkout session.

Request:

```json
{ "plan": "solo" }
```

Response:

```json
{ "url": "https://checkout.stripe.com/..." }
```

`POST /api/billing/portal`
Creates Stripe Customer Portal session for plan management.

Response:

```json
{ "url": "https://billing.stripe.com/..." }
```

`POST /api/billing/webhook`
Stripe webhook receiver. **Must be excluded from NextAuth middleware.**

Handled events:

- `checkout.session.completed` -> create `subscriptions` row, update `users.plan`
- `customer.subscription.updated` -> update `subscriptions.status` and `plan`
- `customer.subscription.deleted` -> set `plan` back to `free`, mark subscription `canceled`

Verify signature with `stripe.webhooks.constructEvent` before processing.

### Usage

`GET /api/usage`
Returns usage data for the current user.

Response:

```json
{
    "analyses_count": 2,
    "limit": 3,
    "plan": "free"
}
```

## AI pipeline

### 1. Preprocess scraped HTML

Strip scripts, styles, and meta tags. Extract semantic text only:

```
H1: ...
Subheadline: ...
CTA button: ...
Feature: ...
Testimonial: ...
Pricing: ...
```

### 2. Zod schema (matches DB schema exactly)

```typescript
import { generateObject } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'
import { SECTIONS } from '@/lib/enums'

const VariantSchema = z.object({ copy: z.string(), evidence: z.string() })

const HypothesisSchema = z.object({
    section: z.enum(SECTIONS),
    problem: z.string(),
    current_copy: z.string(),
    variants: z.array(VariantSchema).length(3),
    impact_score: z.number().int().min(1).max(10),
    effort_score: z.number().int().min(1).max(10),
    rationale: z.string()
})

const CompetitorSchema = z.object({ name: z.string(), url: z.string() })

const AnalysisOutputSchema = z.object({
    competitors: z.array(CompetitorSchema).max(4),
    hypotheses: z.array(HypothesisSchema).min(5).max(8)
})
```

### 2b. Competitor research (web search)

Before structured generation, run a web-search step with the official Anthropic SDK
(`@anthropic-ai/sdk`, tool `web_search_20250305`) using `COMPETITOR_RESEARCH_PROMPT` to find 2-3
real competitor landing pages and summarize their positioning into a brief. The brief is passed
into `generateObject` so variants are grounded in competitors, and each variant carries an
`evidence` line naming the competitor pattern it borrows. Degrades gracefully to an empty brief
(no `ANTHROPIC_API_KEY` / failure) so generation still succeeds. Skipped when `E2E_FIXTURES=1`.

### 3. Call

```typescript
const result = await generateObject({
    model: anthropic('claude-sonnet-4-6'),
    schema: AnalysisOutputSchema,
    system: SYSTEM_PROMPT,
    prompt: `Landing page copy:\n\n${cleanedPageContent}\n\nCompetitive research brief:\n\n${brief}`
})

const { competitors, hypotheses } = result.object
```

### 4. System prompt (core IP - iterate carefully)

Focus on: grounding every hypothesis/variant in the competitor brief, specificity of claims, CTA
strength, social proof quality, value proposition clarity, friction reduction. Return 5-8
hypotheses ranked by impact score descending, each with 3 evidence-bearing variants.

---

## Middleware - `middleware.ts`

Protect all `/dashboard`, `/analyses`, and `/billing` routes with NextAuth session check.
Exclude `/api/billing/webhook` from auth middleware - Stripe calls it directly.
