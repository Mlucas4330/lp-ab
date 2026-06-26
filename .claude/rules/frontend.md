## Pages

| Route            | Page                | Description                                          |
| ---------------- | ------------------- | ---------------------------------------------------- |
| `/`              | Landing page        | Marketing, pricing tiers, CTA, social proof          |
| `/auth/signin`   | Auth page           | Google OAuth sign in via NextAuth                    |
| `/dashboard`     | Dashboard / history | List of past analyses, "New analysis" button         |
| `/analyses/[id]` | Analysis detail     | Full hypothesis breakdown for one analysis           |
| `/billing`       | Billing / upgrade   | Stripe checkout trigger, plan display, usage counter |

## Shared layout components

### Navbar

- Logo, nav links, and an account menu (`components/account-menu.tsx`)
- Account menu: native `<details>` dropdown with the avatar/name as the summary; the panel shows
  name, email, the plan badge, and a `Sign out` button (server action calling `signOut`)
- Plan badge maps `SUBSCRIPTION_PLAN` enum to a colored pill: free = gray, solo = purple, team = amber

### Usage gate banner

- Shown to free users at 2/3 or 3/3 analyses used
- Soft warning at 2/3, hard block with upgrade CTA at 3/3

### Empty state

- Shown on dashboard when user has no analyses yet
- Single CTA: "Analyze your first landing page"

## Core feature components

### URL input form

- Single text input + submit button
- Validates URL format client-side before submitting
- Disables submit while analysis is in progress

### Analysis loader

- Skeleton cards shown while `POST /api/analyses` is pending
- Three-phase progress label: "Scraping page..." -> "Analyzing copy..." -> "Saving results..."

### Analysis circuit (analysis detail page)

The most important experience in the product. The analysis detail page is a guided **circuit**
that walks the user section by section (one step per hypothesis, ordered by impact desc):

- Benchmarked-against line: the competitors (`analyses.competitors`) the variants were grounded
  in, rendered as links near the top.
- Progress path: section-colored nodes joined by a gradient line that fills as you advance;
  nodes are clickable to jump. A final node leads to the summary.
- Each step: section badge + "Section X of N" + the problem as a headline + impact/effort score
  pills, then the option cards.
- Option cards (`OptionCard`): the 3 variants + a "No change" (keep current copy) card. Each
  variant card shows a "Why:" evidence line citing the competitor pattern it borrows. Selecting
  one fills it with the section's color (`SECTION_SELECTED_CLASS`) and auto-advances.
- Selecting persists the choice as that variant's `winner` status (`PATCH /api/variants/[id]`)
  and resets the previously chosen sibling to `proposed`; "No change" clears any winner. Choices
  are restored from variant statuses on reload.
- Summary (`CircuitSummary`): lists each section -> chosen copy with "Copy to clipboard" and
  "Download .md" (built by `buildPlanMarkdown` in `lib/export.ts`).

### Section badge

- Colored pill mapped to each `SECTIONS` enum value
- Used inside the circuit steps and summary
- Color mapping (consistent across the app):
    - `headline` -> purple
    - `subheadline` -> purple (lighter)
    - `cta` -> coral
    - `social_proof` -> teal
    - `pricing` -> amber
    - `features` -> blue
    - `hero_image` -> gray
    - `navigation` -> gray
    - `other` -> gray

### Score indicator

- Visual bar or numbered badge for `impact_score` and `effort_score` (1-10)
- Impact: higher = warmer color (coral at 8-10, amber at 5-7, gray at 1-4)
- Effort: lower = better (green at 1-3, amber at 4-6, red at 7-10)

## Billing components

### Plan card

- Displays free / solo / team tiers
- Features list per tier
- CTA button triggers `POST /api/billing/checkout`

### Usage counter

- "2 of 3 analyses used this month"
- Pulls from `GET /api/usage`
- Only visible to free tier users
