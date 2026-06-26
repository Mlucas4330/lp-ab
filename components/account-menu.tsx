import { signOut } from '@/auth'
import { PlanBadge } from '@/components/plan-badge'
import type { SubscriptionPlan } from '@/lib/enums'

async function signOutAction() {
  'use server'
  await signOut({ redirectTo: '/' })
}

export function AccountMenu({
  user
}: {
  user: { name?: string | null; email?: string | null; plan: SubscriptionPlan }
}) {
  const label = user.name ?? user.email ?? 'Account'
  const initial = label.charAt(0).toUpperCase()

  return (
    <details className="group relative" data-testid="account-menu">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border px-2 py-1 text-sm [&::-webkit-details-marker]:hidden">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          {initial}
        </span>
        <span className="max-w-[8rem] truncate">{label}</span>
      </summary>

      <div className="absolute right-0 z-10 mt-2 w-56 rounded-md border bg-card p-3 shadow-md">
        <div className="space-y-1">
          {user.name && <p className="text-sm font-medium">{user.name}</p>}
          {user.email && <p className="truncate text-xs text-muted-foreground">{user.email}</p>}
          <div className="pt-1">
            <PlanBadge plan={user.plan} />
          </div>
        </div>
        <form action={signOutAction} className="mt-3 border-t pt-3">
          <button
            type="submit"
            className="w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted"
          >
            Sign out
          </button>
        </form>
      </div>
    </details>
  )
}
