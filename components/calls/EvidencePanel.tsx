'use client'

import { useEffect, useState } from 'react'
import { Badge, Box, Button, Flex, Stack, Text, Textarea } from '@chakra-ui/react'
import type { CallDetailData } from '@/lib/types'
import { getAllCallDetails } from '@/lib/data/calls'

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
function ShieldIcon() {
  return <Ico><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></Ico>
}

// ── Helpers ───────────────────────────────────────────────────────────────

function computeCallHealth(c: CallDetailData): number {
  let score = 75
  if (c.sentiment === 'negative') score -= 10
  if (c.escalationStatus === 'escalated') score -= 8
  if (c.churnRisk === 'low') score -= 5
  else if (c.churnRisk === 'medium') score -= 10
  else if (c.churnRisk === 'high') score -= 15
  if (c.severity === 'critical') score -= 12
  if (c.qaStatus === 'flagged') score -= 5
  return Math.max(0, Math.min(100, score))
}

function customerSentimentLabel(score: number): string {
  if (score >= 86) return 'Delighted'
  if (score >= 71) return 'Satisfied'
  if (score >= 51) return 'Neutral'
  if (score >= 31) return 'Frustrated'
  return 'Distressed'
}

function agentSentimentLabel(score: number): string {
  if (score >= 81) return 'Excellent'
  if (score >= 61) return 'Competent'
  if (score >= 41) return 'Adequate'
  return 'Poor'
}

