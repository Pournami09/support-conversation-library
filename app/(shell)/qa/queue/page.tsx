'use client'

import { useMemo, useRef, useEffect, useState } from 'react'
import { Badge, Box, Flex, Table, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { getAllCallDetails } from '@/lib/data/calls'
import type { CallDetailData, CallFlag } from '@/lib/types'
import { AgentName } from '@/components/agent/AgentName'

// ── Constants ──────────────────────────────────────────────────────────────

const SEVERITY_PALETTE: Record<string, string> = {
  critical: 'red', high: 'orange', medium: 'yellow', low: 'gray',
}
const QA_PALETTE: Record<string, string> = {
  flagged: 'red', unreviewed: 'yellow', reviewed: 'green',
}
const QA_LABEL: Record<string, string> = {
  flagged: 'Flagged', unreviewed: 'Unreviewed', reviewed: 'Reviewed',
}
const FLAG_LABEL: Record<string, string> = {
  'escalation': 'Escalation', 'churn-risk': 'Churn Risk',
  'product-bug': 'Bug', 'policy-concern': 'Policy', 'coaching-opportunity': 'Coaching',
}
const FLAG_PALETTE: Record<string, string> = {
  'escalation': 'red', 'churn-risk': 'orange', 'product-bug': 'gray',
  'policy-concern': 'yellow', 'coaching-opportunity': 'blue',
}
const TIER_MAP: Record<string, string> = {
  critical: 'Enterprise', high: 'Professional', medium: 'Business', low: 'Starter',
}

const SEVERITY_OPTIONS = [
  { value: 'critical', label: 'Critical' },
  { value: 'high',     label: 'High'     },
  { value: 'medium',   label: 'Medium'   },
  { value: 'low',      label: 'Low'      },
]
const QA_STATUS_OPTIONS = [
  { value: 'flagged',    label: 'Flagged'    },
  { value: 'unreviewed', label: 'Unreviewed' },
  { value: 'reviewed',   label: 'Reviewed'   },
]
const FLAG_OPTIONS = [
  { value: 'escalation',           label: 'Escalation' },
  { value: 'churn-risk',           label: 'Churn Risk' },
  { value: 'product-bug',          label: 'Bug'        },
  { value: 'policy-concern',       label: 'Policy'     },
  { value: 'coaching-opportunity', label: 'Coaching'   },
]
const TIER_OPTIONS = [
  { value: 'Enterprise',   label: 'Enterprise'   },
  { value: 'Professional', label: 'Professional' },
  { value: 'Business',     label: 'Business'     },
  { value: 'Starter',      label: 'Starter'      },
]

type DateRange = 'all' | 'today' | 'yesterday' | 'last7' | 'last30' | 'last90'
type SortDir   = 'asc' | 'desc'

const DATE_RANGE_LABELS: Record<DateRange, string> = {
  all:       'All time',
  today:     'Today',
  yesterday: 'Yesterday',
  last7:     'Last 7 days',
  last30:    'Last 30 days',
  last90:    'Last 90 days',
}

// ── Helpers ────────────────────────────────────────────────────────────────

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function fmtDate(s: string) {
  const [, m, d] = s.split('-').map(Number)
  return `${MONTHS[m - 1]} ${d}`
}
function fmtTime(s: string) {
  const [h, min] = s.split(':').map(Number)
  return `${h % 12 || 12}:${String(min).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}

function inRange(dateStr: string, range: DateRange): boolean {
  if (range === 'all') return true
  const [y, m, d] = dateStr.split('-').map(Number)
  const callMs = new Date(y, m - 1, d).getTime()
  const now = new Date(); now.setHours(0, 0, 0, 0)
  const todayMs = now.getTime()
  const DAY = 86_400_000
  if (range === 'today')     return callMs >= todayMs
  if (range === 'yesterday') return callMs >= todayMs - DAY && callMs < todayMs
  if (range === 'last7')     return callMs >= todayMs - 7  * DAY
  if (range === 'last30')    return callMs >= todayMs - 30 * DAY
  if (range === 'last90')    return callMs >= todayMs - 90 * DAY
  return true
}

// ── SVG Icons ──────────────────────────────────────────────────────────────

function Ico({ children, size = 14 }: { children: React.ReactNode; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, display: 'inline-block' }}>
      {children}
    </svg>
  )
}
function SearchIcon()    { return <Ico size={13}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></Ico> }
function ChevronDownIco(){ return <Ico size={11}><polyline points="6 9 12 15 18 9"/></Ico> }
function CheckIco()      { return <Ico size={12}><polyline points="20 6 9 17 4 12"/></Ico> }
function XTinyIcon()     { return <Ico size={10}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Ico> }
function SortDescIcon()  { return <Ico size={13}><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></Ico> }
function SortAscIcon()   { return <Ico size={13}><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></Ico> }

// ── Shared dropdown opener style ───────────────────────────────────────────

function dropBtn(active: boolean) {
  return {
    display: 'flex', alignItems: 'center', gap: '5px',
    px: 3, h: '30px',
    borderWidth: '1px',
    borderColor: active ? 'var(--chakra-colors-blue-400)' : 'var(--chakra-colors-border-subtle)',
    bg: active ? 'var(--chakra-colors-blue-50)' : 'var(--chakra-colors-bg-panel)',
    rounded: 'sm',
    fontSize: 'xs', fontWeight: 'medium',
    color: active ? 'var(--chakra-colors-blue-700)' : 'var(--chakra-colors-fg-default)',
    cursor: 'pointer',
    transition: 'all 0.1s ease',
    _hover: {
      borderColor: 'var(--chakra-colors-blue-400)',
      bg: 'var(--chakra-colors-blue-50)',
      color: 'var(--chakra-colors-blue-700)',
    },
  } as const
}

// ── MultiSelect ────────────────────────────────────────────────────────────

function MultiSelect({
  label, options, selected, onChange,
}: {
  label: string
  options: { value: string; label: string }[]
  selected: string[]
  onChange: (v: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  function toggle(v: string) {
    onChange(selected.includes(v) ? selected.filter(x => x !== v) : [...selected, v])
  }

  const active = selected.length > 0

  return (
    <Box ref={ref} position="relative" flexShrink={0}>
      <Box as="button" onClick={() => setOpen(o => !o)} {...dropBtn(active)}>
        {label}
        {active && (
          <Box
            display="inline-flex" alignItems="center" justifyContent="center"
            w="16px" h="16px" rounded="full"
            bg="var(--chakra-colors-blue-600)" color="white"
            style={{ fontSize: '10px', fontWeight: 700, flexShrink: 0 }}
          >
            {selected.length}
          </Box>
        )}
        <ChevronDownIco />
      </Box>

      {open && (
        <Box
          position="absolute" top="calc(100% + 4px)" left={0}
          bg="var(--chakra-colors-bg-panel)"
          borderWidth="1px" borderColor="var(--chakra-colors-border-subtle)"
          rounded="md" overflow="hidden" zIndex={100} minW="180px"
          style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.09)' }}
        >
          {options.map(opt => {
            const checked = selected.includes(opt.value)
            return (
              <Box
                key={opt.value} as="button"
                onClick={() => toggle(opt.value)}
                display="flex" alignItems="center" gap="8px"
                w="full" px={3} py={2} textAlign="left"
                bg={checked ? 'var(--chakra-colors-blue-50)' : 'transparent'}
                _hover={{ bg: checked ? 'var(--chakra-colors-blue-50)' : 'var(--chakra-colors-bg-subtle)' }}
                transition="background-color 0.1s ease" cursor="pointer"
              >
                <Box
                  w="14px" h="14px" flexShrink={0} rounded="sm"
                  borderWidth="1px"
                  borderColor={checked ? 'var(--chakra-colors-blue-500)' : 'var(--chakra-colors-border-emphasized)'}
                  bg={checked ? 'var(--chakra-colors-blue-500)' : 'transparent'}
                  display="flex" alignItems="center" justifyContent="center"
                >
                  {checked && (
                    <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                      <polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </Box>
                <Text fontSize="xs" color="var(--chakra-colors-fg-default)">{opt.label}</Text>
              </Box>
            )
          })}
          {active && (
            <>
              <Box h="1px" bg="var(--chakra-colors-border-subtle)" />
              <Box
                as="button"
                onClick={() => { onChange([]); setOpen(false) }}
                display="flex" alignItems="center"
                w="full" px={3} py={2}
                fontSize="xs" color="var(--chakra-colors-fg-muted)"
                _hover={{ bg: 'var(--chakra-colors-bg-subtle)', color: 'var(--chakra-colors-fg-default)' }}
                transition="background-color 0.1s ease" cursor="pointer"
              >
                Clear selection
              </Box>
            </>
          )}
        </Box>
      )}
    </Box>
  )
}

// ── DateRangeSelect ────────────────────────────────────────────────────────

function DateRangeSelect({ value, onChange }: { value: DateRange; onChange: (v: DateRange) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const active = value !== 'all'

  return (
    <Box ref={ref} position="relative" flexShrink={0}>
      <Box as="button" onClick={() => setOpen(o => !o)} {...dropBtn(active)}>
        {DATE_RANGE_LABELS[value]}
        <ChevronDownIco />
      </Box>

      {open && (
        <Box
          position="absolute" top="calc(100% + 4px)" left={0}
          bg="var(--chakra-colors-bg-panel)"
          borderWidth="1px" borderColor="var(--chakra-colors-border-subtle)"
          rounded="md" overflow="hidden" zIndex={100} minW="160px"
          style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.09)' }}
        >
          {(Object.keys(DATE_RANGE_LABELS) as DateRange[]).map(range => {
            const sel = value === range
            return (
              <Box
                key={range} as="button"
                onClick={() => { onChange(range); setOpen(false) }}
                display="flex" alignItems="center" gap="8px"
                w="full" px={3} py={2}
                fontSize="xs" fontWeight={sel ? 'semibold' : 'normal'}
                color={sel ? 'var(--chakra-colors-blue-700)' : 'var(--chakra-colors-fg-default)'}
                bg={sel ? 'var(--chakra-colors-blue-50)' : 'transparent'}
                _hover={{ bg: 'var(--chakra-colors-bg-subtle)' }}
                transition="background-color 0.1s ease" cursor="pointer"
              >
                <Box w="14px" h="14px" flexShrink={0} display="flex" alignItems="center" justifyContent="center"
                  color="var(--chakra-colors-blue-600)">
                  {sel && <CheckIco />}
                </Box>
                {DATE_RANGE_LABELS[range]}
              </Box>
            )
          })}
        </Box>
      )}
    </Box>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function ScoringQueuePage() {
  const [search,     setSearch]     = useState('')
  const [agents,     setAgents]     = useState<string[]>([])
  const [tiers,      setTiers]      = useState<string[]>([])
  const [severities, setSeverities] = useState<string[]>([])
  const [flagSel,    setFlagSel]    = useState<string[]>([])
  const [qaStatuses, setQaStatuses] = useState<string[]>([])
  const [dateRange,  setDateRange]  = useState<DateRange>('all')
  const [sortDir,    setSortDir]    = useState<SortDir>('desc')

  const allCalls = useMemo(() => getAllCallDetails(), [])

  const agentOptions = useMemo(() =>
    [...new Set(allCalls.map(c => c.agentName))].sort()
      .map(name => ({ value: name, label: name })),
    [allCalls]
  )

  const filtered = useMemo(() => {
    let r: CallDetailData[] = allCalls

    const q = search.trim().toLowerCase()
    if (q) r = r.filter(c =>
      c.customerName.toLowerCase().includes(q) ||
      c.accountName.toLowerCase().includes(q)
    )
    if (agents.length)     r = r.filter(c => agents.includes(c.agentName))
    if (tiers.length)      r = r.filter(c => tiers.includes(TIER_MAP[c.severity]))
    if (severities.length) r = r.filter(c => severities.includes(c.severity))
    if (flagSel.length)    r = r.filter(c => flagSel.some(f => c.flags.includes(f as CallFlag)))
    if (qaStatuses.length) r = r.filter(c => qaStatuses.includes(c.qaStatus))
    r = r.filter(c => inRange(c.date, dateRange))

    return [...r].sort((a, b) => {
      const at = new Date(a.date).getTime()
      const bt = new Date(b.date).getTime()
      return sortDir === 'desc' ? bt - at : at - bt
    })
  }, [allCalls, search, agents, tiers, severities, flagSel, qaStatuses, dateRange, sortDir])

  const hasFilters =
    !!search.trim() || agents.length > 0 || tiers.length > 0 ||
    severities.length > 0 || flagSel.length > 0 || qaStatuses.length > 0 || dateRange !== 'all'

  function clearAll() {
    setSearch(''); setAgents([]); setTiers([]); setSeverities([])
    setFlagSel([]); setQaStatuses([]); setDateRange('all')
  }

  const flaggedCount    = filtered.filter(c => c.qaStatus === 'flagged').length
  const unreviewedCount = filtered.filter(c => c.qaStatus === 'unreviewed').length
  const escalatedCount  = filtered.filter(c => c.escalationStatus === 'escalated').length

  // Column header bg — must match exactly for sticky to look seamless
  const TH_BG = 'var(--chakra-colors-bg-subtle)'

  return (
    // h="full" fills the shell content box; flex column lets header + filter be fixed,
    // table section gets flex=1 and owns its own scroll.
    <Box h="full" display="flex" flexDirection="column">

      {/* ── Page header ─────────────────────────────────────────────── */}
      <Box px={8} pt={6} pb={3} flexShrink={0} bg="var(--chakra-colors-bg-subtle)">
        <Text fontSize="2xl" fontWeight="semibold" color="var(--chakra-colors-fg-default)"
          lineHeight="none" mb={1}>
          Scoring Queue
        </Text>
        <Text fontSize="sm" color="var(--chakra-colors-fg-muted)">
          Review and score agent conversations against your rubrics.
        </Text>
      </Box>

      {/* ── Filter bar ──────────────────────────────────────────────── */}
      <Box
        px={8} py={3} flexShrink={0}
        bg="var(--chakra-colors-bg-panel)"
        borderTopWidth="1px" borderBottomWidth="1px"
        borderColor="var(--chakra-colors-border-subtle)"
      >
        <Flex gap={2} align="center" flexWrap="wrap">

          {/* Search */}
          <Flex
            align="center" gap={0}
            borderWidth="1px" borderColor="var(--chakra-colors-border-subtle)"
            bg="var(--chakra-colors-bg-panel)"
            rounded="sm" overflow="hidden"
            flexShrink={0}
            style={{ minWidth: '220px' }}
            _focusWithin={{ borderColor: 'var(--chakra-colors-blue-400)' }}
            transition="border-color 0.1s ease"
          >
            <Box pl={2.5} color="var(--chakra-colors-fg-muted)" flexShrink={0} display="flex" alignItems="center">
              <SearchIcon />
            </Box>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search customer or account…"
              style={{
                flex: 1, height: '30px', padding: '0 8px',
                fontSize: '0.75rem', color: 'var(--chakra-colors-fg-default)',
                background: 'transparent', border: 'none', outline: 'none',
              }}
            />
            {search && (
              <Box
                as="button" onClick={() => setSearch('')}
                pr={2} color="var(--chakra-colors-fg-muted)"
                cursor="pointer" flexShrink={0} display="flex" alignItems="center"
                _hover={{ color: 'var(--chakra-colors-fg-default)' }}
              >
                <XTinyIcon />
              </Box>
            )}
          </Flex>

          <MultiSelect label="Agent"     options={agentOptions}      selected={agents}     onChange={setAgents} />
          <MultiSelect label="Tier"      options={TIER_OPTIONS}      selected={tiers}      onChange={setTiers} />
          <MultiSelect label="Severity"  options={SEVERITY_OPTIONS}  selected={severities} onChange={setSeverities} />
          <MultiSelect label="Flags"     options={FLAG_OPTIONS}      selected={flagSel}    onChange={setFlagSel} />
          <MultiSelect label="QA Status" options={QA_STATUS_OPTIONS} selected={qaStatuses} onChange={setQaStatuses} />

          <DateRangeSelect value={dateRange} onChange={setDateRange} />

          {/* Sort toggle */}
          <Box
            as="button"
            onClick={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')}
            display="flex" alignItems="center" gap="5px"
            px={3} h="30px"
            borderWidth="1px" borderColor="var(--chakra-colors-border-subtle)"
            bg="var(--chakra-colors-bg-panel)"
            rounded="sm" fontSize="xs" fontWeight="medium"
            color="var(--chakra-colors-fg-default)"
            cursor="pointer" flexShrink={0}
            _hover={{ bg: 'var(--chakra-colors-bg-subtle)' }}
            transition="all 0.1s ease"
            title={sortDir === 'desc' ? 'Newest first — click to reverse' : 'Oldest first — click to reverse'}
          >
            {sortDir === 'desc' ? <SortDescIcon /> : <SortAscIcon />}
            Date
          </Box>

          {/* Clear all */}
          {hasFilters && (
            <Box
              as="button" onClick={clearAll}
              display="flex" alignItems="center" gap="4px"
              px={2} h="30px" flexShrink={0}
              fontSize="xs" color="var(--chakra-colors-fg-muted)"
              cursor="pointer"
              _hover={{ color: 'var(--chakra-colors-fg-default)' }}
              transition="color 0.1s ease"
            >
              <XTinyIcon /> Clear all
            </Box>
          )}
        </Flex>
      </Box>

      {/* ── Scrollable table area ────────────────────────────────────── */}
      {/* This box is the sole scroll container for the table.
          Table.ColumnHeader uses position=sticky top=0 relative to this box. */}
      <Box flex={1} minH={0} overflowY="auto" px={8} py={5} bg="var(--chakra-colors-bg-subtle)">

        {/* Summary chips — scroll away as user scrolls down */}
        <Flex align="center" justify="space-between" mb={4} flexWrap="wrap" gap={2}>
          <Flex gap={2} flexWrap="wrap">
            <Box
              bg="var(--chakra-colors-bg-panel)"
              borderWidth="1px" borderColor="var(--chakra-colors-border-subtle)"
              rounded="md" px={3} py={1.5}
            >
              <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">
                <Text as="span" fontWeight="semibold" color="var(--chakra-colors-fg-default)">{filtered.length}</Text>
                {' '}calls
              </Text>
            </Box>
            {flaggedCount > 0 && (
              <Box bg="var(--chakra-colors-red-50)"
                borderWidth="1px" borderColor="var(--chakra-colors-red-200)"
                rounded="md" px={3} py={1.5}>
                <Text fontSize="xs" color="var(--chakra-colors-red-700)">
                  <Text as="span" fontWeight="semibold">{flaggedCount}</Text> flagged
                </Text>
              </Box>
            )}
            {unreviewedCount > 0 && (
              <Box bg="var(--chakra-colors-yellow-50)"
                borderWidth="1px" borderColor="var(--chakra-colors-yellow-200)"
                rounded="md" px={3} py={1.5}>
                <Text fontSize="xs" color="var(--chakra-colors-yellow-700)">
                  <Text as="span" fontWeight="semibold">{unreviewedCount}</Text> unreviewed
                </Text>
              </Box>
            )}
            {escalatedCount > 0 && (
              <Box bg="var(--chakra-colors-orange-50)"
                borderWidth="1px" borderColor="var(--chakra-colors-orange-200)"
                rounded="md" px={3} py={1.5}>
                <Text fontSize="xs" color="var(--chakra-colors-orange-700)">
                  <Text as="span" fontWeight="semibold">{escalatedCount}</Text> escalated
                </Text>
              </Box>
            )}
          </Flex>
          {hasFilters && (
            <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">
              {filtered.length} of {allCalls.length} calls
            </Text>
          )}
        </Flex>

        {/* Table — wrapper has border+rounding but NO overflow so sticky works */}
        <Box
          borderWidth="1px" borderColor="var(--chakra-colors-border-subtle)"
          rounded="sm" bg="var(--chakra-colors-bg-panel)"
        >
          <Table.Root size="sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <Table.Header>
              <Table.Row>
                {/* Each TH is sticky. top=0 anchors to the scroll container above. */}
                <Table.ColumnHeader
                  position="sticky" top={0} zIndex={2}
                  py={2.5} px={4} bg={TH_BG}
                  color="var(--chakra-colors-fg-muted)" fontWeight="semibold"
                  fontSize="xs" letterSpacing="wider" textTransform="uppercase"
                  borderBottomWidth="1px" borderColor="var(--chakra-colors-border-subtle)"
                  style={{ width: '110px' }}
                >
                  Date
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  position="sticky" top={0} zIndex={2}
                  py={2.5} px={4} bg={TH_BG}
                  color="var(--chakra-colors-fg-muted)" fontWeight="semibold"
                  fontSize="xs" letterSpacing="wider" textTransform="uppercase"
                  borderBottomWidth="1px" borderColor="var(--chakra-colors-border-subtle)"
                  style={{ width: '150px' }}
                >
                  Agent
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  position="sticky" top={0} zIndex={2}
                  py={2.5} px={4} bg={TH_BG}
                  color="var(--chakra-colors-fg-muted)" fontWeight="semibold"
                  fontSize="xs" letterSpacing="wider" textTransform="uppercase"
                  borderBottomWidth="1px" borderColor="var(--chakra-colors-border-subtle)"
                  style={{ width: '140px' }}
                >
                  Customer
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  position="sticky" top={0} zIndex={2}
                  py={2.5} px={4} bg={TH_BG}
                  color="var(--chakra-colors-fg-muted)" fontWeight="semibold"
                  fontSize="xs" letterSpacing="wider" textTransform="uppercase"
                  borderBottomWidth="1px" borderColor="var(--chakra-colors-border-subtle)"
                  style={{ width: '160px' }}
                >
                  Account
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  position="sticky" top={0} zIndex={2}
                  py={2.5} px={4} bg={TH_BG}
                  color="var(--chakra-colors-fg-muted)" fontWeight="semibold"
                  fontSize="xs" letterSpacing="wider" textTransform="uppercase"
                  borderBottomWidth="1px" borderColor="var(--chakra-colors-border-subtle)"
                  style={{ width: '90px' }}
                >
                  Severity
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  position="sticky" top={0} zIndex={2}
                  py={2.5} px={4} bg={TH_BG}
                  color="var(--chakra-colors-fg-muted)" fontWeight="semibold"
                  fontSize="xs" letterSpacing="wider" textTransform="uppercase"
                  borderBottomWidth="1px" borderColor="var(--chakra-colors-border-subtle)"
                  style={{ width: '100px' }}
                >
                  QA Status
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  position="sticky" top={0} zIndex={2}
                  py={2.5} px={4} bg={TH_BG}
                  color="var(--chakra-colors-fg-muted)" fontWeight="semibold"
                  fontSize="xs" letterSpacing="wider" textTransform="uppercase"
                  borderBottomWidth="1px" borderColor="var(--chakra-colors-border-subtle)"
                >
                  Flags
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  position="sticky" top={0} zIndex={2}
                  py={2.5} px={4} bg={TH_BG}
                  color="var(--chakra-colors-fg-muted)" fontWeight="semibold"
                  fontSize="xs" letterSpacing="wider" textTransform="uppercase"
                  borderBottomWidth="1px" borderColor="var(--chakra-colors-border-subtle)"
                  style={{ width: '80px' }}
                >
                  Duration
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {filtered.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={8} py={16} textAlign="center">
                    <Text fontSize="sm" color="var(--chakra-colors-fg-muted)" mb={2}>
                      No calls match your filters.
                    </Text>
                    {hasFilters && (
                      <Box
                        as="button" onClick={clearAll}
                        fontSize="xs" color="var(--chakra-colors-blue-600)"
                        cursor="pointer"
                        _hover={{ color: 'var(--chakra-colors-blue-700)' }}
                      >
                        Clear all filters →
                      </Box>
                    )}
                  </Table.Cell>
                </Table.Row>
              ) : filtered.map((call, i) => (
                <Table.Row
                  key={call.id}
                  borderTopWidth="1px"
                  borderColor="var(--chakra-colors-border-subtle)"
                  bg={i % 2 === 1 ? 'var(--chakra-colors-bg-subtle)' : 'transparent'}
                  _hover={{ bg: 'var(--chakra-colors-blue-50)' }}
                  transition="background-color 0.1s ease"
                  cursor="pointer"
                >
                  <Table.Cell py={3} px={4}>
                    <Link href={`/transcripts/${call.id}`} style={{ display: 'block' }}>
                      <Text fontSize="sm" color="var(--chakra-colors-fg-default)">{fmtDate(call.date)}</Text>
                      <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">{fmtTime(call.time)}</Text>
                    </Link>
                  </Table.Cell>
                  <Table.Cell py={3} px={4}>
                    <AgentName name={call.agentName} size="sm" />
                  </Table.Cell>
                  <Table.Cell py={3} px={4}>
                    <Link href={`/transcripts/${call.id}`} style={{ display: 'block' }}>
                      <Text fontSize="sm" color="var(--chakra-colors-fg-default)">{call.customerName}</Text>
                    </Link>
                  </Table.Cell>
                  <Table.Cell py={3} px={4}>
                    <Link href={`/transcripts/${call.id}`} style={{ display: 'block' }}>
                      <Text fontSize="sm" color="var(--chakra-colors-fg-default)">{call.accountName}</Text>
                      <Badge colorPalette="blue" variant="subtle" size="sm" rounded="sm" mt={0.5}>
                        {TIER_MAP[call.severity]}
                      </Badge>
                    </Link>
                  </Table.Cell>
                  <Table.Cell py={3} px={4}>
                    <Link href={`/transcripts/${call.id}`} style={{ display: 'block' }}>
                      <Badge
                        colorPalette={SEVERITY_PALETTE[call.severity] ?? 'gray'}
                        variant="subtle" size="sm" rounded="sm" textTransform="capitalize"
                      >
                        {call.severity}
                      </Badge>
                    </Link>
                  </Table.Cell>
                  <Table.Cell py={3} px={4}>
                    <Link href={`/transcripts/${call.id}`} style={{ display: 'block' }}>
                      <Badge
                        colorPalette={QA_PALETTE[call.qaStatus] ?? 'gray'}
                        variant="subtle" size="sm" rounded="sm"
                      >
                        {QA_LABEL[call.qaStatus] ?? call.qaStatus}
                      </Badge>
                    </Link>
                  </Table.Cell>
                  <Table.Cell py={3} px={4}>
                    <Link href={`/transcripts/${call.id}`} style={{ display: 'block' }}>
                      <Flex gap={1} flexWrap="wrap">
                        {call.flags.length > 0
                          ? call.flags.map(f => (
                            <Badge key={f}
                              colorPalette={FLAG_PALETTE[f] ?? 'gray'}
                              variant="subtle" size="sm" rounded="sm"
                            >
                              {FLAG_LABEL[f] ?? f}
                            </Badge>
                          ))
                          : <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">—</Text>
                        }
                      </Flex>
                    </Link>
                  </Table.Cell>
                  <Table.Cell py={3} px={4}>
                    <Link href={`/transcripts/${call.id}`} style={{ display: 'block' }}>
                      <Text fontSize="sm" color="var(--chakra-colors-fg-muted)">{call.duration}</Text>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>

      </Box>
    </Box>
  )
}
