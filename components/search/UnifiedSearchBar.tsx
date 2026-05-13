'use client'

import { useState, useRef, useEffect } from 'react'
import { Badge, Box, Flex, Input, Text } from '@chakra-ui/react'
import type { FilterState, SeverityLevel, CallFlag } from '@/lib/types'
import { AGENTS, ISSUE_CATEGORIES, REGIONS } from '@/lib/data/searchResults'

// ── Static config ──────────────────────────────────────────────────────────

const SEV_DOT: Record<SeverityLevel, string> = {
  critical: 'var(--chakra-colors-red-500)',
  high:     'var(--chakra-colors-orange-500)',
  medium:   'var(--chakra-colors-yellow-400)',
  low:      'var(--chakra-colors-gray-400)',
}
const SEV_LBL: Record<SeverityLevel, string> = {
  critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low',
}
const FLAG_LBL: Record<CallFlag, string> = {
  'escalation':           'Escalation',
  'churn-risk':           'Churn risk',
  'product-bug':          'Product bug',
  'policy-concern':       'Policy concern',
  'coaching-opportunity': 'Coaching',
}
const FLAG_ICON: Record<CallFlag, string> = {
  'escalation':           '↑',
  'churn-risk':           '⚠',
  'product-bug':          '⬡',
  'policy-concern':       '⚑',
  'coaching-opportunity': '✦',
}
const DATE_LBL: Record<string, string> = {
  '7d': 'Last 7 days', '30d': 'Last 30 days', '90d': 'Last 90 days', all: 'All time',
}
const DUR_LBL: Record<string, string> = {
  any: 'Any', short: '<5 min', medium: '5–15 min', long: '15+ min',
}
const DATE_OPTS = [
  { value: '7d' as const,  label: 'Last 7 days'  },
  { value: '30d' as const, label: 'Last 30 days' },
  { value: '90d' as const, label: 'Last 90 days' },
  { value: 'all' as const, label: 'All time'     },
]
const DUR_OPTS = [
  { value: 'any' as const,    label: 'Any'      },
  { value: 'short' as const,  label: '<5 min'   },
  { value: 'medium' as const, label: '5–15 min' },
  { value: 'long' as const,   label: '15+ min'  },
]
const SEV_LEVELS: SeverityLevel[] = ['critical', 'high', 'medium', 'low']
const FLAG_KEYS:  CallFlag[]      = [
  'escalation', 'churn-risk', 'product-bug', 'policy-concern', 'coaching-opportunity',
]

// Chip order for the "Add filter" menu
const ALL_FILTER_IDS = [
  'flaggedOnly', 'dateRange', 'severity', 'flags',
  'issueCategories', 'regions', 'agents', 'durationRange',
] as const
const FILTER_MENU_LABELS: Record<string, string> = {
  flaggedOnly:    'Flagged only',
  dateRange:      'Date range',
  severity:       'Severity',
  flags:          'Flags',
  issueCategories:'Issue category',
  regions:        'Region',
  agents:         'Agent',
  durationRange:  'Call duration',
}

// AI suggestion queries
const AI_SUGGESTIONS = [
  {
    text: 'customers leaving because of analytics gaps last quarter',
    apply: { dateRange: '90d' as const, issueCategories: ['Analytics / Reporting', 'Cancellation / Churn'], flags: ['churn-risk' as CallFlag] },
    aiKeys: ['dateRange', 'issueCategories', 'flags'],
  },
  {
    text: 'policy compliance violations flagged this month',
    apply: { dateRange: '30d' as const, issueCategories: ['Policy Compliance'], flags: ['policy-concern' as CallFlag], flaggedOnly: true },
    aiKeys: ['dateRange', 'issueCategories', 'flags', 'flaggedOnly'],
  },
  {
    text: 'critical escalations from eastern region',
    apply: { severity: ['critical' as SeverityLevel], flags: ['escalation' as CallFlag], regions: ['East'] },
    aiKeys: ['severity', 'flags', 'regions'],
  },
  {
    text: 'onboarding calls with churn risk',
    apply: { issueCategories: ['Onboarding', 'Cancellation / Churn'], flags: ['churn-risk' as CallFlag] },
    aiKeys: ['issueCategories', 'flags'],
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────

function toggle<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]
}

