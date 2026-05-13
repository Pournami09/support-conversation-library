'use client'

import { useRef, useState } from 'react'
import { Badge, Box, Flex, Text } from '@chakra-ui/react'
import Link from 'next/link'
import type { CallDetailData, SeverityLevel } from '@/lib/types'
import { EvidencePanel } from './EvidencePanel'
import { TranscriptPanel } from './TranscriptPanel'
import { AgentName } from '@/components/agent/AgentName'

// ── Icons ──────────────────────────────────────────────────────────────────

function SvgWrap({ size = 14, children }: { size?: number; children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, display: 'inline-block' }}>
      {children}
    </svg>
  )
}
function ChevronLeft()  { return <SvgWrap><polyline points="15 18 9 12 15 6" /></SvgWrap> }
function ChevronRight() { return <SvgWrap><polyline points="9 18 15 12 9 6" /></SvgWrap> }
function ChevronUp()    { return <SvgWrap size={12}><polyline points="18 15 12 9 6 15" /></SvgWrap> }
function BookmarkIcon() { return <SvgWrap size={15}><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></SvgWrap> }
function ShareIcon() {
  return (
    <SvgWrap size={15}>
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </SvgWrap>
  )
}
function FlagIcon() {
  return (
    <SvgWrap size={13}>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </SvgWrap>
  )
}
function UserCheckIcon() {
  return (
    <SvgWrap size={13}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <polyline points="17 11 19 13 23 9" />
    </SvgWrap>
  )
}
function SparkleIcon() {
  return <SvgWrap size={11}><path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" /></SvgWrap>
}
function PencilIcon() {
  return (
    <SvgWrap size={13}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </SvgWrap>
  )
}

// ── Palette maps ───────────────────────────────────────────────────────────

const SEVERITY_PALETTE: Record<SeverityLevel, string> = {
  critical: 'red', high: 'orange', medium: 'yellow', low: 'gray',
}
const FLAG_PALETTE: Record<string, string> = {
  'escalation': 'red', 'churn-risk': 'orange', 'product-bug': 'gray',
  'policy-concern': 'yellow', 'coaching-opportunity': 'blue',
}
const FLAG_LABEL: Record<string, string> = {
  'escalation': 'Escalation', 'churn-risk': 'Churn Risk', 'product-bug': 'Product Bug',
  'policy-concern': 'Policy Concern', 'coaching-opportunity': 'Coaching',
}
const ACCOUNT_TIER: Record<SeverityLevel, string> = {
  critical: 'Enterprise', high: 'Professional', medium: 'Business', low: 'Starter',
}
const QA_PALETTE: Record<string, string> = {
  flagged: 'red', unreviewed: 'yellow', reviewed: 'green',
}
const QA_LABEL: Record<string, string> = {
  flagged: 'Flagged', unreviewed: 'Unreviewed', reviewed: 'Reviewed',
}

// ── Date / time formatters ─────────────────────────────────────────────────

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  return `${MONTHS[m - 1]} ${d}, ${y}`
}

function formatTime(timeStr: string): string {
  const [h, m] = timeStr.split(':').map(Number)
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}

function formatDuration(durStr: string): string {
  const [m, s] = durStr.split(':').map(Number)
  return `${m}m ${s}s`
}

// ── AI insight helpers ─────────────────────────────────────────────────────

function getIntent(call: CallDetailData): string {
  const cat = call.issueCategory.toLowerCase()
  if (cat.includes('billing'))                           return 'Billing Dispute'
  if (cat.includes('auth') || cat.includes('sso'))       return 'Technical — Access Issue'
  if (cat.includes('cancell') || cat.includes('churn'))  return 'Cancellation Request'
  if (cat.includes('onboard'))                           return 'Onboarding Assistance'
  if (cat.includes('policy') || cat.includes('compliance')) return 'Compliance Review'
  if (cat.includes('renewal') || cat.includes('upgrade'))   return 'Renewal / Upsell'
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
  if (o.includes('resolved'))       return 'Resolved'
  if (o.includes('partial'))        return 'Partially Resolved'
  if (o.includes('escalat'))        return 'Escalated to T2'
  if (o.includes('in progress') || o.includes('pending') || o.includes('awaiting'))
    return 'Follow-up Pending'
  if (o.includes('save attempt'))   return 'Save Attempt'
  return 'Under Review'
}

