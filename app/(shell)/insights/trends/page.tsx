'use client'

import { Badge, Box, Flex, Stack, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { getAllCallDetails } from '@/lib/data/calls'
import { THEMES } from '@/lib/data/themes'
import type { CallDetailData, Theme } from '@/lib/types'

// ── Inline SVG icons ──────────────────────────────────────────────────────────

function SvgIcon({ d, size = 14, color = 'currentColor' }: { d: string | string[]; size?: number; color?: string }) {
  const paths = Array.isArray(d) ? d : [d]
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  )
}

const ICON = {
  search:       'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm10 2-4.35-4.35',
  alert:        ['M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z', 'M12 9v4', 'M12 17h.01'],
  trending_up:  'M23 6 13.5 15.5l-5-5L1 18',
  trending_dn:  'M23 18 13.5 8.5l-5 5L1 6',
  message:      'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  sparkles:     ['M12 3 9 9 3 12l6 3 3 6 3-6 6-3-6-3z', 'M5 3v4', 'M19 17v4', 'M3 5h4', 'M17 19h4'],
  arrow_right:  'M5 12h14m-7-7 7 7-7 7',
  globe:        ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z', 'M2 12h20', 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'],
  bar_chart:    'M18 20V10M12 20V4M6 20v-6',
  download:     ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'M7 10l5 5 5-5', 'M12 15V3'],
  arrow_updown: 'M7 16V4m0 0-4 4m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4',
  x:            'M18 6 6 18M6 6l12 12',
  calendar:     ['M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z'],
}

// ── Sparkline SVG ─────────────────────────────────────────────────────────────

