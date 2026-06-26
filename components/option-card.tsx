'use client'

import { SECTION_SELECTED_CLASS } from '@/lib/constants'
import type { Section } from '@/lib/enums'
import { cn } from '@/lib/utils'

export function OptionCard({
  label,
  copy,
  evidence,
  section,
  selected,
  disabled,
  onSelect
}: {
  label: string
  copy: string
  evidence?: string | null
  section: Section
  selected: boolean
  disabled: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      data-testid="option-card"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        'w-full rounded-lg border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60',
        selected ? cn(SECTION_SELECTED_CLASS[section], 'animate-pop-in') : 'border-border'
      )}
    >
      <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm">{copy}</p>
      {evidence && (
        <p className="mt-2 text-xs text-muted-foreground" data-testid="option-evidence">
          Why: {evidence}
        </p>
      )}
    </button>
  )
}