function formatAgent(name: string): string {
  const parts = name.split(' ')
  return parts.length > 1 ? `${parts[0]} ${parts[1][0]}.` : name
}

// Chip label builders
function severityLabel(sel: SeverityLevel[]): string {
  if (sel.length === 0) return 'Severity'
  if (sel.length > 2)   return `Severity: ${sel.length} selected`
  return sel.map(s => SEV_LBL[s]).join(', ')
}
function flagsLabel(sel: CallFlag[]): string {
  if (sel.length === 0) return 'Flags'
  if (sel.length > 2)   return `Flags: ${sel.length} selected`
  return sel.map(f => FLAG_LBL[f]).join(', ')
}
function issueCatLabel(sel: string[]): string {
  if (sel.length === 0) return 'Issue category'
  if (sel.length > 1)   return `${sel[0]} +${sel.length - 1}`
  return sel[0]
}
function regionsLabel(sel: string[]): string {
  if (sel.length === 0) return 'Region'
  if (sel.length > 2)   return `Region: ${sel.length} selected`
  return sel.join(', ')
}
function agentsLabel(sel: string[]): string {
  if (sel.length === 0) return 'Agent'
  if (sel.length > 1)   return `Agent: ${sel.length} selected`
  return formatAgent(sel[0])
}

// ── Primitive sub-components ───────────────────────────────────────────────

/** Segmented button group — single-select, closes popover on pick */
function Segmented<T extends string>({
  opts,
  value,
  onChange,
}: {
  opts: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <Flex gap={1.5} flexWrap="wrap">
      {opts.map(o => {
        const active = o.value === value
        return (
          <Box
            key={o.value}
            as="button"
            px={2.5}
            py="5px"
            rounded="sm"
            fontSize="xs"
            fontWeight={active ? 'medium' : 'normal'}
            border="1px solid"
            borderColor={active ? 'var(--chakra-colors-blue-400)' : 'var(--chakra-colors-border-subtle)'}
            bg={active ? 'var(--chakra-colors-blue-50)' : 'transparent'}
            color={active ? 'var(--chakra-colors-blue-700)' : 'var(--chakra-colors-fg-default)'}
            cursor="pointer"
            _hover={{ bg: active ? 'var(--chakra-colors-blue-100)' : 'var(--chakra-colors-bg-subtle)' }}
            transition="all 0.1s ease"
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </Box>
        )
      })}
    </Flex>
  )
}

/** Compact checkbox row with optional dot/icon */
function ChkRow({
  checked,
  onChange,
  label,
  dot,
  icon,
}: {
  checked: boolean
  onChange: () => void
  label: string
  dot?: string
  icon?: string
}) {
  return (
    <Flex
      as="label"
      align="center"
      gap={2}
      py="4px"
      cursor="pointer"
      _hover={{ color: 'var(--chakra-colors-fg-default)' }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{
          width: 13,
          height: 13,
          cursor: 'pointer',
          accentColor: 'var(--chakra-colors-blue-500)',
          flexShrink: 0,
        }}
      />
      {dot && (
        <Box
          w="8px" h="8px" rounded="full" flexShrink={0}
          style={{ background: dot }}
        />
      )}
      {icon && (
        <Text fontSize="11px" lineHeight={1} color="var(--chakra-colors-fg-muted)" flexShrink={0}>
          {icon}
        </Text>
      )}
      <Text fontSize="13px" color="var(--chakra-colors-fg-default)" lineHeight="none">
        {label}
      </Text>
    </Flex>
  )
}

/** Searchable checkbox list used for issue categories and agents */
function SearchableCheckList({
  items,
  selected,
  onToggle,
  placeholder,
}: {
  items: string[]
  selected: string[]
  onToggle: (v: string) => void
  placeholder: string
}) {
  const [q, setQ] = useState('')
  const filtered = q.trim()
    ? items.filter(i => i.toLowerCase().includes(q.toLowerCase()))
    : items
  return (
    <>
      <Input
        placeholder={placeholder}
        size="xs"
        mb={2}
        value={q}
        onChange={e => setQ(e.target.value)}
        fontSize="xs"
        borderColor="var(--chakra-colors-border-subtle)"
        _placeholder={{ color: 'var(--chakra-colors-fg-muted)' }}
      />
      <Box maxH="220px" overflowY="auto">
        {filtered.map(item => (
          <ChkRow
            key={item}
            checked={selected.includes(item)}
            onChange={() => onToggle(item)}
            label={item}
          />
        ))}
        {filtered.length === 0 && (
          <Text fontSize="xs" color="var(--chakra-colors-fg-muted)" py={2}>No results</Text>
        )}
      </Box>
    </>
  )
}

