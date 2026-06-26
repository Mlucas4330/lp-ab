import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PLAN_PRICES, PLAN_SEATS, FREE_ANALYSES_LIMIT } from '@/lib/constants'
import { SUBSCRIPTION_PLAN } from '@/lib/enums'
import { getCurrentUser } from '@/lib/current-user'

export default async function BillingPage() {
  const user = await getCurrentUser()

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Billing</h1>

      {user?.plan === 'free' && (
        <Card data-testid="usage-counter">
          <CardContent className="p-4 text-sm">
            {user.analysesCount} of {FREE_ANALYSES_LIMIT} analyses used this month
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 sm:grid-cols-3">
        {SUBSCRIPTION_PLAN.map((plan) => {
          const isCurrent = user?.plan === plan
          return (
            <Card key={plan}>
              <CardHeader>
                <CardTitle className="capitalize">{plan}</CardTitle>
                <CardDescription>
                  ${PLAN_PRICES[plan]}/mo &middot; {PLAN_SEATS[plan]} seat
                  {PLAN_SEATS[plan] > 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant={isCurrent ? 'outline' : 'default'}
                  className="w-full"
                  disabled={isCurrent || plan === 'free'}
                >
                  {isCurrent ? 'Current plan' : `Upgrade to ${plan}`}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
