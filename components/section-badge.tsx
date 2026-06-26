import { Badge } from '@/components/ui/badge'
import { SECTION_BADGE_CLASS, SECTION_LABEL } from '@/lib/constants'
import type { Section } from '@/lib/enums'
import { cn } from '@/lib/utils'

export function SectionBadge({ section, className }: { section: Section; className?: string }) {
  return (
    <Badge className={cn(SECTION_BADGE_CLASS[section], className)}>{SECTION_LABEL[section]}</Badge>
  )
}