function Sparkline({ trend, trendPct, count }: { trend: Theme['trend']; trendPct: number; count: number }) {
  const n = 6
  const factor = trend === 'rising' ? 1 + trendPct / 100 : trend === 'declining' ? 1 - trendPct / 100 : 1
  const startVal = factor !== 1 ? count / factor : count
  const pts = Array.from({ length: n }, (_, i) => startVal + (count - startVal) * (i / (n - 1)))
  const minV = Math.min(...pts), maxV = Math.max(...pts)
  const range = maxV - minV || 1
  const W = 64, H = 32, pad = 4
  const svgPts = pts.map((v, i) => {
    const x = pad + (i / (n - 1)) * (W - pad * 2)
    const y = (H - pad) - ((v - minV) / range) * (H - pad * 2)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
  const color = trend === 'rising' ? '#ef4444' : trend === 'declining' ? '#22c55e' : '#9ca3af'
  return (
    <svg width={W} height={H} style={{ flexShrink: 0 }}>
      <polyline points={svgPts} fill="none" stroke={color} strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Severity helpers ──────────────────────────────────────────────────────────

function themeSeverity(t: Theme): 'critical' | 'high' | 'medium' | 'low' {
  if (t.trend === 'rising' && t.trendPercent >= 35) return 'critical'
  if (t.trend === 'rising' || t.callCount >= 100) return 'high'
  if (t.trend === 'stable') return 'medium'
  return 'low'
}

type SevPalette = { badgePalette: string; iconColor: string; areaIconBg: string; areaIconColor: string; trendColor: string }

const SEV_PALETTE: Record<string, SevPalette> = {
  critical: { badgePalette: 'red',    iconColor: 'var(--chakra-colors-red-600)',    areaIconBg: 'var(--chakra-colors-red-100)',    areaIconColor: 'var(--chakra-colors-red-700)',    trendColor: 'var(--chakra-colors-red-700)' },
  high:     { badgePalette: 'orange', iconColor: 'var(--chakra-colors-orange-600)', areaIconBg: 'var(--chakra-colors-orange-100)', areaIconColor: 'var(--chakra-colors-orange-700)', trendColor: 'var(--chakra-colors-red-700)' },
  medium:   { badgePalette: 'gray',   iconColor: 'var(--chakra-colors-gray-500)',   areaIconBg: 'var(--chakra-colors-gray-100)',   areaIconColor: 'var(--chakra-colors-gray-600)',   trendColor: 'var(--chakra-colors-green-700)' },
  low:      { badgePalette: 'gray',   iconColor: 'var(--chakra-colors-gray-400)',   areaIconBg: 'var(--chakra-colors-gray-100)',   areaIconColor: 'var(--chakra-colors-gray-500)',   trendColor: 'var(--chakra-colors-green-700)' },
}

// ── Area initial icon ─────────────────────────────────────────────────────────

function AreaIcon({ label, sev }: { label: string; sev: string }) {
  const p = SEV_PALETTE[sev] || SEV_PALETTE.medium
  return (
    <Box
      w="28px" h="28px" rounded="md" flexShrink={0}
      bg={p.areaIconBg}
      display="flex" alignItems="center" justifyContent="center"
    >
      <Text fontSize="xs" fontWeight="bold" color={p.areaIconColor} lineHeight="none">
        {label[0].toUpperCase()}
      </Text>
    </Box>
  )
}

// ── Quote bubble ──────────────────────────────────────────────────────────────

function QuoteBubble({ text }: { text: string }) {
  return (
    <Flex align="flex-start" gap={1} bg="var(--chakra-colors-bg-subtle)" rounded="sm" px={2} py={1}>
      <Box mt={0.5} flexShrink={0}>
        <SvgIcon d={ICON.message} size={12} color="var(--chakra-colors-fg-muted)" />
      </Box>
      <Text
        fontSize="xs" color="var(--chakra-colors-fg-default)" fontStyle="italic"
        overflow="hidden" lineHeight="tall"
        style={{ WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical' as const }}
      >
        &ldquo;{text}&rdquo;
      </Text>
    </Flex>
  )
}

// ── Styled native select ──────────────────────────────────────────────────────

function FilterSelect({
  placeholder, options, value, onChange, icon,
}: {
  placeholder: string
  options: { label: string; value: string }[]
  value: string
  onChange: (v: string) => void
  icon?: React.ReactNode
}) {
  return (
    <Flex
      align="center" gap={1.5}
      borderWidth="1px" borderColor="var(--chakra-colors-border-subtle)"
      bg="var(--chakra-colors-bg-subtle)"
      rounded="md" px={2.5} py={1.5}
      position="relative"
    >
      {icon}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          fontSize: '13px',
          color: 'var(--chakra-colors-fg-default)',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          cursor: 'pointer',
          appearance: 'none',
          paddingRight: '16px',
        }}
      >
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <Box position="absolute" right={2} pointerEvents="none">
        <Text fontSize="9px" color="var(--chakra-colors-fg-muted)">▾</Text>
      </Box>
    </Flex>
  )
}

// ── Escalation card ───────────────────────────────────────────────────────────

function EscalationCard({
  title, callCount, periodLabel, quote, tags, severity,
  id,
}: {
  title: string
  callCount: number
  periodLabel: string
  quote: string
  tags: string[]
  severity: 'critical' | 'high' | 'medium'
  id?: string
}) {
  const isCritical = severity === 'critical'
  const borderColor = isCritical ? 'var(--chakra-colors-red-200)' : 'var(--chakra-colors-orange-200)'
  const hoverBg = isCritical ? 'var(--chakra-colors-red-50)' : 'var(--chakra-colors-orange-50)'
  const badgePalette = isCritical ? 'red' : 'orange'
  const badgeLabel = isCritical ? 'Critical' : 'Possible Outage'

  const inner = (
    <Box
      flex={1} minW={0}
      borderWidth="1px" borderColor={borderColor}
      bg="white" rounded="md" px={4} py={3}
      cursor="pointer"
      _hover={{ bg: hoverBg }}
      transition="background-color 0.1s ease"
      display="flex" flexDirection="column" gap={2}
    >
      <Flex align="center" justify="space-between">
        <Badge colorPalette={badgePalette} variant="subtle" size="sm" rounded="sm" display="flex" alignItems="center" gap={1}>
          <SvgIcon d={ICON.alert} size={10} color={isCritical ? 'var(--chakra-colors-red-600)' : 'var(--chakra-colors-orange-600)'} />
          {badgeLabel}
        </Badge>
        <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">{callCount} call{callCount !== 1 ? 's' : ''} · {periodLabel}</Text>
      </Flex>
      <Text fontSize="sm" fontWeight="semibold" color="var(--chakra-colors-fg-default)">{title}</Text>
      <Text
        fontSize="xs" color="var(--chakra-colors-fg-default)" fontStyle="italic"
        overflow="hidden" lineHeight="tall"
        style={{ WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical' as const }}
      >
        &ldquo;{quote}&rdquo;
      </Text>
      <Flex gap={1} flexWrap="wrap">
        {tags.map(t => (
          <Badge key={t} colorPalette="gray" variant="subtle" size="sm" rounded="sm">{t}</Badge>
        ))}
      </Flex>
    </Box>
  )

  if (id) {
    return <Link href={`/transcripts/${id}`} style={{ textDecoration: 'none', flex: 1, minWidth: 0, display: 'flex' }}>{inner}</Link>
  }
  return <Box style={{ flex: 1, minWidth: 0, display: 'flex' }}>{inner}</Box>
}

// ── Pattern card ──────────────────────────────────────────────────────────────

function PatternCard({ theme }: { theme: Theme }) {
  const isNew     = theme.trend === 'rising' && theme.trendPercent >= 35
  const isGrowing = theme.trend === 'rising' && !isNew
  const isDeclining = theme.trend === 'declining'

  const palette   = isNew ? 'red' : isGrowing ? 'orange' : 'gray'
  const badgeLabel = isNew ? 'New' : isGrowing ? 'Growing' : isDeclining ? 'Stable' : 'Monitoring'
  const bg        = isNew ? 'var(--chakra-colors-red-50)' : isGrowing ? 'var(--chakra-colors-orange-50)' : 'var(--chakra-colors-gray-50)'
  const border    = isNew ? 'var(--chakra-colors-red-200)' : isGrowing ? 'var(--chakra-colors-orange-200)' : 'var(--chakra-colors-border-subtle)'
  const hoverBg   = isNew ? 'var(--chakra-colors-red-100)' : isGrowing ? 'var(--chakra-colors-orange-100)' : 'var(--chakra-colors-gray-100)'

  return (
    <Link href={`/themes?theme=${theme.id}`} style={{ textDecoration: 'none' }}>
      <Box
        bg={bg} borderWidth="1px" borderColor={border}
        rounded="md" px={3} py={3}
        cursor="pointer"
        _hover={{ bg: hoverBg }}
        transition="background-color 0.1s ease"
        display="flex" flexDirection="column" gap={1.5}
      >
        <Flex align="center" justify="space-between">
          <Text fontSize="xs" fontWeight="semibold" color="var(--chakra-colors-fg-default)">{theme.name}</Text>
          <Badge colorPalette={palette} variant="subtle" size="sm" rounded="sm">{badgeLabel}</Badge>
        </Flex>
        <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">
          {theme.callCount} conversations · {theme.regions.length} region{theme.regions.length !== 1 ? 's' : ''}
        </Text>
        <Text
          fontSize="xs" color="var(--chakra-colors-fg-default)"
          overflow="hidden" lineHeight="tall"
          style={{ WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical' as const }}
        >
          {theme.summary}
        </Text>
      </Box>
    </Link>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function InsightsPage() {
  const calls = useMemo(() => getAllCallDetails(), [])

  // ── Filter state ──────────────────────────────────────────────────────────
  const [search, setSearch]         = useState('')
  const [dateRange, setDateRange]   = useState('')
  const [productArea, setProductArea] = useState('')
  const [severity, setSeverity]     = useState('')
  const [region, setRegion]         = useState('')

  const hasFilters = !!(search || dateRange || productArea || severity || region)

  function clearAll() {
    setSearch(''); setDateRange(''); setProductArea(''); setSeverity(''); setRegion('')
  }

  // ── Derived: escalated call groups ────────────────────────────────────────
  const escalationGroups = useMemo(() => {
    const escalated = calls.filter(c => c.escalationStatus === 'escalated')
    const map = new Map<string, CallDetailData[]>()
    escalated.forEach(c => {
      const key = c.productArea || c.issueCategory || 'General'
      map.set(key, [...(map.get(key) || []), c])
    })
    return Array.from(map.entries())
      .map(([area, groupCalls]) => {
        const theme = THEMES.find(t =>
          t.productArea.toLowerCase().includes(area.toLowerCase().split(' ')[0]) ||
          area.toLowerCase().includes(t.productArea.toLowerCase().split(' ')[0])
        )
        const worstSev = groupCalls.some(c => c.severity === 'critical') ? 'critical'
          : groupCalls.some(c => c.severity === 'high') ? 'high' : 'medium'
        return {
          area,
          count: groupCalls.length,
          severity: worstSev as 'critical' | 'high' | 'medium',
          title: theme?.name || area,
          quote: theme?.evidenceSnippet || groupCalls[0]?.aiSummary?.split('. ')[0] || '',
          tags: theme?.tags.slice(0, 2) || [area],
          callId: groupCalls[0]?.id,
        }
      })
      .sort((a, b) => {
        const ord: Record<string, number> = { critical: 3, high: 2, medium: 1 }
        return (ord[b.severity] || 0) - (ord[a.severity] || 0)
      })
      .slice(0, 3)
  }, [calls])

  // ── Derived: filtered themes for table ────────────────────────────────────
  const productAreaOptions = useMemo(() =>
    [...new Set(THEMES.map(t => t.productArea))].sort().map(pa => ({ label: pa, value: pa }))
  , [])

  const regionOptions = useMemo(() =>
    [...new Set(THEMES.flatMap(t => t.regions))].sort().map(r => ({ label: r, value: r }))
  , [])

  const filteredThemes = useMemo(() => {
    return THEMES.filter(t => {
      if (search) {
        const q = search.toLowerCase()
        if (!t.name.toLowerCase().includes(q) && !t.summary.toLowerCase().includes(q) && !t.productArea.toLowerCase().includes(q)) return false
      }
      if (productArea && t.productArea !== productArea) return false
      if (severity && themeSeverity(t) !== severity) return false
      if (region && !t.regions.includes(region)) return false
      return true
    }).sort((a, b) => b.callCount - a.callCount)
  }, [search, productArea, severity, region])

  // ── Derived: emerging patterns sorted by urgency ──────────────────────────
  const emergingPatterns = useMemo(() =>
    [...THEMES].sort((a, b) => {
      const score = (t: Theme) =>
        t.trend === 'rising' ? t.trendPercent + 100 :
        t.trend === 'stable' && t.callCount > 100 ? 50 : 10
      return score(b) - score(a)
    }).slice(0, 4)
  , [])

  const criticalCount = escalationGroups.filter(g => g.severity === 'critical').length

  return (
    <Box bg="white" minH="full">

      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <Flex
        align="center" justify="space-between"
        borderBottomWidth="1px" borderColor="var(--chakra-colors-border-subtle)"
        px={6} py={4}
      >
        <Box>
          <Text fontSize="xl" fontWeight="semibold" color="var(--chakra-colors-fg-default)" lineHeight="none" mb={1}>
            Insights
          </Text>
          <Text fontSize="sm" color="var(--chakra-colors-fg-muted)">
            Surface trends, product issues, and customer struggles from call transcripts
          </Text>
        </Box>
        <Flex
          as="button"
          align="center" gap={1.5}
          borderWidth="1px" borderColor="var(--chakra-colors-border-subtle)"
          bg="white" rounded="md" px={3} py={1.5}
          fontSize="sm" color="var(--chakra-colors-fg-default)"
          cursor="pointer"
          _hover={{ bg: 'var(--chakra-colors-bg-subtle)' }}
          transition="background-color 0.1s ease"
        >
          <SvgIcon d={ICON.download} size={14} />
          Export
        </Flex>
      </Flex>

      {/* ── Filter bar ───────────────────────────────────────────────────────── */}
      <Box borderBottomWidth="1px" borderColor="var(--chakra-colors-border-subtle)" px={6} py={4}>
        {/* Search */}
        <Flex
          align="center" gap={2}
          borderWidth="1px" borderColor="var(--chakra-colors-border-subtle)"
          bg="var(--chakra-colors-bg-subtle)" rounded="md" px={3} py={2}
          mb={3}
        >
          <SvgIcon d={ICON.search} size={14} color="var(--chakra-colors-fg-muted)" />
          <input
            type="text"
            placeholder="Search insights by product area, issue, customer, or keyword..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1,
              fontSize: '13px',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--chakra-colors-fg-default)',
            }}
          />
        </Flex>

        {/* Filter row */}
        <Flex gap={2} flexWrap="wrap" align="center">
          <FilterSelect
            placeholder="Last 7 days"
            value={dateRange}
            onChange={setDateRange}
            options={[
              { label: 'Today', value: '1d' },
              { label: 'Last 7 days', value: '7d' },
              { label: 'Last 30 days', value: '30d' },
              { label: 'Last 90 days', value: '90d' },
              { label: 'All time', value: 'all' },
            ]}
            icon={<SvgIcon d={ICON.calendar} size={13} color="var(--chakra-colors-fg-muted)" />}
          />
          <FilterSelect
            placeholder="Product Area"
            value={productArea}
            onChange={setProductArea}
            options={productAreaOptions}
            icon={<SvgIcon d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" size={13} color="var(--chakra-colors-fg-muted)" />}
          />
          <FilterSelect
            placeholder="Severity"
            value={severity}
            onChange={setSeverity}
            options={[
              { label: 'Critical', value: 'critical' },
              { label: 'High', value: 'high' },
              { label: 'Medium', value: 'medium' },
              { label: 'Low', value: 'low' },
            ]}
            icon={<SvgIcon d={ICON.alert} size={13} color="var(--chakra-colors-fg-muted)" />}
          />
          <FilterSelect
            placeholder="Region"
            value={region}
            onChange={setRegion}
            options={regionOptions}
            icon={<SvgIcon d={ICON.globe} size={13} color="var(--chakra-colors-fg-muted)" />}
          />
          {hasFilters && (
            <Flex
              as="button"
              align="center" gap={1}
              px={2.5} py={1.5}
              rounded="md"
              fontSize="xs"
              color="var(--chakra-colors-fg-muted)"
              cursor="pointer"
              _hover={{ color: 'var(--chakra-colors-fg-default)' }}
              onClick={clearAll}
            >
              <SvgIcon d={ICON.x} size={12} />
              Clear All
            </Flex>
          )}
        </Flex>
      </Box>

      {/* ── Active Escalations ───────────────────────────────────────────────── */}
      {escalationGroups.length > 0 && (
        <Box borderBottomWidth="1px" borderColor="var(--chakra-colors-border-subtle)" px={6} py={5}>
          <Box
            borderWidth="2px" borderColor="var(--chakra-colors-red-200)"
            bg="var(--chakra-colors-red-50)" rounded="lg" px={5} py={4}
            display="flex" flexDirection="column" gap={3}
          >
            {/* Section header */}
            <Flex align="center" justify="space-between">
              <Flex align="center" gap={2}>
                <Box
                  w="32px" h="32px" rounded="md" flexShrink={0}
                  bg="var(--chakra-colors-red-100)"
                  display="flex" alignItems="center" justifyContent="center"
                >
                  <SvgIcon d={ICON.alert} size={16} color="var(--chakra-colors-red-600)" />
                </Box>
                <Text fontSize="md" fontWeight="semibold" color="var(--chakra-colors-red-900)">
                  Active Escalations
                </Text>
                {criticalCount > 0 && (
                  <Badge colorPalette="red" variant="solid" size="sm" rounded="sm">
                    {criticalCount} Critical
                  </Badge>
                )}
              </Flex>
              <Link href="/qa/queue" style={{ textDecoration: 'none' }}>
                <Flex align="center" gap={1} fontSize="xs" color="var(--chakra-colors-blue-600)"
                  _hover={{ color: 'var(--chakra-colors-blue-800)' }}>
                  View all escalations
                  <SvgIcon d={ICON.arrow_right} size={12} color="var(--chakra-colors-blue-600)" />
                </Flex>
              </Link>
            </Flex>

            {/* Cards */}
            <Flex gap={3} align="stretch" flexWrap={{ base: 'wrap', md: 'nowrap' }}>
              {escalationGroups.map((g, i) => (
                <EscalationCard
                  key={i}
                  title={g.title}
                  callCount={g.count}
                  periodLabel="recent"
                  quote={g.quote}
                  tags={g.tags}
                  severity={g.severity}
                  id={g.callId}
                />
              ))}
            </Flex>
          </Box>
        </Box>
      )}

      {/* ── Main body ────────────────────────────────────────────────────────── */}
      <Flex align="flex-start" gap={6} px={6} py={5}>

        {/* ── Product Area Breakdown ──────────────────────────────────────── */}
        <Box flex={2} minW={0} display="flex" flexDirection="column" gap={4}>
          <Flex align="center" justify="space-between">
            <Flex align="center" gap={2}>
              <SvgIcon d={ICON.bar_chart} size={16} color="var(--chakra-colors-fg-default)" />
              <Text fontSize="md" fontWeight="semibold" color="var(--chakra-colors-fg-default)">
                Product Area Breakdown
              </Text>
            </Flex>
            <Flex
              as="button"
              align="center" gap={1.5}
              borderWidth="1px" borderColor="var(--chakra-colors-border-subtle)"
              bg="white" rounded="md" px={2.5} py={1}
              fontSize="xs" color="var(--chakra-colors-fg-muted)"
              cursor="pointer"
              _hover={{ bg: 'var(--chakra-colors-bg-subtle)' }}
            >
              <SvgIcon d={ICON.arrow_updown} size={12} />
              Sort: Most Calls
            </Flex>
          </Flex>

          <Box
            borderWidth="1px" borderColor="var(--chakra-colors-border-subtle)"
            bg="white" rounded="md" boxShadow="sm" overflow="hidden"
          >
            {/* Table header */}
            <Box
              bg="var(--chakra-colors-bg-subtle)"
              borderBottomWidth="1px" borderColor="var(--chakra-colors-border-subtle)"
              px={4} py={2.5}
              display="grid"
              style={{ gridTemplateColumns: '200px 70px 160px 100px 1fr 120px' }}
              gap="12px" alignItems="center"
            >
              {['Product Area', 'Calls', 'Trend', 'Severity', 'Top Customer Quotes', ''].map(col => (
                <Text key={col} fontSize="xs" fontWeight="semibold"
                  color="var(--chakra-colors-fg-muted)" textTransform="uppercase" letterSpacing="wider">
                  {col}
                </Text>
              ))}
            </Box>

            {/* Table rows */}
            {filteredThemes.length === 0 ? (
              <Box px={6} py={10} textAlign="center">
                <Text fontSize="sm" color="var(--chakra-colors-fg-muted)">No themes match the current filters.</Text>
                {hasFilters && (
                  <Box as="button" mt={2} fontSize="xs" color="var(--chakra-colors-blue-600)" cursor="pointer" onClick={clearAll}>
                    Clear all filters →
                  </Box>
                )}
              </Box>
            ) : (
              <Stack gap={0}>
                {filteredThemes.map((t, i) => {
                  const sev = themeSeverity(t)
                  const p = SEV_PALETTE[sev]
                  const isRising = t.trend === 'rising'
                  const trendLabel = isRising ? `+${t.trendPercent}%` : t.trend === 'declining' ? `-${t.trendPercent}%` : 'Stable'

                  return (
                    <Link key={t.id} href={`/insights/topics?productArea=${encodeURIComponent(t.productArea)}`} style={{ textDecoration: 'none' }}>
                      <Box
                        borderTopWidth={i > 0 ? '1px' : '0'}
                        borderColor="var(--chakra-colors-border-subtle)"
                        px={4} py={3}
                        _hover={{ bg: 'var(--chakra-colors-blue-50)' }}
                        transition="background-color 0.1s ease"
                        cursor="pointer"
                        display="grid"
                        style={{ gridTemplateColumns: '200px 70px 160px 100px 1fr 120px' }}
                        gap="12px" alignItems="start"
                      >
                        {/* Product area */}
                        <Flex align="center" gap={2}>
                          <AreaIcon label={t.productArea} sev={sev} />
                          <Text fontSize="sm" fontWeight="semibold" color="var(--chakra-colors-fg-default)"
                            overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
                            {t.productArea.split(' /')[0]}
                          </Text>
                        </Flex>

                        {/* Call count */}
                        <Text fontSize="lg" fontWeight="bold" color="var(--chakra-colors-fg-default)" lineHeight="tight" pt={0.5}>
                          {t.callCount}
                        </Text>

                        {/* Trend + sparkline */}
                        <Flex align="center" gap={1} pt={0.5}>
                          {isRising
                            ? <SvgIcon d={ICON.trending_up} size={13} color="var(--chakra-colors-red-600)" />
                            : t.trend === 'declining'
                              ? <SvgIcon d={ICON.trending_dn} size={13} color="var(--chakra-colors-green-600)" />
                              : null
                          }
                          <Text
                            fontSize="xs" fontWeight="semibold"
                            color={isRising ? 'var(--chakra-colors-red-700)' : t.trend === 'declining' ? 'var(--chakra-colors-green-700)' : 'var(--chakra-colors-fg-muted)'}
                          >
                            {trendLabel}
                          </Text>
                          <Sparkline trend={t.trend} trendPct={t.trendPercent} count={t.callCount} />
                        </Flex>

                        {/* Severity badge */}
                        <Box pt={0.5}>
                          <Badge
                            colorPalette={p.badgePalette}
                            variant="subtle" size="sm" rounded="sm"
                            textTransform="capitalize"
                          >
                            {sev}
                          </Badge>
                        </Box>

                        {/* Quotes */}
                        <Stack gap={1.5}>
                          <QuoteBubble text={t.representativeQuotes[0]?.text || t.evidenceSnippet} />
                          {t.representativeQuotes[1] && (
                            <QuoteBubble text={t.representativeQuotes[1].text} />
                          )}
                        </Stack>

                        {/* Link */}
                        <Flex align="center" gap={1} pt={1}>
                          <Text fontSize="xs" color="var(--chakra-colors-blue-600)" fontWeight="medium">View themes</Text>
                          <SvgIcon d={ICON.arrow_right} size={12} color="var(--chakra-colors-blue-600)" />
                        </Flex>
                      </Box>
                    </Link>
                  )
                })}
              </Stack>
            )}
          </Box>
        </Box>

        {/* ── Right Sidebar ───────────────────────────────────────────────── */}
        <Box w="320px" flexShrink={0} display="flex" flexDirection="column" gap={6}>

          {/* Emerging Patterns */}
          <Box
            borderWidth="1px" borderColor="var(--chakra-colors-border-subtle)"
            bg="white" rounded="md" px={4} py={4} boxShadow="sm"
            display="flex" flexDirection="column" gap={3}
          >
            <Flex align="center" gap={2}>
              <SvgIcon d={ICON.sparkles} size={15} color="var(--chakra-colors-fg-default)" />
              <Text fontSize="sm" fontWeight="semibold" color="var(--chakra-colors-fg-default)">
                Emerging Patterns
              </Text>
              <Badge colorPalette="blue" variant="subtle" size="sm" rounded="sm" display="flex" alignItems="center" gap={1}>
                <SvgIcon d={ICON.sparkles} size={9} color="var(--chakra-colors-blue-600)" />
                AI
              </Badge>
            </Flex>

            <Stack gap={2}>
              {emergingPatterns.map(t => (
                <PatternCard key={t.id} theme={t} />
              ))}
            </Stack>

            <Link href="/insights/topics" style={{ textDecoration: 'none' }}>
              <Flex align="center" gap={1} fontSize="xs" color="var(--chakra-colors-blue-600)"
                _hover={{ color: 'var(--chakra-colors-blue-800)' }}>
                View all patterns
                <SvgIcon d={ICON.arrow_right} size={12} color="var(--chakra-colors-blue-600)" />
              </Flex>
            </Link>
          </Box>
        </Box>
      </Flex>
    </Box>
  )
}
