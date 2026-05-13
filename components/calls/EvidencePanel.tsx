'use client'

import { useEffect, useState } from 'react'
import { Badge, Box, Button, Flex, SimpleGrid, Stack, Text, Textarea } from '@chakra-ui/react'
import type { CallDetailData, SeverityLevel } from '@/lib/types'

// ── SVG icons ─────────────────────────────────────────────────────────────

function Ico({ children, size = 14 }: { children: React.ReactNode; size?: number }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, display: 'inline-block' }}
    >
      {children}
    </svg>
  )
}
function SparklesIcon({ size = 14 }: { size?: number }) {
  return <Ico size={size}><path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" /></Ico>
}
function ZapIcon() {
  return <Ico><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></Ico>
}
function RepeatIcon() {
  return (
    <Ico>
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </Ico>
  )
}
function MessageSquareIcon() {
  return <Ico><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></Ico>
}
function PenLineIcon() {
  return (
    <Ico>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </Ico>
  )
}
function ArrowRightIcon() {
  return (
    <Ico>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </Ico>
  )
}
function FolderIcon() {
  return <Ico><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></Ico>
}
function XIcon() {
  return (
    <Ico size={12}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </Ico>
  )
}
function ClockIcon() {
  return (
    <Ico size={12}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </Ico>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────

function initials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
}

function getAccountTier(severity: SeverityLevel): string {
  return { critical: 'Enterprise', high: 'Professional', medium: 'Business', low: 'Starter' }[severity]
}

function computeQaScore(call: CallDetailData): number {
  const base = call.qaStatus === 'flagged' ? 52 : call.qaStatus === 'reviewed' ? 80 : 67
  const s = call.sentiment === 'negative' ? -12 : call.sentiment === 'positive' ? 8 : 0
  const e = call.escalationStatus === 'escalated' ? -8 : 0
  return Math.min(99, Math.max(20, base + s + e))
}

const FLAG_LABEL: Record<string, string> = {
  'escalation': 'Escalation',
  'churn-risk': 'Churn Risk',
  'product-bug': 'Product Bug',
  'policy-concern': 'Policy Concern',
  'coaching-opportunity': 'Coaching Opportunity',
}
const FLAG_PALETTE: Record<string, string> = {
  'escalation': 'red',
  'churn-risk': 'orange',
  'product-bug': 'gray',
  'policy-concern': 'yellow',
  'coaching-opportunity': 'blue',
}

function getMomentBadgePalette(label: string): string {
  const l = label.toLowerCase()
  if (l.includes('escalat') || l.includes('anger') || l.includes('legal') || l.includes('urgent')) return 'red'
  if (l.includes('coach') || l.includes('opportunit') || l.includes('success') || l.includes('resolved')) return 'blue'
  if (l.includes('product') || l.includes('bug') || l.includes('technical') || l.includes('error') || l.includes('root cause')) return 'orange'
  if (l.includes('policy') || l.includes('protocol')) return 'yellow'
  return 'gray'
}

// ── AI-derived insight helpers ─────────────────────────────────────────────

function getIntent(call: CallDetailData): string {
  const cat = call.issueCategory.toLowerCase()
  if (cat.includes('billing')) return 'Billing Dispute'
  if (cat.includes('auth') || cat.includes('sso')) return 'Technical — Access Issue'
  if (cat.includes('cancell') || cat.includes('churn')) return 'Cancellation Request'
  if (cat.includes('onboard')) return 'Onboarding Assistance'
  if (cat.includes('policy') || cat.includes('compliance')) return 'Compliance Review'
  if (cat.includes('renewal') || cat.includes('upgrade')) return 'Renewal / Upsell'
  return call.issueCategory
}

function getEffortScore(call: CallDetailData): { label: string; palette: string } {
  if (call.flags.includes('escalation') || call.escalationStatus === 'escalated')
    return { label: 'High', palette: 'red' }
  if (call.sentiment === 'negative' || call.flags.includes('churn-risk'))
    return { label: 'Medium-High', palette: 'orange' }
  if (call.sentiment === 'positive')
    return { label: 'Low', palette: 'green' }
  return { label: 'Medium', palette: 'yellow' }
}

function getResolutionType(call: CallDetailData): string {
  const o = call.resolutionOutcome.toLowerCase()
  if (o.includes('fully resolved')) return 'Fully Resolved'
  if (o.includes('resolved')) return 'Resolved'
  if (o.includes('partial')) return 'Partially Resolved'
  if (o.includes('escalat')) return 'Escalated to T2'
  if (o.includes('in progress') || o.includes('pending') || o.includes('awaiting')) return 'Follow-up Pending'
  if (o.includes('save attempt')) return 'Save Attempt'
  return 'Under Review'
}

function getComplianceCheck(call: CallDetailData): { label: string; palette: string } {
  if (call.flags.includes('policy-concern'))
    return { label: 'SOP Violation Detected', palette: 'red' }
  if (call.flags.includes('coaching-opportunity') && call.escalationStatus === 'escalated')
    return { label: 'Protocol Gap Identified', palette: 'orange' }
  if (call.flags.includes('escalation') && call.escalationStatus !== 'escalated')
    return { label: 'Escalation Protocol Missed', palette: 'orange' }
  if (call.qaStatus === 'flagged')
    return { label: 'QA Flag — Review Required', palette: 'yellow' }
  return { label: 'No Violations', palette: 'green' }
}

function getSentimentTrajectory(call: CallDetailData): string {
  if (call.sentiment === 'positive') return 'Positive → Stable'
  if (call.sentiment === 'negative' && call.escalationStatus === 'escalated') return 'Negative → Escalating'
  if (call.sentiment === 'negative' && call.churnRisk === 'high') return 'Negative → Critical Risk'
  if (call.sentiment === 'negative') return 'Negative → Unresolved'
  if (call.sentiment === 'neutral' && call.escalationStatus === 'pending') return 'Neutral → Declining'
  return 'Neutral → Stable'
}

function getChurnSignal(call: CallDetailData): { label: string; palette: string } {
  const map = {
    high:   { label: 'High Risk', palette: 'red' },
    medium: { label: 'Medium Risk', palette: 'orange' },
    low:    { label: 'Low Risk', palette: 'yellow' },
    none:   { label: 'No Signal', palette: 'gray' },
  }
  return map[call.churnRisk]
}

function getAiTags(call: CallDetailData): string[] {
  const tags = new Set<string>()
  const cat = call.issueCategory.toLowerCase()

  if (cat.includes('billing')) tags.add('Billing Dispute')
  if (cat.includes('auth') || cat.includes('sso')) tags.add('Login Issue')
  if (cat.includes('cancell')) tags.add('Cancellation Risk')
  if (cat.includes('onboard')) tags.add('Onboarding')
  if (cat.includes('renewal')) tags.add('Renewal Discussion')
  if (cat.includes('integration')) tags.add('Integration Issue')

  if (call.flags.includes('escalation')) tags.add('Escalation Signal')
  if (call.flags.includes('churn-risk')) tags.add('Churn Risk')
  if (call.flags.includes('product-bug')) tags.add('Bug Report')
  if (call.flags.includes('policy-concern')) tags.add('Policy Breach')
  if (call.flags.includes('coaching-opportunity')) tags.add('Coaching Needed')

  if (call.severity === 'critical') tags.add('Critical Priority')
  else if (call.severity === 'high') tags.add('High Priority')
  if (call.churnRisk === 'high') tags.add('High Churn Risk')
  if (call.sentiment === 'negative') tags.add('Dissatisfied Customer')
  if (call.sentiment === 'positive') tags.add('Satisfied Customer')
  if (call.escalationStatus === 'escalated') tags.add('T2 Escalated')

  call.topics.slice(0, 3).forEach(t => tags.add(t))

  return Array.from(tags).slice(0, 10)
}

// ── Sub-components ────────────────────────────────────────────────────────

function ScoreBar({ value, color }: { value: number; color: string }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const id = requestAnimationFrame(() => setWidth(value))
    return () => cancelAnimationFrame(id)
  }, [value])
  return (
    <Box h="8px" bg="var(--chakra-colors-bg-subtle)" rounded="full" overflow="hidden" w="full"
      borderWidth="1px" borderColor="var(--chakra-colors-border-subtle)">
      <Box h="full" rounded="full"
        style={{ width: `${width}%`, background: color, transition: 'width 0.7s cubic-bezier(0.215,0.61,0.355,1)' }}
      />
    </Box>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text fontSize="lg" fontWeight="semibold" color="var(--chakra-colors-fg-default)" mb={4}>
      {children}
    </Text>
  )
}