function getComplianceCheck(call: CallDetailData): { label: string; palette: string } {
  if (call.flags.includes('policy-concern'))
    return { label: 'SOP Violation', palette: 'red' }
  if (call.flags.includes('coaching-opportunity') && call.escalationStatus === 'escalated')
    return { label: 'Protocol Gap', palette: 'orange' }
  if (call.flags.includes('escalation') && call.escalationStatus !== 'escalated')
    return { label: 'Escalation Missed', palette: 'orange' }
  if (call.qaStatus === 'flagged')
    return { label: 'Review Required', palette: 'yellow' }
  return { label: 'No Violations', palette: 'green' }
}

function getChurnSignal(call: CallDetailData): { label: string; palette: string } {
  return {
    high:   { label: 'High Risk',   palette: 'red'    },
    medium: { label: 'Medium Risk', palette: 'orange' },
    low:    { label: 'Low Risk',    palette: 'yellow' },
    none:   { label: 'No Signal',   palette: 'gray'   },
  }[call.churnRisk]
}

// ── Sub-components ─────────────────────────────────────────────────────────

/** Identity card — flex column, never compresses (fit-content in a flex row) */
function IdentityCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box
      display="flex" flexDirection="column"
      flexShrink={0}
      bg="var(--chakra-colors-bg-panel)"
      borderWidth="1px"
      borderColor="var(--chakra-colors-border-subtle)"
      rounded="md" px={3} py={2.5}
    >
      <Text fontSize="10px" fontWeight="semibold" color="var(--chakra-colors-fg-muted)"
        textTransform="uppercase" letterSpacing="wider" mb={1}>
        {label}
      </Text>
      {children}
    </Box>
  )
}

/** Compact label + value pair used inside card bottom rows */
function CardSubField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box>
      <Text fontSize="9px" fontWeight="semibold" color="var(--chakra-colors-fg-muted)"
        textTransform="uppercase" letterSpacing="wider" mb={0.5}>
        {label}
      </Text>
      {children}
    </Box>
  )
}


function AiSignal({ label, value, badge }: {
  label: string
  value?: string
  badge?: { label: string; palette: string }
}) {
  return (
    <Box>
      <Flex align="center" gap={1} mb={0.5}>
        <Box color="var(--chakra-colors-blue-400)"><SparkleIcon /></Box>
        <Text fontSize="10px" fontWeight="semibold" color="var(--chakra-colors-fg-muted)"
          textTransform="uppercase" letterSpacing="wider">
          {label}
        </Text>
      </Flex>
      {badge
        ? <Badge colorPalette={badge.palette} variant="subtle" size="sm" rounded="sm">{badge.label}</Badge>
        : <Text fontSize="xs" fontWeight="medium" color="var(--chakra-colors-fg-default)">{value}</Text>
      }
    </Box>
  )
}

function HDivider() {
  return <Box h="1px" w="full" bg="var(--chakra-colors-border-subtle)" />
}

function Sep() {
  return <Box w="1px" h="16px" bg="var(--chakra-colors-border-subtle)" mx={2} flexShrink={0} />
}

// ── Shared button styles ───────────────────────────────────────────────────

const ghostBtn = {
  display: 'flex', alignItems: 'center', gap: '4px',
  px: 3, py: '5px',
  borderWidth: '1px', borderColor: 'var(--chakra-colors-border-subtle)',
  rounded: 'sm', fontSize: 'xs', fontWeight: 'medium',
  color: 'var(--chakra-colors-fg-default)',
  bg: 'var(--chakra-colors-bg-panel)',
  cursor: 'pointer',
  _hover: { bg: 'var(--chakra-colors-bg-subtle)' },
} as const

const iconBtn = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  w: '28px', h: '28px',
  borderWidth: '1px', borderColor: 'var(--chakra-colors-border-subtle)',
  rounded: 'sm',
  color: 'var(--chakra-colors-fg-default)',
  bg: 'var(--chakra-colors-bg-panel)',
  cursor: 'pointer',
  _hover: { bg: 'var(--chakra-colors-bg-subtle)' },
} as const

// ── Component ──────────────────────────────────────────────────────────────