// ── Popover shell ──────────────────────────────────────────────────────────

function PopoverShell({ children }: { children: React.ReactNode }) {
  return (
    <Box
      position="absolute"
      top="calc(100% + 6px)"
      left={0}
      zIndex={300}
      minW="200px"
      bg="var(--chakra-colors-bg-panel)"
      borderWidth="1px"
      borderColor="var(--chakra-colors-border-subtle)"
      rounded="sm"
      shadow="0 4px 16px rgba(0,0,0,0.08)"
      p={3}
    >
      {children}
    </Box>
  )
}

// ── Single chip ────────────────────────────────────────────────────────────

function Chip({
  label,
  isActive = false,
  isAI = false,
  onClear,
  onClick,
  delay = 0,
  alwaysVisible = false,
}: {
  label: string
  isActive?: boolean
  isAI?: boolean
  onClear?: () => void
  onClick?: () => void
  delay?: number
  alwaysVisible?: boolean
}) {
  return (
    <Flex
      as="button"
      align="center"
      gap="5px"
      pl={2.5}
      pr={isAI || onClear ? 1.5 : 2.5}
      py={1}
      rounded="full"
      border="1px solid"
      borderColor={isActive ? 'var(--chakra-colors-blue-400)' : 'var(--chakra-colors-border-subtle)'}
      bg={isActive ? 'var(--chakra-colors-blue-50)' : 'var(--chakra-colors-bg-panel)'}
      color={isActive ? 'var(--chakra-colors-blue-700)' : 'var(--chakra-colors-fg-default)'}
      fontSize="xs"
      cursor="pointer"
      userSelect="none"
      flexShrink={0}
      _hover={{
        borderColor: 'var(--chakra-colors-blue-300)',
        bg: isActive ? 'var(--chakra-colors-blue-100)' : 'var(--chakra-colors-blue-50)',
      }}
      transition="border-color 0.12s ease, background-color 0.12s ease"
      style={{
        animation: alwaysVisible ? undefined : `fadeInChip 0.15s ease both`,
        animationDelay: alwaysVisible ? undefined : `${delay}ms`,
      }}
      onClick={onClick}
    >
      {isAI && (
        <Text as="span" fontSize="9px" color="var(--chakra-colors-blue-500)" lineHeight={1}>
          ✦
        </Text>
      )}
      <Text as="span" fontSize="12px" lineHeight="none">
        {label}
      </Text>
      {onClear && (
        <Box
          as="span"
          px="3px"
          rounded="full"
          color="var(--chakra-colors-fg-muted)"
          fontSize="11px"
          lineHeight={1}
          _hover={{ color: 'var(--chakra-colors-fg-default)', bg: 'var(--chakra-colors-bg-subtle)' }}
          onClick={(e: React.MouseEvent) => { e.stopPropagation(); onClear() }}
        >
          ✕
        </Box>
      )}
    </Flex>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

interface UnifiedSearchBarProps {
  query: string
  filters: FilterState
  onChange: (f: FilterState) => void
  onSearch: (q: string) => void
  alwaysExpanded?: boolean
}

export function UnifiedSearchBar({
  query,
  filters,
  onChange,
  onSearch,
  alwaysExpanded = false,
}: UnifiedSearchBarProps) {
  const [inputValue, setInputValue]     = useState(query)
  const [isProcessing, setIsProcessing] = useState(false)
  const [rowOpen, setRowOpen]           = useState(alwaysExpanded || !!query)
  const [openPopover, setOpenPopover]   = useState<string | null>(null)
  const [aiApplied, setAiApplied]       = useState<Set<string>>(new Set())
  const [tempVisible, setTempVisible]   = useState<string | null>(null) // chip forced open via "Add filter"
  const containerRef = useRef<HTMLDivElement>(null)

  // Sync input if query changes from outside
  useEffect(() => { setInputValue(query) }, [query])

  // Sync row open state when alwaysExpanded is true
  useEffect(() => { if (alwaysExpanded) setRowOpen(true) }, [alwaysExpanded])

  // Outside-click closes any open popover
  useEffect(() => {
    if (!openPopover) return
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closePopover()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [openPopover]) // eslint-disable-line react-hooks/exhaustive-deps

  function closePopover() {
    // If the temp-visible chip still has default value, clear it
    if (tempVisible) {
      const f = filters
      const isDefault =
        (tempVisible === 'dateRange'      && f.dateRange === 'all') ||
        (tempVisible === 'durationRange'  && f.durationRange === 'any') ||
        (tempVisible === 'severity'       && f.severity.length === 0) ||
        (tempVisible === 'flags'          && f.flags.length === 0) ||
        (tempVisible === 'issueCategories'&& f.issueCategories.length === 0) ||
        (tempVisible === 'regions'        && f.regions.length === 0) ||
        (tempVisible === 'agents'         && f.agents.length === 0)
      if (isDefault) setTempVisible(null)
    }
    setOpenPopover(null)
  }

  function togglePopover(id: string) {
    setOpenPopover(p => p === id ? null : id)
  }

  function markManualEdit(key: string) {
    setAiApplied(s => { const next = new Set(s); next.delete(key); return next })
  }

  // Submit a search query (with optional AI filter override)
  function handleSubmit(q: string, aiFilters?: Partial<FilterState>, aiKeys?: string[]) {
    if (!q.trim()) return
    setRowOpen(true)
    setIsProcessing(true)
    onSearch(q)
    if (aiFilters) {
      setAiApplied(new Set(aiKeys ?? []))
      setTimeout(() => {
        onChange({ ...filters, ...aiFilters })
        setIsProcessing(false)
      }, 700)
    } else {
      setTimeout(() => setIsProcessing(false), 700)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSubmit(inputValue)
  }

  function clearFilter(key: keyof FilterState) {
    markManualEdit(key)
    if (key === 'flaggedOnly')    onChange({ ...filters, flaggedOnly: false })
    else if (key === 'dateRange') onChange({ ...filters, dateRange: 'all' })
    else if (key === 'durationRange') onChange({ ...filters, durationRange: 'any' })
    else onChange({ ...filters, [key]: [] })
  }

  // ── Determine which chips to show ────────────────────────────────────────
  const showFlagged   = filters.flaggedOnly
  const showDate      = filters.dateRange !== 'all'      || tempVisible === 'dateRange'
  const showSeverity  = filters.severity.length > 0      || tempVisible === 'severity'
  const showFlags     = filters.flags.length > 0         || tempVisible === 'flags'
  const showIssues    = filters.issueCategories.length > 0 || tempVisible === 'issueCategories'
  const showRegions   = filters.regions.length > 0       || tempVisible === 'regions'
  const showAgents    = filters.agents.length > 0        || tempVisible === 'agents'
  const showDuration  = filters.durationRange !== 'any'  || tempVisible === 'durationRange'

  // Stagger index: counts chips that will be rendered, left to right
  let chipIdx = 0
  const nextDelay = () => (chipIdx++) * 60

  // Remaining filters for "Add filter +" menu
  const inactiveFilters = ALL_FILTER_IDS.filter(id => {
    if (id === 'flaggedOnly')     return !showFlagged
    if (id === 'dateRange')       return !showDate
    if (id === 'severity')        return !showSeverity
    if (id === 'flags')           return !showFlags
    if (id === 'issueCategories') return !showIssues
    if (id === 'regions')         return !showRegions
    if (id === 'agents')          return !showAgents
    if (id === 'durationRange')   return !showDuration
    return false
  })

  const anyChipVisible = showFlagged || showDate || showSeverity || showFlags ||
    showIssues || showRegions || showAgents || showDuration
  const showEmptySuggestions = !isProcessing && !anyChipVisible

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Box
      ref={containerRef as React.RefObject<HTMLDivElement>}
      bg="var(--chakra-colors-bg-panel)"
      borderWidth="1px"
      borderColor="var(--chakra-colors-border-subtle)"
      rounded="sm"
    >
      {/* ── Row 1: Search input ───────────────────────────────────────── */}
      <Flex align="center" gap={3} px={4} minH="48px">
        {/* Search icon */}
        <Box color="var(--chakra-colors-fg-muted)" flexShrink={0}>
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </Box>

        <Input
          placeholder="Search calls by concept, keyword, or question..."
          border="none"
          outline="none"
          _focusVisible={{ boxShadow: 'none' }}
          fontSize="sm"
          color="var(--chakra-colors-fg-default)"
          _placeholder={{ color: 'var(--chakra-colors-fg-muted)' }}
          flex={1}
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {/* Semantic badge */}
        <Badge
          flexShrink={0}
          colorPalette="blue"
          variant="subtle"
          size="sm"
          rounded="sm"
          fontSize="10px"
          letterSpacing="0.02em"
        >
          Semantic
        </Badge>
      </Flex>

      {/* ── Divider — only when chip row is open ─────────────────────── */}
      {rowOpen && (
        <Box h="0.5px" bg="var(--chakra-colors-border-subtle)" opacity={0.6} />
      )}

      {/* ── Row 2: Chips / shimmer / suggestions ─────────────────────── */}
      <Box
        style={{
          maxHeight: rowOpen ? '200px' : '0px',
          overflow: 'hidden',
          transition: 'max-height 0.25s cubic-bezier(0.215, 0.61, 0.355, 1)',
        }}
      >
        {/* Shimmer state */}
        {isProcessing && (
          <Box position="relative" overflow="hidden" px={4} py={3}>
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              style={{
                background: 'linear-gradient(90deg, transparent 0%, var(--chakra-colors-blue-50) 40%, transparent 100%)',
                animation: 'shimmerSlide 1.2s ease-in-out infinite',
              }}
            />
            <Text fontSize="12px" color="var(--chakra-colors-fg-muted)" fontStyle="italic">
              Applying filters…
            </Text>
          </Box>
        )}

        {/* Suggestion pills — empty state */}
        {!isProcessing && showEmptySuggestions && (
          <Flex gap={2} px={4} py={3} flexWrap="wrap" align="center">
            <Text fontSize="11px" color="var(--chakra-colors-fg-muted)" flexShrink={0} mr={1}>
              Try:
            </Text>
            {AI_SUGGESTIONS.map(s => (
              <Box
                key={s.text}
                as="button"
                px={2.5}
                py="5px"
                rounded="full"
                border="1px solid"
                borderColor="var(--chakra-colors-border-subtle)"
                bg="var(--chakra-colors-bg-subtle)"
                fontSize="11px"
                color="var(--chakra-colors-fg-muted)"
                cursor="pointer"
                _hover={{ borderColor: 'var(--chakra-colors-blue-300)', color: 'var(--chakra-colors-blue-600)', bg: 'var(--chakra-colors-blue-50)' }}
                transition="all 0.12s ease"
                textAlign="left"
                onClick={() => {
                  setInputValue(s.text)
                  handleSubmit(s.text, s.apply as Partial<FilterState>, s.aiKeys)
                }}
              >
                {s.text.length > 48 ? s.text.slice(0, 48) + '…' : s.text}
              </Box>
            ))}
          </Flex>
        )}

        {/* Active filter chips */}
        {!isProcessing && !showEmptySuggestions && (
          <Flex gap={2} px={4} py={3} flexWrap="wrap" align="center">

            {/* Flagged only — toggle, no popover */}
            {showFlagged && (
              <Chip
                label="Flagged only"
                isActive
                isAI={aiApplied.has('flaggedOnly')}
                onClear={() => clearFilter('flaggedOnly')}
                delay={nextDelay()}
                onClick={() => {
                  markManualEdit('flaggedOnly')
                  onChange({ ...filters, flaggedOnly: false })
                }}
              />
            )}

            {/* Date range chip + popover */}
            {showDate && (
              <Box position="relative" display="inline-block">
                <Chip
                  label={DATE_LBL[filters.dateRange]}
                  isActive={openPopover === 'dateRange'}
                  isAI={aiApplied.has('dateRange')}
                  onClear={() => clearFilter('dateRange')}
                  delay={nextDelay()}
                  onClick={() => togglePopover('dateRange')}
                />
                {openPopover === 'dateRange' && (
                  <PopoverShell>
                    <Text fontSize="11px" fontWeight="semibold" color="var(--chakra-colors-fg-muted)" textTransform="uppercase" letterSpacing="wider" mb={2}>
                      Date range
                    </Text>
                    <Segmented
                      opts={DATE_OPTS}
                      value={filters.dateRange}
                      onChange={v => {
                        markManualEdit('dateRange')
                        onChange({ ...filters, dateRange: v })
                        closePopover()
                      }}
                    />
                  </PopoverShell>
                )}
              </Box>
            )}

            {/* Severity chip + popover */}
            {showSeverity && (
              <Box position="relative" display="inline-block">
                <Chip
                  label={severityLabel(filters.severity)}
                  isActive={openPopover === 'severity'}
                  isAI={aiApplied.has('severity')}
                  onClear={() => clearFilter('severity')}
                  delay={nextDelay()}
                  onClick={() => togglePopover('severity')}
                />
                {openPopover === 'severity' && (
                  <PopoverShell>
                    <Text fontSize="11px" fontWeight="semibold" color="var(--chakra-colors-fg-muted)" textTransform="uppercase" letterSpacing="wider" mb={1.5}>
                      Severity
                    </Text>
                    {SEV_LEVELS.map(s => (
                      <ChkRow
                        key={s}
                        checked={filters.severity.includes(s)}
                        onChange={() => {
                          markManualEdit('severity')
                          onChange({ ...filters, severity: toggle(filters.severity, s) })
                        }}
                        label={SEV_LBL[s]}
                        dot={SEV_DOT[s]}
                      />
                    ))}
                  </PopoverShell>
                )}
              </Box>
            )}

            {/* Flags chip + popover */}
            {showFlags && (
              <Box position="relative" display="inline-block">
                <Chip
                  label={flagsLabel(filters.flags)}
                  isActive={openPopover === 'flags'}
                  isAI={aiApplied.has('flags')}
                  onClear={() => clearFilter('flags')}
                  delay={nextDelay()}
                  onClick={() => togglePopover('flags')}
                />
                {openPopover === 'flags' && (
                  <PopoverShell>
                    <Text fontSize="11px" fontWeight="semibold" color="var(--chakra-colors-fg-muted)" textTransform="uppercase" letterSpacing="wider" mb={1.5}>
                      Flags
                    </Text>
                    {FLAG_KEYS.map(f => (
                      <ChkRow
                        key={f}
                        checked={filters.flags.includes(f)}
                        onChange={() => {
                          markManualEdit('flags')
                          onChange({ ...filters, flags: toggle(filters.flags, f) })
                        }}
                        label={FLAG_LBL[f]}
                        icon={FLAG_ICON[f]}
                      />
                    ))}
                  </PopoverShell>
                )}
              </Box>
            )}

            {/* Issue category chip + popover */}
            {showIssues && (
              <Box position="relative" display="inline-block">
                <Chip
                  label={issueCatLabel(filters.issueCategories)}
                  isActive={openPopover === 'issueCategories'}
                  isAI={aiApplied.has('issueCategories')}
                  onClear={() => clearFilter('issueCategories')}
                  delay={nextDelay()}
                  onClick={() => togglePopover('issueCategories')}
                />
                {openPopover === 'issueCategories' && (
                  <PopoverShell>
                    <Text fontSize="11px" fontWeight="semibold" color="var(--chakra-colors-fg-muted)" textTransform="uppercase" letterSpacing="wider" mb={2}>
                      Issue category
                    </Text>
                    <SearchableCheckList
                      items={ISSUE_CATEGORIES}
                      selected={filters.issueCategories}
                      onToggle={v => {
                        markManualEdit('issueCategories')
                        onChange({ ...filters, issueCategories: toggle(filters.issueCategories, v) })
                      }}
                      placeholder="Search categories…"
                    />
                  </PopoverShell>
                )}
              </Box>
            )}

            {/* Region chip + popover */}
            {showRegions && (
              <Box position="relative" display="inline-block">
                <Chip
                  label={regionsLabel(filters.regions)}
                  isActive={openPopover === 'regions'}
                  isAI={aiApplied.has('regions')}
                  onClear={() => clearFilter('regions')}
                  delay={nextDelay()}
                  onClick={() => togglePopover('regions')}
                />
                {openPopover === 'regions' && (
                  <PopoverShell>
                    <Text fontSize="11px" fontWeight="semibold" color="var(--chakra-colors-fg-muted)" textTransform="uppercase" letterSpacing="wider" mb={1.5}>
                      Region
                    </Text>
                    {REGIONS.map(r => (
                      <ChkRow
                        key={r}
                        checked={filters.regions.includes(r)}
                        onChange={() => {
                          markManualEdit('regions')
                          onChange({ ...filters, regions: toggle(filters.regions, r) })
                        }}
                        label={r}
                      />
                    ))}
                  </PopoverShell>
                )}
              </Box>
            )}

            {/* Agent chip + popover */}
            {showAgents && (
              <Box position="relative" display="inline-block">
                <Chip
                  label={agentsLabel(filters.agents)}
                  isActive={openPopover === 'agents'}
                  isAI={aiApplied.has('agents')}
                  onClear={() => clearFilter('agents')}
                  delay={nextDelay()}
                  onClick={() => togglePopover('agents')}
                />
                {openPopover === 'agents' && (
                  <PopoverShell>
                    <Text fontSize="11px" fontWeight="semibold" color="var(--chakra-colors-fg-muted)" textTransform="uppercase" letterSpacing="wider" mb={2}>
                      Agent
                    </Text>
                    <SearchableCheckList
                      items={AGENTS}
                      selected={filters.agents}
                      onToggle={v => {
                        markManualEdit('agents')
                        onChange({ ...filters, agents: toggle(filters.agents, v) })
                      }}
                      placeholder="Search agents…"
                    />
                  </PopoverShell>
                )}
              </Box>
            )}

            {/* Duration chip + popover */}
            {showDuration && (
              <Box position="relative" display="inline-block">
                <Chip
                  label={DUR_LBL[filters.durationRange]}
                  isActive={openPopover === 'durationRange'}
                  isAI={aiApplied.has('durationRange')}
                  onClear={() => clearFilter('durationRange')}
                  delay={nextDelay()}
                  onClick={() => togglePopover('durationRange')}
                />
                {openPopover === 'durationRange' && (
                  <PopoverShell>
                    <Text fontSize="11px" fontWeight="semibold" color="var(--chakra-colors-fg-muted)" textTransform="uppercase" letterSpacing="wider" mb={2}>
                      Call duration
                    </Text>
                    <Segmented
                      opts={DUR_OPTS}
                      value={filters.durationRange}
                      onChange={v => {
                        markManualEdit('durationRange')
                        onChange({ ...filters, durationRange: v })
                        closePopover()
                      }}
                    />
                  </PopoverShell>
                )}
              </Box>
            )}

            {/* Add filter + */}
            {inactiveFilters.length > 0 && (
              <Box position="relative" display="inline-block">
                <Chip
                  label="Add filter +"
                  isActive={openPopover === '__add__'}
                  delay={0}
                  alwaysVisible
                  onClick={() => togglePopover('__add__')}
                />
                {openPopover === '__add__' && (
                  <PopoverShell>
                    <Text fontSize="11px" fontWeight="semibold" color="var(--chakra-colors-fg-muted)" textTransform="uppercase" letterSpacing="wider" mb={1.5}>
                      Add filter
                    </Text>
                    {inactiveFilters.map(id => (
                      <Box
                        key={id}
                        as="button"
                        display="block"
                        w="full"
                        textAlign="left"
                        px={2}
                        py="5px"
                        rounded="sm"
                        fontSize="13px"
                        color="var(--chakra-colors-fg-default)"
                        _hover={{ bg: 'var(--chakra-colors-blue-50)', color: 'var(--chakra-colors-blue-700)' }}
                        transition="all 0.1s ease"
                        cursor="pointer"
                        onClick={() => {
                          setTempVisible(id)
                          setOpenPopover(id)
                        }}
                      >
                        {FILTER_MENU_LABELS[id]}
                      </Box>
                    ))}
                  </PopoverShell>
                )}
              </Box>
            )}
          </Flex>
        )}
      </Box>
    </Box>
  )
}
