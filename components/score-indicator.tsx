import { effortScoreBadgeClass, impactScoreBadgeClass } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function ScoreIndicator({
  label,
  score,
  kind
}: {
  label: string
  score: number
  kind: 'impact' | 'effort'
}) {
  const badgeClass = kind === 'impact' ? impactScoreBadgeClass(score) : effortScoreBadgeClass(score)

  return (
    <div className={cn('flex items-baseline gap-1.5 rounded-md px-2.5 py-1', badgeClass)}>
      <span className="text-[0.65rem] font-semibold uppercase tracking-wide opacity-80">
        {label}
      </span>
      <span className="text-base font-bold leading-none tabular-nums">{score}</span>
      <span className="text-xs opacity-70">/10</span>
    </div>
  )
}