export default function CallDetail({ call }: { call: CallDetailData }) {
  const [activeLineIndex, setActiveLineIndex] = useState<number | null>(null)
  const [titleText, setTitleText]   = useState(call.title)
  const [editingTitle, setEditingTitle] = useState(false)

  // ── Scroll-away header ─────────────────────────────────────────────────
  const leftScrolled  = useRef(false)
  const rightScrolled = useRef(false)
  const [headerCollapsed, setHeaderCollapsed] = useState(false)
  const leftColRef  = useRef<HTMLDivElement>(null)
  const rightColRef = useRef<HTMLDivElement>(null)

  function handleLeftScroll(e: React.UIEvent<HTMLDivElement>) {
    leftScrolled.current = e.currentTarget.scrollTop > 32
    setHeaderCollapsed(leftScrolled.current || rightScrolled.current)
  }

  function handleRightScroll(e: React.UIEvent<HTMLDivElement>) {
    rightScrolled.current = e.currentTarget.scrollTop > 32
    setHeaderCollapsed(leftScrolled.current || rightScrolled.current)
  }

  /** Compact bar click — expands header in place, columns keep their scroll position */
  function handleCompactBarClick() {
    leftScrolled.current = false
    rightScrolled.current = false
    setHeaderCollapsed(false)
  }

  // ── Resizable split pane ───────────────────────────────────────────────
  const [leftWidthPct, setLeftWidthPct] = useState(50)
  const [isDraggingHandle, setIsDraggingHandle] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  function handleDragStart(e: React.MouseEvent) {
    e.preventDefault()
    dragging.current = true
    setIsDraggingHandle(true)

    const onMove = (e: MouseEvent) => {
      if (!dragging.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const raw = ((e.clientX - rect.left) / rect.width) * 100
      setLeftWidthPct(Math.max(25, Math.min(75, raw)))
    }

    const onUp = () => {
      dragging.current = false
      setIsDraggingHandle(false)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  function handleMomentSelect(lineIndex: number) {
    setActiveLineIndex(prev => prev === lineIndex ? null : lineIndex)
  }

  const callRef     = `CVR-2024-${call.id.padStart(5, '0')}`
  const accountTier = ACCOUNT_TIER[call.severity]
  const effort      = getEffortScore(call)
  const compliance  = getComplianceCheck(call)
  const churn       = getChurnSignal(call)

  return (
    <Flex h="full" flexDirection="column" bg="var(--chakra-colors-bg-panel)" overflow="hidden">

      {/* ── Breadcrumbs + navigation + CTAs ──────────────────────────── */}
      <Flex
        px={6} py={3}
        borderBottomWidth="1px" borderColor="var(--chakra-colors-border-subtle)"
        align="center" justify="space-between"
        bg="var(--chakra-colors-bg-panel)" flexShrink={0}
      >
        <Text fontSize="sm" color="var(--chakra-colors-fg-muted)" fontWeight="medium">
          {callRef}
        </Text>

        <Flex align="center" gap={2}>
          <Box as="button" {...ghostBtn}><ChevronLeft /> Prev</Box>
          <Box as="button" {...ghostBtn}>Next <ChevronRight /></Box>

          <Sep />

          <Box as="button" aria-label="Save" {...iconBtn}><BookmarkIcon /></Box>
          <Box as="button" aria-label="Share" {...iconBtn}><ShareIcon /></Box>

          <Sep />

          {/* Assign Coaching — secondary */}
          <Box as="button" {...ghostBtn} gap="5px">
            <UserCheckIcon /> Assign Coaching
          </Box>

          {/* Flag Review — primary */}
          <Box
            as="button"
            display="flex" alignItems="center" gap="5px"
            px={3} py="5px"
            borderWidth="1px" borderColor="var(--chakra-colors-blue-600)"
            rounded="sm" fontSize="xs" fontWeight="semibold"
            color="white"
            bg="var(--chakra-colors-blue-600)"
            cursor="pointer"
            _hover={{ bg: 'var(--chakra-colors-blue-700)', borderColor: 'var(--chakra-colors-blue-700)' }}
          >
            <FlagIcon /> Flag Review
          </Box>
        </Flex>
      </Flex>

      {/* ── Conversation Details — collapses on scroll ────────────────── */}
      {/* bg-subtle background groups all metadata fields together visually  */}
      <Box
        flexShrink={0}
        bg="var(--chakra-colors-bg-subtle)"
        style={{
          overflow: 'hidden',
          maxHeight: headerCollapsed ? '0px' : '600px',
          opacity: headerCollapsed ? 0 : 1,
          borderBottom: headerCollapsed
            ? 'none'
            : '1px solid var(--chakra-colors-border-subtle)',
          transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease',
          pointerEvents: headerCollapsed ? 'none' : 'auto',
        }}
      >
        <Box px={6} pt={5} pb={4}>
          {/* Title + status badges */}
          <Flex align="flex-start" justify="space-between" gap={4} mb={4}>
            <Box flex={1}>
              {editingTitle ? (
                <input
                  value={titleText}
                  onChange={e => setTitleText(e.target.value)}
                  onBlur={() => setEditingTitle(false)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === 'Escape') {
                      e.preventDefault(); setEditingTitle(false)
                    }
                  }}
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  style={{
                    width: '100%', fontSize: '1.25rem', fontWeight: '600',
                    lineHeight: '1.25', color: 'var(--chakra-colors-fg-default)',
                    background: 'var(--chakra-colors-bg-panel)',
                    border: '1px solid var(--chakra-colors-border-emphasized)',
                    borderRadius: '4px', padding: '2px 6px', outline: 'none',
                  }}
                />
              ) : (
                <Flex align="center" gap={1.5} role="group" cursor="text"
                  w="fit-content" maxW="full" onClick={() => setEditingTitle(true)}>
                  <Text fontSize="xl" fontWeight="semibold"
                    color="var(--chakra-colors-fg-default)" lineHeight="tight">
                    {titleText}
                  </Text>
                  <Box color="var(--chakra-colors-fg-muted)" opacity={0}
                    _groupHover={{ opacity: 1 }} transition="opacity 0.15s ease" flexShrink={0}>
                    <PencilIcon />
                  </Box>
                </Flex>
              )}
            </Box>
            <Flex gap={1.5} flexShrink={0} flexWrap="wrap" justify="flex-end" mt={0.5}>
              <Badge colorPalette={SEVERITY_PALETTE[call.severity]}
                variant="subtle" size="sm" rounded="sm" textTransform="capitalize">
                {call.severity}
              </Badge>
              {call.flags.map(f => (
                <Badge key={f} colorPalette={FLAG_PALETTE[f] ?? 'gray'}
                  variant="subtle" size="sm" rounded="sm">
                  {FLAG_LABEL[f] ?? f}
                </Badge>
              ))}
            </Flex>
          </Flex>

          {/*
            Identity cards — Flex row so each card is exactly as wide as its content.
            B2B IA order: Account (primary entity) → Contact (person) → Agent → Call.
            Region is an account-level attribute (sales territory), not a contact attribute.
          */}
          <Flex gap={2.5} align="stretch" mb={4}>

            {/* Account — the company; primary entity in B2B.
                Tier, Region (territory), and Product Area all belong to the account. */}
            <IdentityCard label="Account">
              <Text fontSize="sm" fontWeight="semibold" color="var(--chakra-colors-fg-default)">
                {call.accountName}
              </Text>
              <Flex gap={4} style={{ marginTop: 'auto' }} pt={2}>
                <CardSubField label="Tier">
                  <Badge colorPalette="blue" variant="subtle" size="sm" rounded="sm">{accountTier}</Badge>
                </CardSubField>
                <CardSubField label="Region">
                  <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">{call.region}</Text>
                </CardSubField>
                <CardSubField label="Product Area">
                  <Badge colorPalette="gray" variant="subtle" size="sm" rounded="sm">{call.productArea}</Badge>
                </CardSubField>
              </Flex>
            </IdentityCard>

            {/* Contact — the person at the account; lean, just identity. */}
            <IdentityCard label="Contact">
              <Text fontSize="sm" fontWeight="semibold" color="var(--chakra-colors-fg-default)">
                {call.customerName}
              </Text>
            </IdentityCard>

            {/* Agent — the internal handler */}
            <IdentityCard label="Agent">
              <AgentName name={call.agentName} showAvatar size="sm" />
            </IdentityCard>

            {/* Call — interaction logistics: date primary, time + duration at bottom */}
            <IdentityCard label="Call">
              <Text fontSize="sm" fontWeight="semibold" color="var(--chakra-colors-fg-default)">
                {formatDate(call.date)}
              </Text>
              <Box style={{ marginTop: 'auto' }} pt={2}>
                <CardSubField label="Time · Duration">
                  <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">
                    {formatTime(call.time)} · {formatDuration(call.duration)}
                  </Text>
                </CardSubField>
              </Box>
            </IdentityCard>

          </Flex>

          <HDivider />

          {/* AI intelligence signals */}
          <Flex align="flex-start" gap={6} pt={3} flexWrap="wrap">
            <AiSignal label="Intent"          value={getIntent(call)} />
            <AiSignal label="Customer Effort" badge={effort} />
            <AiSignal label="Compliance"      badge={compliance} />
            <AiSignal label="Resolution"      value={getResolutionType(call)} />
            <AiSignal label="Churn Signal"    badge={churn} />
          </Flex>
        </Box>
      </Box>

      {/* ── Compact ID bar — clickable to jump back to top ────────────── */}
      <Box
        flexShrink={0}
        bg="var(--chakra-colors-bg-panel)"
        borderBottomWidth="1px"
        borderColor="var(--chakra-colors-border-subtle)"
        cursor="pointer"
        onClick={handleCompactBarClick}
        _hover={{ bg: 'var(--chakra-colors-bg-subtle)' }}
        role="button"
        aria-label="Click to view full call details"
        style={{
          overflow: 'hidden',
          maxHeight: headerCollapsed ? '40px' : '0px',
          opacity: headerCollapsed ? 1 : 0,
          transition: 'max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease 0.1s',
          pointerEvents: headerCollapsed ? 'auto' : 'none',
        }}
      >
        <Flex px={6} align="center" h="40px" overflow="hidden" justify="space-between">
          {/* Left: identification info */}
          <Flex align="center" gap={0} overflow="hidden" flex={1} minW={0}>
            <Text fontSize="xs" fontWeight="semibold" color="var(--chakra-colors-fg-default)"
              flexShrink={0} overflow="hidden"
              style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '280px' }}>
              {titleText}
            </Text>
            <Box w="1px" h="12px" bg="var(--chakra-colors-border-subtle)" mx={3} flexShrink={0} />
            <Text fontSize="xs" fontWeight="medium" color="var(--chakra-colors-fg-muted)"
              fontFamily="mono" flexShrink={0}>
              {callRef}
            </Text>
            <Badge colorPalette={QA_PALETTE[call.qaStatus] ?? 'gray'}
              variant="subtle" size="sm" rounded="sm" ml={2} flexShrink={0}>
              {QA_LABEL[call.qaStatus] ?? call.qaStatus}
            </Badge>
            <Box w="1px" h="12px" bg="var(--chakra-colors-border-subtle)" mx={3} flexShrink={0} />
            <Text fontSize="xs" color="var(--chakra-colors-fg-muted)" flexShrink={0}>
              {call.customerName}
            </Text>
            <Text fontSize="xs" color="var(--chakra-colors-fg-muted)" mx={1.5} flexShrink={0}>·</Text>
            <Text fontSize="xs" color="var(--chakra-colors-fg-muted)" flexShrink={0}
              overflow="hidden" style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>
              {call.accountName}
            </Text>
            <Box w="1px" h="12px" bg="var(--chakra-colors-border-subtle)" mx={3} flexShrink={0} />
            <Box flexShrink={0}><AgentName name={call.agentName} size="xs" /></Box>
          </Flex>

          {/* Right: jump-to-top hint */}
          <Flex align="center" gap={1} flexShrink={0} ml={4}
            color="var(--chakra-colors-fg-muted)">
            <Text fontSize="xs">View details</Text>
            <ChevronUp />
          </Flex>
        </Flex>
      </Box>

      {/* ── Split pane — left col is resizable via drag handle ────────── */}
      <Flex
        flex={1} overflow="hidden"
        ref={containerRef}
        style={{
          userSelect: isDraggingHandle ? 'none' : 'auto',
          cursor: isDraggingHandle ? 'col-resize' : 'auto',
        }}
      >
        {/* Left column — tab bar sits outside the scroll area to avoid focus-scroll */}
        <Box
          display="flex"
          flexDirection="column"
          overflow="hidden"
          style={{ width: `${leftWidthPct}%`, flexShrink: 0 }}
        >
          <EvidencePanel
            call={call}
            activeLineIndex={activeLineIndex}
            onMomentSelect={handleMomentSelect}
            scrollRef={leftColRef}
            onScroll={handleLeftScroll}
          />
        </Box>

        {/* Drag handle */}
        <Box
          w="4px"
          bg={isDraggingHandle ? 'var(--chakra-colors-blue-400)' : 'var(--chakra-colors-border-subtle)'}
          cursor="col-resize"
          flexShrink={0}
          transition="background-color 0.15s ease"
          _hover={{ bg: 'var(--chakra-colors-blue-300)' }}
          onMouseDown={handleDragStart}
          title="Drag to resize"
        />

        {/* Right column — transcript */}
        <Box ref={rightColRef} flex={1} overflowY="auto" onScroll={handleRightScroll}>
          <TranscriptPanel
            call={call}
            activeLineIndex={activeLineIndex}
            onLineClick={handleMomentSelect}
          />
          {/* Bottom padding so content isn't flush when header re-expands */}
          <Box h={20} flexShrink={0} />
        </Box>
      </Flex>
    </Flex>
  )
}
