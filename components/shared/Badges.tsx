import { Badge } from '@chakra-ui/react'
import type { SeverityLevel, CallFlag } from '@/lib/types'

// ── Severity badge ─────────────────────────────────────────────────────────

const SEVERITY_PALETTE: Record<SeverityLevel, string> = {
  critical: 'red',
  high:     'orange',
  medium:   'yellow',
  low:      'gray',
}

const SEVERITY_LABEL: Record<SeverityLevel, string> = {
  critical: 'Critical',
  high:     'High',
  medium:   'Medium',
  low:      'Low',
}

export function SeverityBadge({ severity }: { severity: SeverityLevel }) {
  return (
    <Badge
      colorPalette={SEVERITY_PALETTE[severity]}
      variant="subtle"
      size="sm"
      rounded="sm"
      fontWeight="semibold"
    >
      {SEVERITY_LABEL[severity]}
    </Badge>
  )
}

// ── Flag badge ─────────────────────────────────────────────────────────────

const FLAG_PALETTE: Record<CallFlag, string> = {
  'escalation':           'red',
  'churn-risk':           'orange',
  'product-bug':          'purple',
  'policy-concern':       'yellow',
  'coaching-opportunity': 'blue',
}

const FLAG_LABEL: Record<CallFlag, string> = {
  'escalation':           'Escalation',
  'churn-risk':           'Churn risk',
  'product-bug':          'Product bug',
  'policy-concern':       'Policy concern',
  'coaching-opportunity': 'Coaching',
}

export function FlagBadge({ flag }: { flag: CallFlag }) {
  return (
    <Badge
      colorPalette={FLAG_PALETTE[flag]}
      variant="subtle"
      size="sm"
      rounded="sm"
    >
      {FLAG_LABEL[flag]}
    </Badge>
  )
}

// ── Trend badge ────────────────────────────────────────────────────────────

export function TrendBadge({ trend, percent }: { trend: 'rising' | 'stable' | 'declining'; percent: number }) {
  const palette = trend === 'rising' ? 'red' : trend === 'declining' ? 'green' : 'gray'
  const arrow   = trend === 'rising' ? '↑' : trend === 'declining' ? '↓' : '→'
  return (
    <Badge colorPalette={palette} variant="subtle" size="sm" rounded="sm">
      {arrow} {percent}%
    </Badge>
  )
}