function Divider() {
  return <Box h="1px" w="full" bg="var(--chakra-colors-border-subtle)" />
}

/** One field in the AI insights grid */
function AiField({
  label, value, badge,
}: {
  label: string
  value?: string
  badge?: { label: string; palette: string }
}) {
  return (
    <Box>
      <Text fontSize="xs" color="var(--chakra-colors-fg-muted)" mb={0.5}>{label}</Text>
      {badge
        ? <Badge colorPalette={badge.palette} variant="subtle" size="sm" rounded="sm">{badge.label}</Badge>
        : <Text fontSize="xs" fontWeight="medium" color="var(--chakra-colors-fg-default)" lineHeight="snug">{value}</Text>
      }
    </Box>
  )
}

// ── Main component ────────────────────────────────────────────────────────

interface EvidencePanelProps {
  call: CallDetailData
  activeLineIndex: number | null
  onMomentSelect: (lineIndex: number) => void
}

export function EvidencePanel({ call, activeLineIndex, onMomentSelect }: EvidencePanelProps) {
  const [noteText, setNoteText] = useState('')
  const [noteSaved, setNoteSaved] = useState(false)

  // ── Derived values ────────────────────────────────────────────────────
  const qaScore       = computeQaScore(call)
  const teamAvg       = 78
  const qaColor       = qaScore < teamAvg ? '#ED8936' : '#48BB78'
  const qaColorPalette = qaScore < teamAvg ? 'orange' : 'green'

  const accountTier   = getAccountTier(call.severity)
  const sentimentPalette = { positive: 'green', neutral: 'gray', negative: 'red' }[call.sentiment]
  const sentimentLabel   = call.sentiment.charAt(0).toUpperCase() + call.sentiment.slice(1)
  const statusLabel   = call.escalationStatus === 'escalated' ? 'Escalated' : call.escalationStatus === 'pending' ? 'Pending' : 'Unresolved'
  const statusPalette = call.escalationStatus === 'escalated' ? 'red' : call.escalationStatus === 'pending' ? 'orange' : 'yellow'

  // AI-derived
  const aiIntent        = getIntent(call)
  const aiEffort        = getEffortScore(call)
  const aiResolution    = getResolutionType(call)
  const aiCompliance    = getComplianceCheck(call)
  const aiTrajectory    = getSentimentTrajectory(call)
  const aiChurn         = getChurnSignal(call)
  const aiTags          = getAiTags(call)

  const MOCK_COUNTS = [23, 17, 31, 12, 8]
  const recurringIssues = call.topics.map((topic, i) => ({
    name: topic,
    count: MOCK_COUNTS[i % MOCK_COUNTS.length],
    palette: i === 0 ? 'red' : i === 1 ? 'orange' : 'gray',
    countColor: i === 0 ? 'var(--chakra-colors-red-700)' : i === 1 ? 'var(--chakra-colors-orange-700)' : 'var(--chakra-colors-gray-600)',
  }))

  const relatedConversations = [
    { id: 'CVR-2024-08389', account: call.accountName, date: 'Jul 21', severity: 'high' as const, summary: `Similar ${call.topics[0] ?? 'issue'} — same period`, tags: call.topics.slice(0, 2) },
    { id: 'CVR-2024-08291', account: 'Acme Corp',         date: 'Jul 19', severity: 'medium' as const, summary: 'Billing cycle not resetting after account tier upgrade', tags: call.topics.slice(0, 1) },
    { id: 'CVR-2024-08102', account: 'Veridian Systems',  date: 'Jul 16', severity: 'high' as const, summary: 'Customer reported API double-firing after recent deployment', tags: call.topics.slice(-1) },
  ]

  const savedCollections = call.tags.length > 0
    ? call.tags.slice(0, 2).map((tag, i) => `${tag.charAt(0).toUpperCase() + tag.slice(1)} · ${['July Sprint', 'Week 30'][i] ?? 'Archive'}`)
    : ['QA Review · Week 30']

  function handleSaveNote() {
    setNoteSaved(true)
    setTimeout(() => setNoteSaved(false), 2000)
  }

  return (
    <Stack gap={8} px={8} py={8}>

      {/* ══ 1. Conversation Details ════════════════════════════════════ */}
      <Box w="full">
        <SectionTitle>Conversation Details</SectionTitle>

        <Box bg="var(--chakra-colors-bg-subtle)" rounded="lg" px={4} py={4}>

          {/* ─ Primary metadata grid ─────────────────────────────────── */}
          <SimpleGrid columns={2} gap={4} mb={4}>
            {/* Customer */}
            <Box>
              <Text fontSize="xs" fontWeight="semibold" color="var(--chakra-colors-fg-muted)" mb={0.5}>Customer</Text>
              <Text fontSize="sm" color="var(--chakra-colors-fg-default)">{call.customerName}</Text>
            </Box>
            {/* Agent */}
            <Box>
              <Text fontSize="xs" fontWeight="semibold" color="var(--chakra-colors-fg-muted)" mb={0.5}>Agent</Text>
              <Flex align="center" gap={2}>
                <Flex
                  w="22px" h="22px" rounded="full"
                  bg="var(--chakra-colors-blue-200)"
                  color="var(--chakra-colors-blue-800)"
                  align="center" justify="center"
                  fontSize="9px" fontWeight="bold" flexShrink={0}
                >
                  {initials(call.agentName)}
                </Flex>
                <Text fontSize="sm" color="var(--chakra-colors-fg-default)">{call.agentName}</Text>
              </Flex>
            </Box>
            {/* Date & Time */}
            <Box>
              <Text fontSize="xs" fontWeight="semibold" color="var(--chakra-colors-fg-muted)" mb={0.5}>Date &amp; Time</Text>
              <Text fontSize="sm" color="var(--chakra-colors-fg-default)">{call.date} · {call.time}</Text>
            </Box>
            {/* Duration */}
            <Box>
              <Text fontSize="xs" fontWeight="semibold" color="var(--chakra-colors-fg-muted)" mb={0.5}>Duration</Text>
              <Text fontSize="sm" color="var(--chakra-colors-fg-default)">{call.duration}</Text>
            </Box>
            {/* Account Tier */}
            <Box>
              <Text fontSize="xs" fontWeight="semibold" color="var(--chakra-colors-fg-muted)" mb={0.5}>Account Tier</Text>
              <Badge colorPalette="blue" variant="subtle" size="sm" rounded="sm">{accountTier}</Badge>
            </Box>
            {/* Product Area */}
            <Box>
              <Text fontSize="xs" fontWeight="semibold" color="var(--chakra-colors-fg-muted)" mb={0.5}>Product Area</Text>
              <Badge colorPalette="gray" variant="subtle" size="sm" rounded="sm">{call.productArea}</Badge>
            </Box>
          </SimpleGrid>

          {/* ─ AI-Extracted Insights ─────────────────────────────────── */}
          <Box
            borderTopWidth="1px"
            borderColor="var(--chakra-colors-border-subtle)"
            pt={4} mb={4}
          >
            <Flex align="center" gap={1.5} mb={3}>
              <Box color="var(--chakra-colors-blue-500)">
                <SparklesIcon size={12} />
              </Box>
              <Text fontSize="xs" fontWeight="semibold" color="var(--chakra-colors-fg-muted)" letterSpacing="wider" textTransform="uppercase">
                AI-Extracted Insights
              </Text>
            </Flex>

            <SimpleGrid columns={2} gap={3}>
              <AiField label="Intent"            value={aiIntent} />
              <AiField label="Customer Effort"   badge={aiEffort} />
              <AiField label="Resolution Type"   value={aiResolution} />
              <AiField label="Compliance"        badge={aiCompliance} />
              <AiField label="Sentiment Trend"   value={aiTrajectory} />
              <AiField label="Churn Signal"      badge={aiChurn} />
            </SimpleGrid>
          </Box>

          {/* ─ Issue Tags ─────────────────────────────────────────────── */}
          {(call.flags.length > 0 || call.topics.length > 0) && (
            <Box
              borderTopWidth="1px"
              borderColor="var(--chakra-colors-border-subtle)"
              pt={3} mb={3}
            >
              <Text fontSize="xs" fontWeight="semibold" color="var(--chakra-colors-fg-muted)" mb={2}>
                Issue Tags
              </Text>
              <Flex gap={1.5} flexWrap="wrap">
                {call.flags.map(f => (
                  <Badge key={f} colorPalette={FLAG_PALETTE[f] ?? 'gray'} variant="subtle" size="sm" rounded="sm">
                    {FLAG_LABEL[f] ?? f}
                  </Badge>
                ))}
                {call.topics.map(t => (
                  <Badge key={t} colorPalette="gray" variant="subtle" size="sm" rounded="sm">{t}</Badge>
                ))}
              </Flex>
            </Box>
          )}

          {/* ─ AI-Generated Tags ──────────────────────────────────────── */}
          {aiTags.length > 0 && (
            <Box
              borderTopWidth="1px"
              borderColor="var(--chakra-colors-border-subtle)"
              pt={3}
            >
              <Flex align="center" gap={1.5} mb={2}>
                <Box color="var(--chakra-colors-blue-500)">
                  <SparklesIcon size={12} />
                </Box>
                <Text fontSize="xs" fontWeight="semibold" color="var(--chakra-colors-fg-muted)">
                  AI-Generated Tags
                </Text>
              </Flex>
              <Flex gap={1.5} flexWrap="wrap">
                {aiTags.map(tag => (
                  <Badge
                    key={tag}
                    colorPalette="blue"
                    variant="outline"
                    size="sm"
                    rounded="sm"
                  >
                    {tag}
                  </Badge>
                ))}
              </Flex>
            </Box>
          )}
        </Box>
      </Box>

      {/* ══ 2. AI Summary ═════════════════════════════════════════════ */}
      <Box w="full">
        <Flex align="center" justify="space-between" mb={4}>
          <Flex align="center" gap={2}>
            <Flex
              w="28px" h="28px" rounded="md"
              bg="var(--chakra-colors-blue-100)"
              color="var(--chakra-colors-blue-600)"
              align="center" justify="center"
              flexShrink={0}
            >
              <SparklesIcon />
            </Flex>
            <Text fontSize="lg" fontWeight="semibold" color="var(--chakra-colors-fg-default)">
              AI Summary
            </Text>
          </Flex>
          <Flex align="center" gap={2}>
            <Badge colorPalette={sentimentPalette} variant="subtle" size="sm" rounded="sm">{sentimentLabel}</Badge>
            <Badge colorPalette={statusPalette} variant="subtle" size="sm" rounded="sm">{statusLabel}</Badge>
          </Flex>
        </Flex>

        <Box
          bg="var(--chakra-colors-bg-subtle)"
          borderWidth="1px"
          borderColor="var(--chakra-colors-border-subtle)"
          rounded="lg" px={4} py={4}
        >
          <Stack gap={2}>
            <Flex align="flex-start" gap={2}>
              <Box w="6px" h="6px" rounded="full" bg="var(--chakra-colors-fg-muted)" flexShrink={0} mt="6px" />
              <Text fontSize="sm" color="var(--chakra-colors-fg-default)" lineHeight="tall">{call.mainIssue}</Text>
            </Flex>
            <Flex align="flex-start" gap={2}>
              <Box w="6px" h="6px" rounded="full" bg="var(--chakra-colors-fg-muted)" flexShrink={0} mt="6px" />
              <Text fontSize="sm" color="var(--chakra-colors-fg-default)" lineHeight="tall">{call.aiSummary}</Text>
            </Flex>
            {call.notableFlags.map((flag, i) => (
              <Flex key={i} align="flex-start" gap={2}>
                <Box w="6px" h="6px" rounded="full" bg="var(--chakra-colors-fg-muted)" flexShrink={0} mt="6px" />
                <Text fontSize="sm" color="var(--chakra-colors-fg-default)" lineHeight="tall">{flag}</Text>
              </Flex>
            ))}
            <Flex align="flex-start" gap={2}>
              <Box w="6px" h="6px" rounded="full" bg="var(--chakra-colors-fg-muted)" flexShrink={0} mt="6px" />
              <Text fontSize="sm" color="var(--chakra-colors-fg-default)" lineHeight="tall">{call.resolutionOutcome}</Text>
            </Flex>
          </Stack>
        </Box>
      </Box>

      {/* ══ 3. Key Moments ════════════════════════════════════════════ */}
      <Box w="full">
        <Flex align="center" gap={2} mb={4}>
          <ZapIcon />
          <Text fontSize="lg" fontWeight="semibold" color="var(--chakra-colors-fg-default)">Key Moments</Text>
          <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">{call.keyMoments.length} identified</Text>
        </Flex>

        <Box
          bg="var(--chakra-colors-bg-subtle)"
          borderBottomWidth="1px"
          borderColor="var(--chakra-colors-border-subtle)"
          px={4} py={3}
        >
          <Stack gap={2}>
            {call.keyMoments.map(moment => {
              const palette = getMomentBadgePalette(moment.label)
              const isActive = activeLineIndex === moment.lineIndex

              const borderColors: Record<string, string> = {
                red: 'var(--chakra-colors-red-200)', orange: 'var(--chakra-colors-orange-200)',
                blue: 'var(--chakra-colors-blue-200)', yellow: 'var(--chakra-colors-yellow-200)', gray: 'var(--chakra-colors-gray-200)',
              }
              const hoverBg: Record<string, string> = {
                red: 'var(--chakra-colors-red-50)', orange: 'var(--chakra-colors-orange-50)',
                blue: 'var(--chakra-colors-blue-50)', yellow: 'var(--chakra-colors-yellow-50)', gray: 'var(--chakra-colors-gray-50)',
              }
              const tsColor: Record<string, string> = {
                red: 'var(--chakra-colors-red-700)', orange: 'var(--chakra-colors-orange-700)',
                blue: 'var(--chakra-colors-blue-700)', yellow: 'var(--chakra-colors-yellow-700)', gray: 'var(--chakra-colors-gray-600)',
              }

              return (
                <Box
                  key={moment.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Go to key moment: ${moment.label} at ${moment.timestamp}`}
                  aria-pressed={isActive}
                  borderWidth="1px"
                  borderColor={borderColors[palette] ?? borderColors.gray}
                  bg={isActive ? (hoverBg[palette] ?? hoverBg.gray) : 'white'}
                  rounded="md" px={3} py={2.5}
                  cursor="pointer"
                  _hover={{ bg: hoverBg[palette] ?? hoverBg.gray }}
                  transition="background-color 0.15s ease"
                  onClick={() => onMomentSelect(moment.lineIndex)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onMomentSelect(moment.lineIndex) } }}
                >
                  <Flex align="center" justify="space-between" mb={1.5}>
                    <Badge colorPalette={palette} variant="subtle" size="sm" rounded="sm">{moment.label}</Badge>
                    <Flex align="center" gap={1}>
                      <Box color={tsColor[palette] ?? tsColor.gray}><ClockIcon /></Box>
                      <Text fontSize="xs" fontWeight="semibold" color={tsColor[palette] ?? tsColor.gray}>
                        {moment.timestamp}
                      </Text>
                    </Flex>
                  </Flex>
                  <Text
                    fontSize="xs" color="var(--chakra-colors-fg-muted)" fontStyle="italic" lineHeight="tall"
                    overflow="hidden"
                    style={{ WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical' as const }}
                  >
                    &ldquo;{moment.snippet}&rdquo;
                  </Text>
                </Box>
              )
            })}
          </Stack>
        </Box>
      </Box>

      <Divider />

      {/* ══ 4. Quality Evaluation ═════════════════════════════════════ */}
      <Box w="full">
        <SectionTitle>Quality Evaluation</SectionTitle>
        <Box borderWidth="1px" borderColor="var(--chakra-colors-border-subtle)" rounded="lg" px={4} py={4}>
          <Flex align="center" justify="space-between" mb={2}>
            <Text fontSize="sm" fontWeight="semibold" color="var(--chakra-colors-fg-default)">QA Score</Text>
            <Text fontSize="sm" fontWeight="semibold" color={`var(--chakra-colors-${qaColorPalette}-700)`}>
              {qaScore} / 100
            </Text>
          </Flex>
          <ScoreBar value={qaScore} color={qaColor} />
          <Flex align="center" justify="space-between" mt={2}>
            <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">
              {qaScore < teamAvg ? `Below team avg (${teamAvg})` : `Above team avg (${teamAvg})`}
            </Text>
            <Text fontSize="xs" color="var(--chakra-colors-blue-600)" cursor="pointer" _hover={{ textDecoration: 'underline' }}>
              View full scorecard
            </Text>
          </Flex>
        </Box>
      </Box>

      <Divider />

      {/* ══ 5. Recurring Issues ═══════════════════════════════════════ */}
      {recurringIssues.length > 0 && (
        <Box w="full">
          <Flex align="center" gap={2} mb={3}>
            <RepeatIcon />
            <Text fontSize="sm" fontWeight="semibold" color="var(--chakra-colors-fg-default)">Recurring Issues</Text>
          </Flex>
          <Stack gap={2}>
            {recurringIssues.map(issue => (
              <Flex
                key={issue.name}
                align="center" justify="space-between"
                borderWidth="1px" borderColor="var(--chakra-colors-border-subtle)"
                bg="var(--chakra-colors-bg-panel)" rounded="md" px={3} py={2}
              >
                <Badge colorPalette={issue.palette} variant="subtle" size="sm" rounded="sm">{issue.name}</Badge>
                <Text fontSize="xs" fontWeight="semibold" color={issue.countColor}>{issue.count} convos</Text>
              </Flex>
            ))}
          </Stack>
          <Flex align="center" gap={1.5} mt={2} cursor="pointer"
            color="var(--chakra-colors-blue-600)" _hover={{ color: 'var(--chakra-colors-blue-700)' }}>
            <ArrowRightIcon />
            <Text fontSize="sm">View all issue clusters</Text>
          </Flex>
        </Box>
      )}

      {/* ══ 6. Related Conversations ══════════════════════════════════ */}
      <Box w="full">
        <Flex align="center" gap={2} mb={3}>
          <MessageSquareIcon />
          <Text fontSize="sm" fontWeight="semibold" color="var(--chakra-colors-fg-default)">Related Conversations</Text>
        </Flex>
        <Stack gap={2}>
          {relatedConversations.map(rel => {
            const sevPalette = rel.severity === 'high' ? 'red' : rel.severity === 'medium' ? 'orange' : 'gray'
            return (
              <Box
                key={rel.id}
                role="button"
                tabIndex={0}
                aria-label={`View related conversation ${rel.id}`}
                borderWidth="1px" borderColor="var(--chakra-colors-border-subtle)"
                bg="var(--chakra-colors-bg-panel)" rounded="md" px={3} py={3}
                cursor="pointer"
                _hover={{ bg: 'var(--chakra-colors-bg-subtle)' }}
                transition="background-color 0.15s ease"
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') e.preventDefault() }}
              >
                <Flex align="center" justify="space-between" mb={1}>
                  <Text fontSize="xs" fontWeight="semibold" color="var(--chakra-colors-fg-default)">{rel.id}</Text>
                  <Badge colorPalette={sevPalette} variant="subtle" size="sm" rounded="sm"
                    textTransform="capitalize">{rel.severity}</Badge>
                </Flex>
                <Text fontSize="xs" color="var(--chakra-colors-fg-muted)" mb={1}>{rel.account} · {rel.date}</Text>
                <Text
                  fontSize="xs" color="var(--chakra-colors-fg-default)" lineHeight="tall" mb={2}
                  overflow="hidden"
                  style={{ WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical' as const }}
                >
                  {rel.summary}
                </Text>
                {rel.tags.length > 0 && (
                  <Flex gap={1} flexWrap="wrap">
                    {rel.tags.map(tag => (
                      <Badge key={tag} colorPalette="gray" variant="outline" size="sm" rounded="sm">{tag}</Badge>
                    ))}
                  </Flex>
                )}
              </Box>
            )
          })}
        </Stack>
        <Flex align="center" gap={1.5} mt={2} cursor="pointer"
          color="var(--chakra-colors-blue-600)" _hover={{ color: 'var(--chakra-colors-blue-700)' }}>
          <ArrowRightIcon />
          <Text fontSize="sm">See more related conversations</Text>
        </Flex>
      </Box>

      <Divider />

      {/* ══ 7. Evidence Notes ═════════════════════════════════════════ */}
      <Box w="full">
        <Flex align="center" gap={2} mb={3}>
          <PenLineIcon />
          <Text fontSize="sm" fontWeight="semibold" color="var(--chakra-colors-fg-default)">Evidence Notes</Text>
        </Flex>
        <Textarea
          value={noteText}
          onChange={e => setNoteText(e.target.value)}
          placeholder="Add notes for QA review or insights report..."
          size="sm" minH="80px" rounded="sm" mb={2} fontSize="sm" resize="vertical"
        />
        <Button w="full" variant="outline" size="sm" rounded="sm" onClick={handleSaveNote}>
          {noteSaved ? 'Saved!' : 'Save Note'}
        </Button>
      </Box>

      <Divider />

      {/* ══ 8. Saved In ═══════════════════════════════════════════════ */}
      <Box w="full" pb={4}>
        <Text fontSize="xs" fontWeight="semibold" color="var(--chakra-colors-fg-muted)" mb={2}>Saved In</Text>
        <Stack gap={1.5}>
          {savedCollections.map((col, i) => (
            <Flex
              key={i}
              align="center" gap={2}
              borderWidth="1px" borderColor="var(--chakra-colors-border-subtle)"
              bg="var(--chakra-colors-bg-subtle)" rounded="md" px={3} py={2}
            >
              <Box color="var(--chakra-colors-fg-muted)" flexShrink={0}><FolderIcon /></Box>
              <Text fontSize="xs" color="var(--chakra-colors-fg-default)" flex={1}>{col}</Text>
              <Box as="button" aria-label={`Remove ${col} from saved`} color="var(--chakra-colors-fg-muted)"
                _hover={{ color: 'var(--chakra-colors-fg-default)' }} cursor="pointer" flexShrink={0}>
                <XIcon />
              </Box>
            </Flex>
          ))}
        </Stack>
      </Box>

    </Stack>
  )
}
