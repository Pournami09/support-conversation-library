'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { Badge, Box, Flex, Table, Text } from '@chakra-ui/react'
import Link from 'next/link'
import type { Transcript } from '@/lib/types'

// ── Helpers ───────────────────────────────────────────────────────────────

function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr))
}

function isWithinDays(dateStr: string, days: number): boolean {
  const d = new Date(dateStr)
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  return d >= cutoff
}

// ── Ticker ────────────────────────────────────────────────────────────────
// Fades between suggestion strings inside the search bar when it's empty.

function Ticker({ show, suggestions }: { show: boolean; suggestions: string[] }) {
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      const timeout = setTimeout(() => {
        setIdx(i => (i + 1) % suggestions.length)
        setVisible(true)
      }, 280)
      return () => clearTimeout(timeout)
    }, 3200)
    return () => clearInterval(interval)
  }, [suggestions.length])

  if (!show) return null

  return (
    <span
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: '36px',
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: '13px',
        color: '#94a3b8',
        pointerEvents: 'none',
        userSelect: 'none',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.28s ease',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        maxWidth: 'calc(100% - 48px)',
      }}
    >
      {suggestions[idx]}
    </span>
  )
}

// ── Multi-select dropdown ─────────────────────────────────────────────────

interface MultiSelectProps {
  label: string
  options: string[]
  selected: string[]
  onToggle: (v: string) => void
  onClear: () => void
  onSelectAll: () => void
}

