import Link from 'next/link'
import { desc, eq } from 'drizzle-orm'
import { db } from '@/db'
import { analyses } from '@/db/schema'
import { getCurrentUser } from '@/lib/current-user'
import { UrlInputForm } from '@/components/url-input-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  const rows = user
    ? await db
        .select()
        .from(analyses)
        .where(eq(analyses.userId, user.id))
        .orderBy(desc(analyses.createdAt))
    : []

  return (
    <div className="animate-fade-up space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Your analyses</h1>
        <p className="text-sm text-muted-foreground">
          Paste a landing page URL to generate ranked A/B test hypotheses.
        </p>
      </div>

      <UrlInputForm />

      {rows.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No analyses yet</CardTitle>
            <CardDescription>
              Paste a landing page URL above to generate your first set of A/B test hypotheses.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-3" data-testid="analysis-history">
          {rows.map((analysis) => (
            <Link key={analysis.id} href={`/analyses/${analysis.id}`} className="block">
              <Card className="transition-all hover:-translate-y-0.5 hover:shadow-sm">
                <CardContent className="flex items-center justify-between gap-4 p-4">
                  <span className="truncate text-sm font-medium">{analysis.url}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {analysis.createdAt.toLocaleDateString()}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