function sentimentColorFn(score: number): string {
  if (score >= 70) return 'green'
  if (score >= 45) return 'orange'
  return 'red'
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

// ── Sub-components ────────────────────────────────────────────────────────

function CheckIcon() {
  return <Ico size={14}><polyline points="20 6 9 17 4 12" /></Ico>
}
function XMarkIcon() {
  return (
    <Ico size={14}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </Ico>
  )
}
function BuildingIcon() {
  return (
    <Ico>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </Ico>
  )
}
function UserIcon() {
  return (
    <Ico>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </Ico>
  )
}

function SectionHeader({ icon, title, meta }: { icon: React.ReactNode; title: string; meta?: React.ReactNode }) {
  return (
    <Flex align="center" gap={2} mb={4}>
      <Box color="var(--chakra-colors-fg-muted)">{icon}</Box>
      <Text fontSize="sm" fontWeight="semibold" color="var(--chakra-colors-fg-default)">{title}</Text>
      {meta}
    </Flex>
  )
}

// ── Tabs ──────────────────────────────────────────────────────────────────

const TABS = ['Overview', 'Quality', 'Context', 'Notes'] as const
type Tab = typeof TABS[number]

// ── Main component ────────────────────────────────────────────────────────

interface EvidencePanelProps {
  call: CallDetailData
  activeLineIndex: number | null
  onMomentSelect: (lineIndex: number) => void
  scrollRef?: React.RefObject<HTMLDivElement | null>
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void
}

export function EvidencePanel({ call, activeLineIndex, onMomentSelect, scrollRef, onScroll }: EvidencePanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('Overview')
  const [noteText, setNoteText]   = useState('')
  const [noteSaved, setNoteSaved] = useState(false)

  // ── Derived values ────────────────────────────────────────────────────
  const sentimentPalette = { positive: 'green', neutral: 'gray', negative: 'red' }[call.sentiment]
  const sentimentLabel   = call.sentiment.charAt(0).toUpperCase() + call.sentiment.slice(1)
  const statusLabel   = call.escalationStatus === 'escalated' ? 'Escalated' : call.escalationStatus === 'pending' ? 'Pending' : 'Unresolved'
  const statusPalette = call.escalationStatus === 'escalated' ? 'red' : call.escalationStatus === 'pending' ? 'orange' : 'yellow'

  // ── All calls (account health + context) ─────────────────────────────
  const allCalls = getAllCallDetails()

  // ── Account health ────────────────────────────────────────────────────
  const accountCalls       = allCalls.filter(c => c.accountName === call.accountName)
  const accountHealthScore = accountCalls.length > 0
    ? Math.round(accountCalls.reduce((sum, c) => sum + computeCallHealth(c), 0) / accountCalls.length)
    : 75
  const accountHealthLabel   = accountHealthScore >= 70 ? 'Healthy' : accountHealthScore >= 45 ? 'At Risk' : 'Unhealthy'
  const accountHealthPalette = accountHealthScore >= 70 ? 'green'   : accountHealthScore >= 45 ? 'orange'  : 'red'
  const accountSignals       = accountCalls.filter(c =>
    c.sentiment === 'negative' || c.escalationStatus === 'escalated' || c.churnRisk !== 'none'
  ).length

  // ── Rubric items ──────────────────────────────────────────────────────
  const rubricItems = [
    {
      label: 'Empathetic & professional tone',
      pass: !call.flags.includes('coaching-opportunity') && call.sentiment !== 'negative',
      missedReason: call.flags.includes('coaching-opportunity')
        ? 'Coaching opportunity flagged on this call'
        : 'Customer sentiment indicates agent tone may need improvement',
    },
    {
      label: 'Customer issue clearly acknowledged',
      pass: call.keyMoments.length > 0,
      missedReason: 'No key moments identified — issue acknowledgement not detected',
    },
    {
      label: 'Resolution or next steps provided',
      pass: call.resolutionOutcome.length > 20,
      missedReason: 'Resolution outcome was unclear or not recorded',
    },
    {
      label: 'No policy violations',
      pass: !call.flags.includes('policy-concern'),
      missedReason: 'Policy concern flag raised on this call',
    },
    {
      label: 'Escalation handled correctly',
      pass: call.escalationStatus !== 'pending',
      missedReason: 'Escalation left in pending state — not resolved or formally raised',
    },
  ]
  const rubricMet    = rubricItems.filter(r => r.pass).length

  // ── QA verdict ────────────────────────────────────────────────────────
  const verdictPalette    = rubricMet >= 4 ? 'green' : rubricMet >= 3 ? 'orange' : 'red'
  const verdictLabel      = rubricMet >= 4 ? 'Pass'  : rubricMet >= 3 ? 'Needs Review' : 'Fail'
  const escalationLabel   = call.escalationStatus === 'escalated' ? 'Escalated' : call.escalationStatus === 'pending' ? 'Pending' : 'Not escalated'
  const escalationPalette = call.escalationStatus === 'escalated' ? 'red' : call.escalationStatus === 'pending' ? 'orange' : 'gray'
  const resolutionLabel   = call.resolutionOutcome.toLowerCase().startsWith('resolved') ? 'Resolved'
    : call.resolutionOutcome.toLowerCase().startsWith('partial') ? 'Partial' : 'Open'
  const resolutionPalette = resolutionLabel === 'Resolved' ? 'green' : resolutionLabel === 'Partial' ? 'orange' : 'gray'

  // ── Context data ──────────────────────────────────────────────────────
  const MOCK_COUNTS = [23, 17, 31, 12, 8]
  const recurringIssues = call.topics.map((topic, i) => ({
    name: topic,
    count: MOCK_COUNTS[i % MOCK_COUNTS.length],
    palette: i === 0 ? 'red' : i === 1 ? 'orange' : 'gray',
    countColor: i === 0 ? 'var(--chakra-colors-red-700)' : i === 1 ? 'var(--chakra-colors-orange-700)' : 'var(--chakra-colors-gray-600)',
  }))

  const relatedConversations = [
    { id: 'CVR-2024-08389', account: call.accountName, date: 'Jul 21', severity: 'high' as const, summary: `Similar ${call.topics[0] ?? 'issue'} — same period`, tags: call.topics.slice(0, 2) },
    { id: 'CVR-2024-08291', account: 'Acme Corp',        date: 'Jul 19', severity: 'medium' as const, summary: 'Billing cycle not resetting after account tier upgrade', tags: call.topics.slice(0, 1) },
    { id: 'CVR-2024-08102', account: 'Veridian Systems', date: 'Jul 16', severity: 'high' as const, summary: 'Customer reported API double-firing after recent deployment', tags: call.topics.slice(-1) },
  ]

  const savedCollections = call.tags.length > 0
    ? call.tags.slice(0, 2).map((tag, i) => `${tag.charAt(0).toUpperCase() + tag.slice(1)} · ${['July Sprint', 'Week 30'][i] ?? 'Archive'}`)
    : ['QA Review · Week 30']

  function handleSaveNote() {
    setNoteSaved(true)
    setTimeout(() => setNoteSaved(false), 2000)
  }

  return (
    <Flex h="100%" flexDirection="column">
      {/* ── Tab bar — outside the scroll area so clicking tabs never triggers
           a scroll-to-focused-element jump in the content below ─────── */}
      <Flex
        flexShrink={0}
        bg="var(--chakra-colors-bg-panel)"
        borderBottomWidth="1px" borderColor="var(--chakra-colors-border-subtle)"
        px={8}
      >
        {TABS.map(tab => {
          const isActive = activeTab === tab
          return (
            <Box
              key={tab}
              as="button"
              px={4} py={3}
              fontSize="sm"
              fontWeight={isActive ? 'semibold' : 'normal'}
              color={isActive ? 'var(--chakra-colors-blue-600)' : 'var(--chakra-colors-fg-muted)'}
              borderBottomWidth="2px"
              borderColor={isActive ? 'var(--chakra-colors-blue-600)' : 'transparent'}
              mb="-1px"
              cursor="pointer"
              onClick={() => setActiveTab(tab)}
              _hover={{ color: 'var(--chakra-colors-fg-default)' }}
              transition="color 0.15s ease, border-color 0.15s ease"
              whiteSpace="nowrap"
            >
              {tab}
            </Box>
          )
        })}
      </Flex>

      {/* ── Scrollable content area — ref forwarded for scroll tracking ─ */}
      <Box ref={scrollRef} flex={1} overflowY="auto" onScroll={onScroll}>
      <Stack gap={8} px={8} py={7} pb={20}>

        {/* ══ TAB 1: Overview — AI Summary + Key Moments ══════════════ */}
        {activeTab === 'Overview' && (
          <>
            {/* AI Summary */}
            <Box w="full">
              <Flex align="center" justify="space-between" mb={4}>
                <Flex align="center" gap={2}>
                  <Flex
                    w="28px" h="28px" rounded="md"
                    bg="var(--chakra-colors-blue-100)"
                    color="var(--chakra-colors-blue-600)"
                    align="center" justify="center" flexShrink={0}
                  >
                    <SparklesIcon />
                  </Flex>
                  <Text fontSize="sm" fontWeight="semibold" color="var(--chakra-colors-fg-default)">
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
                borderWidth="1px" borderColor="var(--chakra-colors-border-subtle)"
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

            {/* Key Moments */}
            <Box w="full">
              <SectionHeader
                icon={<ZapIcon />}
                title="Key Moments"
                meta={<Text fontSize="xs" color="var(--chakra-colors-fg-muted)">{call.keyMoments.length} identified</Text>}
              />

              <Box
                bg="var(--chakra-colors-bg-subtle)"
                borderBottomWidth="1px" borderColor="var(--chakra-colors-border-subtle)"
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
                        role="button" tabIndex={0}
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
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault(); onMomentSelect(moment.lineIndex)
                          }
                        }}
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
          </>
        )}

        {/* ══ TAB 2: Quality ═══════════════════════════════════════════ */}
        {activeTab === 'Quality' && (
          <Stack gap={5} w="full">

            {/* ── 1. QA Verdict ────────────────────────────────────────── */}
            <Box
              borderWidth="1px"
              borderColor={`var(--chakra-colors-${verdictPalette}-200)`}
              bg={`var(--chakra-colors-${verdictPalette}-50)`}
              rounded="lg" px={4} py={3}
            >
              <Flex align="center" justify="space-between">
                <Flex align="baseline" gap={2}>
                  <Text
                    fontSize="xl" fontWeight="bold" lineHeight="none"
                    color={`var(--chakra-colors-${verdictPalette}-700)`}
                  >
                    {rubricMet} / 5
                  </Text>
                  <Text
                    fontSize="sm" fontWeight="semibold"
                    color={`var(--chakra-colors-${verdictPalette}-700)`}
                  >
                    {verdictLabel}
                  </Text>
                </Flex>
                <Flex gap={1.5} flexWrap="wrap" justify="flex-end">
                  <Badge
                    colorPalette={call.qaStatus === 'flagged' ? 'red' : call.qaStatus === 'reviewed' ? 'green' : 'gray'}
                    variant="subtle" size="sm" rounded="sm" textTransform="capitalize"
                  >
                    {call.qaStatus}
                  </Badge>
                  {call.churnRisk !== 'none' && (
                    <Badge
                      colorPalette={call.churnRisk === 'high' ? 'red' : call.churnRisk === 'medium' ? 'orange' : 'yellow'}
                      variant="subtle" size="sm" rounded="sm"
                    >
                      Churn {call.churnRisk}
                    </Badge>
                  )}
                  {call.escalationStatus !== 'none' && (
                    <Badge
                      colorPalette={call.escalationStatus === 'escalated' ? 'red' : 'orange'}
                      variant="subtle" size="sm" rounded="sm"
                    >
                      {call.escalationStatus === 'escalated' ? 'Escalated' : 'Pending escalation'}
                    </Badge>
                  )}
                </Flex>
              </Flex>
            </Box>

            {/* ── 2. Agent Rubric ──────────────────────────────────────── */}
            <Box>
              <SectionHeader
                icon={<ShieldIcon />}
                title="Agent Rubric"
                meta={
                  <Badge
                    colorPalette={rubricMet >= 4 ? 'green' : rubricMet >= 3 ? 'orange' : 'red'}
                    variant="subtle" size="sm" rounded="sm"
                  >
                    {rubricMet} / 5 criteria met
                  </Badge>
                }
              />
              <Box
                borderWidth="1px" borderColor="var(--chakra-colors-border-subtle)"
                rounded="lg" overflow="hidden"
              >
                {rubricItems.map((item, i) => (
                  <Flex
                    key={i}
                    gap={3} px={4} py={3}
                    align="flex-start"
                    borderBottomWidth={i < rubricItems.length - 1 ? '1px' : '0'}
                    borderColor="var(--chakra-colors-border-subtle)"
                    bg={item.pass ? 'var(--chakra-colors-bg-panel)' : 'var(--chakra-colors-red-50)'}
                  >
                    <Box
                      flexShrink={0} mt="2px"
                      color={item.pass ? 'var(--chakra-colors-green-600)' : 'var(--chakra-colors-red-500)'}
                    >
                      {item.pass ? <CheckIcon /> : <XMarkIcon />}
                    </Box>
                    <Box flex={1}>
                      <Text
                        fontSize="sm" lineHeight="snug"
                        color={item.pass ? 'var(--chakra-colors-fg-default)' : 'var(--chakra-colors-red-800)'}
                        fontWeight={item.pass ? 'normal' : 'medium'}
                      >
                        {item.label}
                      </Text>
                      {!item.pass && (
                        <Text fontSize="xs" color="var(--chakra-colors-red-600)" mt={0.5} lineHeight="tall">
                          {item.missedReason}
                        </Text>
                      )}
                    </Box>
                  </Flex>
                ))}
              </Box>
            </Box>

            {/* ── 3. Call Signals ──────────────────────────────────────── */}
            <Box>
              <SectionHeader icon={<UserIcon />} title="Call Signals" />
              <Stack gap={2}>

                {/* Sentiment rows */}
                <Box
                  borderWidth="1px" borderColor="var(--chakra-colors-border-subtle)"
                  rounded="lg" overflow="hidden"
                >
                  <Flex
                    align="center" gap={3} px={4} py={3}
                    borderBottomWidth="1px" borderColor="var(--chakra-colors-border-subtle)"
                  >
                    <Text fontSize="xs" color="var(--chakra-colors-fg-muted)" flexShrink={0} w="64px">Customer</Text>
                    <Badge
                      colorPalette={sentimentColorFn(call.sentimentScore.customer)}
                      variant="subtle" size="sm" rounded="sm"
                    >
                      {customerSentimentLabel(call.sentimentScore.customer)}
                    </Badge>
                    <Text fontSize="xs" color="var(--chakra-colors-fg-subtle)" ml="auto">
                      {call.sentimentScore.customer} / 100
                    </Text>
                  </Flex>
                  <Flex align="center" gap={3} px={4} py={3}>
                    <Text fontSize="xs" color="var(--chakra-colors-fg-muted)" flexShrink={0} w="64px">Agent</Text>
                    <Badge
                      colorPalette={sentimentColorFn(call.sentimentScore.agent)}
                      variant="subtle" size="sm" rounded="sm"
                    >
                      {agentSentimentLabel(call.sentimentScore.agent)}
                    </Badge>
                    <Text fontSize="xs" color="var(--chakra-colors-fg-subtle)" ml="auto">
                      {call.sentimentScore.agent} / 100
                    </Text>
                  </Flex>
                </Box>

                {/* Status signals */}
                <Box
                  borderWidth="1px" borderColor="var(--chakra-colors-border-subtle)"
                  rounded="lg" overflow="hidden"
                >
                  <Flex
                    align="center" justify="space-between" px={4} py={3}
                    borderBottomWidth="1px" borderColor="var(--chakra-colors-border-subtle)"
                  >
                    <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">Escalation</Text>
                    <Badge colorPalette={escalationPalette} variant="subtle" size="sm" rounded="sm">
                      {escalationLabel}
                    </Badge>
                  </Flex>
                  <Flex
                    align="center" justify="space-between" px={4} py={3}
                    borderBottomWidth={call.churnRisk !== 'none' ? '1px' : '0'}
                    borderColor="var(--chakra-colors-border-subtle)"
                  >
                    <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">Resolution</Text>
                    <Badge colorPalette={resolutionPalette} variant="subtle" size="sm" rounded="sm">
                      {resolutionLabel}
                    </Badge>
                  </Flex>
                  {call.churnRisk !== 'none' && (
                    <Flex align="center" justify="space-between" px={4} py={3}>
                      <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">Churn Risk</Text>
                      <Badge
                        colorPalette={call.churnRisk === 'high' ? 'red' : call.churnRisk === 'medium' ? 'orange' : 'yellow'}
                        variant="subtle" size="sm" rounded="sm" textTransform="capitalize"
                      >
                        {call.churnRisk}
                      </Badge>
                    </Flex>
                  )}
                </Box>

              </Stack>
            </Box>

            {/* ── 4. Account Context ───────────────────────────────────── */}
            <Box>
              <SectionHeader icon={<BuildingIcon />} title="Account Context" />
              <Box
                borderWidth="1px"
                borderColor={`var(--chakra-colors-${accountHealthPalette}-200)`}
                bg={`var(--chakra-colors-${accountHealthPalette}-50)`}
                rounded="lg" px={4} py={3}
              >
                <Flex align="center" justify="space-between">
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" color="var(--chakra-colors-fg-default)" mb={0.5}>
                      {call.accountName}
                    </Text>
                    <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">
                      {accountCalls.length} call{accountCalls.length !== 1 ? 's' : ''} on record
                      {accountSignals > 0 ? ` · ${accountSignals} negative signal${accountSignals !== 1 ? 's' : ''}` : ''}
                    </Text>
                  </Box>
                  <Flex align="center" gap={2} flexShrink={0}>
                    <Text
                      fontSize="sm" fontWeight="bold"
                      color={`var(--chakra-colors-${accountHealthPalette}-700)`}
                    >
                      {accountHealthScore}
                    </Text>
                    <Badge colorPalette={accountHealthPalette} variant="subtle" size="sm" rounded="sm">
                      {accountHealthLabel}
                    </Badge>
                  </Flex>
                </Flex>
              </Box>
            </Box>

          </Stack>
        )}

        {/* ══ TAB 3: Context — Recurring Issues + Related Conversations ═ */}
        {activeTab === 'Context' && (
          <>
            {/* Recurring Issues */}
            {recurringIssues.length > 0 && (
              <Box w="full">
                <SectionHeader icon={<RepeatIcon />} title="Recurring Issues" />
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

            {/* Related Conversations */}
            <Box w="full">
              <SectionHeader icon={<MessageSquareIcon />} title="Related Conversations" />
              <Stack gap={2}>
                {relatedConversations.map(rel => {
                  const sevPalette = rel.severity === 'high' ? 'red' : rel.severity === 'medium' ? 'orange' : 'gray'
                  return (
                    <Box
                      key={rel.id}
                      role="button" tabIndex={0}
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
          </>
        )}

        {/* ══ TAB 4: Notes — Evidence Notes + Saved In ═════════════════ */}
        {activeTab === 'Notes' && (
          <>
            {/* Evidence Notes */}
            <Box w="full">
              <SectionHeader icon={<PenLineIcon />} title="Evidence Notes" />
              <Textarea
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder="Add notes for QA review or insights report..."
                size="sm" minH="120px" rounded="sm" mb={2} fontSize="sm" resize="vertical"
              />
              <Button w="full" variant="outline" size="sm" rounded="sm" onClick={handleSaveNote}>
                {noteSaved ? 'Saved!' : 'Save Note'}
              </Button>
            </Box>

            {/* Saved In */}
            <Box w="full" pb={4}>
              <SectionHeader icon={<FolderIcon />} title="Saved In" />
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
          </>
        )}

      </Stack>
      </Box>
    </Flex>
  )
}