function MultiSelect({ label, options, selected, onToggle, onClear, onSelectAll }: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const isActive = selected.length > 0
  const allSelected = selected.length === options.length && options.length > 0
  const btnLabel = selected.length === 0
    ? label
    : selected.length === 1
    ? `${label}: ${selected[0].split(' ')[0]}`
    : `${label}: ${selected.length}`

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '5px 10px',
          fontSize: '13px',
          fontWeight: isActive ? '500' : '400',
          border: `1px solid ${isActive ? 'var(--chakra-colors-blue-300)' : 'var(--chakra-colors-border-subtle)'}`,
          borderRadius: '6px',
          background: isActive ? 'var(--chakra-colors-blue-50)' : 'var(--chakra-colors-bg-panel)',
          color: isActive ? 'var(--chakra-colors-blue-700)' : 'var(--chakra-colors-fg-default)',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          transition: 'border-color 0.15s, background 0.15s',
        }}
      >
        {btnLabel}
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            zIndex: 200,
            background: 'var(--chakra-colors-bg-panel)',
            border: '1px solid var(--chakra-colors-border-subtle)',
            borderRadius: '8px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.10)',
            minWidth: '192px',
            maxHeight: '260px',
            overflowY: 'auto',
            padding: '4px',
          }}
        >
          <button
            onClick={() => { allSelected ? onClear() : onSelectAll() }}
            style={{
              width: '100%',
              padding: '7px 10px',
              fontSize: '12px',
              color: 'var(--chakra-colors-blue-600)',
              background: 'none',
              border: 'none',
              borderBottom: '1px solid var(--chakra-colors-border-subtle)',
              cursor: 'pointer',
              textAlign: 'left',
              marginBottom: '4px',
              fontWeight: '500',
            }}
          >
            {allSelected ? 'Clear selection' : 'Select all'}
          </button>
          {options.map(opt => {
            const checked = selected.includes(opt)
            return (
              <label
                key={opt}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: 'var(--chakra-colors-fg-default)',
                  cursor: 'pointer',
                  background: checked ? 'var(--chakra-colors-blue-50)' : 'transparent',
                  transition: 'background 0.1s',
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(opt)}
                  style={{ width: '14px', height: '14px', accentColor: '#3b82f6', flexShrink: 0, cursor: 'pointer' }}
                />
                {opt}
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Time-range dropdown ───────────────────────────────────────────────────

const TIME_OPTIONS = [
  { label: 'Last 7 days',  days: 7   },
  { label: 'Last 30 days', days: 30  },
  { label: 'Last 90 days', days: 90  },
  { label: 'All time',     days: 0   },
]

function TimeSelect({ value, onChange }: { value: number; onChange: (d: number) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const current = TIME_OPTIONS.find(o => o.days === value) ?? TIME_OPTIONS[1]

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '7px 10px',
          fontSize: '13px',
          fontWeight: '400',
          border: '1px solid var(--chakra-colors-border-subtle)',
          borderRadius: '6px',
          background: 'var(--chakra-colors-bg-panel)',
          color: 'var(--chakra-colors-fg-default)',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        {current.label}
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            right: 0,
            zIndex: 200,
            background: 'var(--chakra-colors-bg-panel)',
            border: '1px solid var(--chakra-colors-border-subtle)',
            borderRadius: '8px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.10)',
            minWidth: '148px',
            padding: '4px',
          }}
        >
          {TIME_OPTIONS.map(opt => (
            <button
              key={opt.days}
              onClick={() => { onChange(opt.days); setOpen(false) }}
              style={{
                display: 'block',
                width: '100%',
                padding: '7px 10px',
                textAlign: 'left',
                fontSize: '13px',
                fontWeight: opt.days === value ? '500' : '400',
                background: opt.days === value ? 'var(--chakra-colors-blue-50)' : 'transparent',
                color: opt.days === value ? 'var(--chakra-colors-blue-700)' : 'var(--chakra-colors-fg-default)',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Filter chip ───────────────────────────────────────────────────────────

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '3px 8px 3px 10px',
        background: 'var(--chakra-colors-blue-50)',
        border: '1px solid var(--chakra-colors-blue-200)',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '500',
        color: 'var(--chakra-colors-blue-700)',
        lineHeight: '1.5',
      }}
    >
      {label}
      <button
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '1px',
          color: 'var(--chakra-colors-blue-400)',
          borderRadius: '50%',
          lineHeight: '1',
        }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </span>
  )
}

// ── Main component ────────────────────────────────────────────────────────

export function TranscriptsList({ transcripts }: { transcripts: Transcript[] }) {
  const [search,           setSearch]           = useState('')
  const [timeDays,         setTimeDays]         = useState(30)
  const [selectedAgents,   setSelectedAgents]   = useState<string[]>([])
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
  const [selectedRegions,  setSelectedRegions]  = useState<string[]>([])
  const [selectedTags,     setSelectedTags]     = useState<string[]>([])

  // Derive unique filter options from data
  const uniqueAgents   = useMemo(() => unique(transcripts.map(t => t.agentName)).sort(), [transcripts])
  const uniqueAccounts = useMemo(() => unique(transcripts.map(t => t.accountName)).sort(), [transcripts])
  const uniqueRegions  = useMemo(() => unique(transcripts.map(t => t.region)).sort(), [transcripts])
  const uniqueTags     = useMemo(() => unique(transcripts.flatMap(t => t.tags)).sort(), [transcripts])

  // Ticker suggestions derived from real data
  const tickerSuggestions = useMemo(() => [
    `Try: agent ${uniqueAgents[0] ?? 'Sarah Mitchell'}`,
    `Try: ${uniqueAccounts[0] ?? 'Acme Corp'} calls`,
    `Try: billing disputes`,
    `Try: ${uniqueRegions[0] ?? 'North'} region`,
    `Try: ${uniqueAgents[2] ?? 'Emily Chen'} escalations`,
    `Try: technical SSO issues`,
  ], [uniqueAgents, uniqueAccounts, uniqueRegions])

  // Smart search: auto-apply matching metadata filters
  useEffect(() => {
    if (!search.trim()) return
    const q = search.toLowerCase()

    const agents = uniqueAgents.filter(a =>
      a.toLowerCase().split(' ').some(part => part.length >= 3 && q.includes(part))
    )
    const accounts = uniqueAccounts.filter(a =>
      a.toLowerCase().split(' ').some(part => part.length >= 4 && q.includes(part))
    )
    const regions = uniqueRegions.filter(r => q.includes(r.toLowerCase()))
    const tags    = uniqueTags.filter(t => q.includes(t.toLowerCase()))

    if (agents.length)   setSelectedAgents(agents)
    if (accounts.length) setSelectedAccounts(accounts)
    if (regions.length)  setSelectedRegions(regions)
    if (tags.length)     setSelectedTags(tags)
  }, [search, uniqueAgents, uniqueAccounts, uniqueRegions, uniqueTags])

  // Filter logic
  const filtered = useMemo(() => {
    return transcripts.filter(t => {
      if (timeDays > 0 && !isWithinDays(t.date, timeDays)) return false
      if (selectedAgents.length   > 0 && !selectedAgents.includes(t.agentName))                      return false
      if (selectedAccounts.length > 0 && !selectedAccounts.includes(t.accountName))                  return false
      if (selectedRegions.length  > 0 && !selectedRegions.includes(t.region))                        return false
      if (selectedTags.length     > 0 && !selectedTags.some(tag => t.tags.includes(tag)))            return false

      // Free-text: only when no metadata filter auto-matched the query
      if (search.trim()) {
        const anyFilterActive = selectedAgents.length > 0 || selectedAccounts.length > 0 ||
          selectedRegions.length > 0 || selectedTags.length > 0
        if (!anyFilterActive) {
          const q = search.toLowerCase()
          const matchesText = [t.agentName, t.customerName, t.accountName, t.region, ...t.tags]
            .some(s => s.toLowerCase().includes(q))
          if (!matchesText) return false
        }
      }

      return true
    })
  }, [transcripts, timeDays, selectedAgents, selectedAccounts, selectedRegions, selectedTags, search])

  type FilterGroup = { label: string; values: string[]; onRemove: (v: string) => void; onClearGroup: () => void }
  const filterGroups: FilterGroup[] = [
    { label: 'Agent',   values: selectedAgents,   onRemove: (v: string) => setSelectedAgents(p => p.filter(x => x !== v)),   onClearGroup: () => setSelectedAgents([]) },
    { label: 'Account', values: selectedAccounts, onRemove: (v: string) => setSelectedAccounts(p => p.filter(x => x !== v)), onClearGroup: () => setSelectedAccounts([]) },
    { label: 'Region',  values: selectedRegions,  onRemove: (v: string) => setSelectedRegions(p => p.filter(x => x !== v)),  onClearGroup: () => setSelectedRegions([]) },
    { label: 'Tags',    values: selectedTags,     onRemove: (v: string) => setSelectedTags(p => p.filter(x => x !== v)),     onClearGroup: () => setSelectedTags([]) },
  ].filter(g => g.values.length > 0)

  const hasActiveFilters = filterGroups.length > 0

  function clearAll() {
    setSearch('')
    setSelectedAgents([])
    setSelectedAccounts([])
    setSelectedRegions([])
    setSelectedTags([])
    setTimeDays(30)
  }

  return (
    <Box>
      {/* ── Search row ─────────────────────────────────────────────── */}
      <Flex gap={2} mb={3} align="center">
        <Box position="relative" flex={1}>
          {/* Search icon */}
          <Box
            position="absolute" left="10px" top="50%"
            style={{ transform: 'translateY(-50%)' }}
            color="var(--chakra-colors-fg-muted)"
            pointerEvents="none"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </Box>

          {/* Animated ticker placeholder */}
          <Ticker show={!search} suggestions={tickerSuggestions} />

          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '7px 12px 7px 32px',
              fontSize: '13px',
              border: '1px solid var(--chakra-colors-border-subtle)',
              borderRadius: '6px',
              background: 'var(--chakra-colors-bg-panel)',
              color: 'var(--chakra-colors-fg-default)',
              outline: 'none',
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = '#93c5fd'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)'
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = 'var(--chakra-colors-border-subtle)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
        </Box>

        <TimeSelect value={timeDays} onChange={setTimeDays} />
      </Flex>

      {/* ── Filter bar — always visible ─────────────────────────────── */}
      <Flex gap={2} mb={filterGroups.length > 0 ? 2 : 3} align="center" flexWrap="wrap">
        <MultiSelect
          label="Agent" options={uniqueAgents} selected={selectedAgents}
          onToggle={v => setSelectedAgents(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v])}
          onClear={() => setSelectedAgents([])}
          onSelectAll={() => setSelectedAgents(uniqueAgents)}
        />
        <MultiSelect
          label="Account" options={uniqueAccounts} selected={selectedAccounts}
          onToggle={v => setSelectedAccounts(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v])}
          onClear={() => setSelectedAccounts([])}
          onSelectAll={() => setSelectedAccounts(uniqueAccounts)}
        />
        <MultiSelect
          label="Region" options={uniqueRegions} selected={selectedRegions}
          onToggle={v => setSelectedRegions(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v])}
          onClear={() => setSelectedRegions([])}
          onSelectAll={() => setSelectedRegions(uniqueRegions)}
        />
        <MultiSelect
          label="Tags" options={uniqueTags} selected={selectedTags}
          onToggle={v => setSelectedTags(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v])}
          onClear={() => setSelectedTags([])}
          onSelectAll={() => setSelectedTags(uniqueTags)}
        />

        {hasActiveFilters && (
          <button
            onClick={clearAll}
            style={{
              marginLeft: 'auto',
              fontSize: '12px',
              color: 'var(--chakra-colors-fg-muted)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 6px',
              borderRadius: '4px',
            }}
          >
            Clear all
          </button>
        )}
      </Flex>

      {/* ── Active filter chips — grouped by category ───────────────── */}
      {filterGroups.length > 0 && (
        <Flex gap={3} mb={3} flexWrap="wrap" align="flex-start">
          {filterGroups.map(group => (
            <Flex key={group.label} align="center" gap={1.5} flexWrap="wrap">
              <Text
                fontSize="11px"
                fontWeight="600"
                color="var(--chakra-colors-fg-muted)"
                textTransform="uppercase"
                letterSpacing="0.06em"
                flexShrink={0}
                style={{ lineHeight: '1.8' }}
              >
                {group.label}
              </Text>
              {group.values.map(v => (
                <Chip key={v} label={v} onRemove={() => group.onRemove(v)} />
              ))}
              {group.values.length > 1 && (
                <button
                  onClick={group.onClearGroup}
                  title={`Clear all ${group.label} filters`}
                  style={{
                    fontSize: '11px',
                    color: 'var(--chakra-colors-fg-subtle)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    lineHeight: '1.8',
                  }}
                >
                  Clear
                </button>
              )}
            </Flex>
          ))}
        </Flex>
      )}

      {/* ── Result count ────────────────────────────────────────────── */}
      <Flex align="center" mb={2}>
        <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">
          {filtered.length} call{filtered.length !== 1 ? 's' : ''}
          {filtered.length < transcripts.length ? ` of ${transcripts.length}` : ''}
        </Text>
      </Flex>

      {/* ── Table ───────────────────────────────────────────────────── */}
      <Box
        bg="var(--chakra-colors-bg-panel)"
        borderWidth="1px"
        borderColor="var(--chakra-colors-border-subtle)"
        rounded="sm"
        overflow="hidden"
      >
        {filtered.length === 0 ? (
          <Box py={12} textAlign="center">
            <Text fontSize="sm" color="var(--chakra-colors-fg-muted)" mb={1}>
              No calls match the current filters.
            </Text>
            <Text
              as="button"
              fontSize="xs"
              color="var(--chakra-colors-blue-600)"
              cursor="pointer"
              onClick={clearAll}
              style={{ background: 'none', border: 'none' }}
            >
              Clear filters
            </Text>
          </Box>
        ) : (
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row bg="var(--chakra-colors-bg-subtle)">
                {['Date', 'Time', 'Agent', 'Customer', 'Account', 'Region', 'Duration', 'Tags'].map(col => (
                  <Table.ColumnHeader
                    key={col} py={3} px={4}
                    color="var(--chakra-colors-fg-muted)"
                    fontWeight="semibold"
                    fontSize="xs"
                    letterSpacing="wider"
                    textTransform="uppercase"
                  >
                    {col}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filtered.map(t => (
                <Table.Row
                  key={t.id}
                  borderTopWidth="1px"
                  borderColor="var(--chakra-colors-border-subtle)"
                  _hover={{ bg: 'var(--chakra-colors-blue-50)' }}
                  transition="background-color 0.1s ease"
                  cursor="pointer"
                >
                  <Table.Cell py={3} px={4}>
                    <Link href={`/transcripts/${t.id}`} style={{ display: 'block' }}>
                      <Text fontSize="sm" color="var(--chakra-colors-fg-default)">{t.date}</Text>
                    </Link>
                  </Table.Cell>
                  <Table.Cell py={3} px={4}>
                    <Link href={`/transcripts/${t.id}`} style={{ display: 'block' }}>
                      <Text fontSize="sm" color="var(--chakra-colors-fg-muted)">{t.time}</Text>
                    </Link>
                  </Table.Cell>
                  <Table.Cell py={3} px={4}>
                    <Link href={`/transcripts/${t.id}`} style={{ display: 'block' }}>
                      <Text fontSize="sm" color="var(--chakra-colors-fg-default)">{t.agentName}</Text>
                    </Link>
                  </Table.Cell>
                  <Table.Cell py={3} px={4}>
                    <Link href={`/transcripts/${t.id}`} style={{ display: 'block' }}>
                      <Text fontSize="sm" color="var(--chakra-colors-fg-default)">{t.customerName}</Text>
                    </Link>
                  </Table.Cell>
                  <Table.Cell py={3} px={4}>
                    <Link href={`/transcripts/${t.id}`} style={{ display: 'block' }}>
                      <Text fontSize="sm" color="var(--chakra-colors-fg-muted)">{t.accountName}</Text>
                    </Link>
                  </Table.Cell>
                  <Table.Cell py={3} px={4}>
                    <Link href={`/transcripts/${t.id}`} style={{ display: 'block' }}>
                      <Text fontSize="sm" color="var(--chakra-colors-fg-muted)">{t.region}</Text>
                    </Link>
                  </Table.Cell>
                  <Table.Cell py={3} px={4}>
                    <Link href={`/transcripts/${t.id}`} style={{ display: 'block' }}>
                      <Text fontSize="sm" color="var(--chakra-colors-fg-muted)">{t.duration}</Text>
                    </Link>
                  </Table.Cell>
                  <Table.Cell py={3} px={4}>
                    <Link href={`/transcripts/${t.id}`} style={{ display: 'block' }}>
                      <Flex gap={1} flexWrap="wrap">
                        {t.tags.map(tag => (
                          <Badge key={tag} colorPalette="blue" variant="subtle" size="sm">{tag}</Badge>
                        ))}
                      </Flex>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}
      </Box>
    </Box>
  )
}
