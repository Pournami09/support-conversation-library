'use client'

import { Badge, Box, Flex, Stack, Text } from '@chakra-ui/react'
import { getAllCallDetails } from '@/lib/data/calls'
import type { CallDetailData } from '@/lib/types'
import { AgentName } from '@/components/agent/AgentName'

// ── QA score (same formula as EvidencePanel) ──────────────────────────────

function qaScore(c: CallDetailData): number {
  const base = c.qaStatus === 'flagged' ? 52 : c.qaStatus === 'reviewed' ? 80 : 67
  const s = c.sentiment === 'negative' ? -12 : c.sentiment === 'positive' ? 8 : 0
  const e = c.escalationStatus === 'escalated' ? -8 : 0
  return Math.min(99, Math.max(20, base + s + e))
}

function avg(nums: number[]): number {
  if (nums.length === 0) return 0
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length)
}

// ── SVG mini bar ───────────────────────────────────────────────────────────

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <Box h="6px" bg="var(--chakra-colors-bg-subtle)" rounded="full" overflow="hidden" w="60px"
      borderWidth="1px" borderColor="var(--chakra-colors-border-subtle)">
      <Box h="full" rounded="full" style={{ width: `${pct}%`, background: color }} />
    </Box>
  )
}

// ── Score pill ─────────────────────────────────────────────────────────────

function ScorePill({ score, teamAvg }: { score: number; teamAvg: number }) {
  const below = score < teamAvg - 5
  const above = score > teamAvg + 5
  return (
    <Flex align="center" gap={1.5}>
      <Text
        fontSize="sm" fontWeight="semibold" minW="28px"
        color={below ? 'var(--chakra-colors-red-700)' : above ? 'var(--chakra-colors-green-700)' : 'var(--chakra-colors-fg-default)'}
      >
        {score}
      </Text>
      {below && <Text fontSize="10px" color="var(--chakra-colors-red-500)">↓</Text>}
      {above && <Text fontSize="10px" color="var(--chakra-colors-green-500)">↑</Text>}
    </Flex>
  )
}

// ── Stat card ──────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, palette = 'default' }: {
  label: string
  value: string | number
  sub?: string
  palette?: 'default' | 'red' | 'orange' | 'green'
}) {
  const color = palette === 'red' ? 'var(--chakra-colors-red-700)'
    : palette === 'orange' ? 'var(--chakra-colors-orange-700)'
    : palette === 'green' ? 'var(--chakra-colors-green-700)'
    : 'var(--chakra-colors-fg-default)'

  return (
    <Box
      borderWidth="1px" borderColor="var(--chakra-colors-border-subtle)"
      bg="var(--chakra-colors-bg-panel)" rounded="md" px={4} py={3}
    >
      <Text fontSize="xs" color="var(--chakra-colors-fg-muted)" mb={1}>{label}</Text>
      <Text fontSize="2xl" fontWeight="bold" color={color} lineHeight="none">{value}</Text>
      {sub && <Text fontSize="xs" color="var(--chakra-colors-fg-muted)" mt={0.5}>{sub}</Text>}
    </Box>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function QaReportsPage() {
  const calls = getAllCallDetails()

  // ── Team-level stats ─────────────────────────────────────────────────
  const totalCalls       = calls.length
  const flaggedCalls     = calls.filter(c => c.qaStatus === 'flagged').length
  const reviewedCalls    = calls.filter(c => c.qaStatus === 'reviewed').length
  const escalatedCalls   = calls.filter(c => c.escalationStatus === 'escalated').length
  const churnHighCalls   = calls.filter(c => c.churnRisk === 'high').length
  const teamScores       = calls.map(qaScore)
  const teamAvgScore     = avg(teamScores)
  const flagRate         = totalCalls > 0 ? Math.round((flaggedCalls / totalCalls) * 100) : 0

  // ── Per-agent stats ──────────────────────────────────────────────────
  type AgentRow = {
    name: string
    total: number
    flagged: number
    flagRate: number
    avgScore: number
    coaching: number
    churnHigh: number
    escalated: number
  }

  const agentMap = new Map<string, {
    total: number; flagged: number; coaching: number;
    churnHigh: number; escalated: number; scores: number[]
  }>()

  calls.forEach(c => {
    if (!agentMap.has(c.agentName)) {
      agentMap.set(c.agentName, { total: 0, flagged: 0, coaching: 0, churnHigh: 0, escalated: 0, scores: [] })
    }
    const s = agentMap.get(c.agentName)!
    s.total++
    if (c.qaStatus === 'flagged') s.flagged++
    if (c.flags.includes('coaching-opportunity')) s.coaching++
    if (c.churnRisk === 'high') s.churnHigh++
    if (c.escalationStatus === 'escalated') s.escalated++
    s.scores.push(qaScore(c))
  })

  const agentRows: AgentRow[] = Array.from(agentMap.entries())
    .map(([name, s]) => ({
      name,
      total:    s.total,
      flagged:  s.flagged,
      flagRate: s.total > 0 ? Math.round((s.flagged / s.total) * 100) : 0,
      avgScore: avg(s.scores),
      coaching: s.coaching,
      churnHigh: s.churnHigh,
      escalated: s.escalated,
    }))
    .sort((a, b) => b.total - a.total)

  const maxTotal = Math.max(...agentRows.map(r => r.total))

  return (
    <Box px={8} py={6}>
      {/* ── Header ───────────────────────────────────────────────── */}
      <Text fontSize="2xl" fontWeight="semibold" color="var(--chakra-colors-fg-default)" lineHeight="none" mb={1}>
        QA Reports
      </Text>
      <Text fontSize="sm" color="var(--chakra-colors-fg-muted)" mb={6}>
        Team-wide quality scores, flag rates, and per-agent performance.
      </Text>

      {/* ── Team summary ─────────────────────────────────────────── */}
      <Box mb={8}>
        <Text fontSize="sm" fontWeight="semibold" color="var(--chakra-colors-fg-default)" mb={3}>
          Team Overview
        </Text>
        <Box
          display="grid"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}
        >
          <StatCard label="Total calls" value={totalCalls} />
          <StatCard label="Avg QA score" value={teamAvgScore} sub="out of 100" palette={teamAvgScore < 65 ? 'red' : teamAvgScore > 80 ? 'green' : 'default'} />
          <StatCard label="Flagged" value={`${flaggedCalls}`} sub={`${flagRate}% flag rate`} palette={flagRate > 30 ? 'red' : flagRate > 15 ? 'orange' : 'default'} />
          <StatCard label="QA reviewed" value={reviewedCalls} sub={`${totalCalls > 0 ? Math.round(reviewedCalls / totalCalls * 100) : 0}% coverage`} />
          <StatCard label="Escalated" value={escalatedCalls} palette={escalatedCalls > 10 ? 'red' : 'default'} />
          <StatCard label="Churn risk" value={churnHighCalls} palette={churnHighCalls > 5 ? 'orange' : 'default'} />
        </Box>
      </Box>

      {/* ── Agent performance table ───────────────────────────────── */}
      <Box>
        <Flex align="center" gap={3} mb={3}>
          <Text fontSize="sm" fontWeight="semibold" color="var(--chakra-colors-fg-default)">
            Agent Performance
          </Text>
          <Badge colorPalette="gray" variant="subtle" size="sm" rounded="sm">
            {agentRows.length} agents
          </Badge>
        </Flex>

        <Box
          borderWidth="1px"
          borderColor="var(--chakra-colors-border-subtle)"
          rounded="md"
          overflow="hidden"
        >
          {/* Table header */}
          <Box
            bg="var(--chakra-colors-bg-subtle)"
            borderBottomWidth="1px"
            borderColor="var(--chakra-colors-border-subtle)"
            px={4} py={2}
          >
            <Box
              display="grid"
              style={{ gridTemplateColumns: '180px 1fr 80px 80px 80px 80px 80px' }}
              gap="8px"
              alignItems="center"
            >
              <Text fontSize="xs" fontWeight="semibold" color="var(--chakra-colors-fg-muted)" textTransform="uppercase" letterSpacing="wider">Agent</Text>
              <Text fontSize="xs" fontWeight="semibold" color="var(--chakra-colors-fg-muted)" textTransform="uppercase" letterSpacing="wider">Calls</Text>
              <Text fontSize="xs" fontWeight="semibold" color="var(--chakra-colors-fg-muted)" textTransform="uppercase" letterSpacing="wider">Flagged</Text>
              <Text fontSize="xs" fontWeight="semibold" color="var(--chakra-colors-fg-muted)" textTransform="uppercase" letterSpacing="wider">QA Score</Text>
              <Text fontSize="xs" fontWeight="semibold" color="var(--chakra-colors-fg-muted)" textTransform="uppercase" letterSpacing="wider">Coaching</Text>
              <Text fontSize="xs" fontWeight="semibold" color="var(--chakra-colors-fg-muted)" textTransform="uppercase" letterSpacing="wider">Churn ↑</Text>
              <Text fontSize="xs" fontWeight="semibold" color="var(--chakra-colors-fg-muted)" textTransform="uppercase" letterSpacing="wider">Escalated</Text>
            </Box>
          </Box>

          {/* Table rows */}
          <Stack gap={0}>
            {agentRows.map((row, i) => {
              const aboveAvg = row.avgScore > teamAvgScore + 5
              const belowAvg = row.avgScore < teamAvgScore - 5
              const highFlag = row.flagRate > flagRate + 10

              return (
                <Box
                  key={row.name}
                  borderBottomWidth={i < agentRows.length - 1 ? '1px' : '0'}
                  borderColor="var(--chakra-colors-border-subtle)"
                  bg={i % 2 === 0 ? 'var(--chakra-colors-bg-panel)' : 'white'}
                  px={4} py={2.5}
                  transition="background-color 0.1s ease"
                  _hover={{ bg: 'var(--chakra-colors-bg-subtle)' }}
                >
                  <Box
                    display="grid"
                    style={{ gridTemplateColumns: '180px 1fr 80px 80px 80px 80px 80px' }}
                    gap="8px"
                    alignItems="center"
                  >
                    {/* Agent name */}
                    <AgentName name={row.name} showAvatar size="xs" />

                    {/* Calls bar */}
                    <Flex align="center" gap={2}>
                      <Text fontSize="xs" fontWeight="medium" color="var(--chakra-colors-fg-default)" minW="20px">
                        {row.total}
                      </Text>
                      <MiniBar value={row.total} max={maxTotal} color="var(--chakra-colors-blue-400)" />
                    </Flex>

                    {/* Flagged rate */}
                    <Box>
                      <Badge
                        colorPalette={highFlag ? 'red' : row.flagRate > 10 ? 'orange' : 'gray'}
                        variant="subtle" size="sm" rounded="sm"
                      >
                        {row.flagRate}%
                      </Badge>
                    </Box>

                    {/* QA score */}
                    <ScorePill score={row.avgScore} teamAvg={teamAvgScore} />

                    {/* Coaching */}
                    <Text fontSize="xs" color={row.coaching > 2 ? 'var(--chakra-colors-orange-700)' : 'var(--chakra-colors-fg-muted)'} fontWeight={row.coaching > 2 ? 'semibold' : 'normal'}>
                      {row.coaching}
                    </Text>

                    {/* Churn high */}
                    <Text fontSize="xs" color={row.churnHigh > 1 ? 'var(--chakra-colors-red-700)' : 'var(--chakra-colors-fg-muted)'} fontWeight={row.churnHigh > 1 ? 'semibold' : 'normal'}>
                      {row.churnHigh}
                    </Text>

                    {/* Escalated */}
                    <Text fontSize="xs" color={row.escalated > 1 ? 'var(--chakra-colors-red-700)' : 'var(--chakra-colors-fg-muted)'}>
                      {row.escalated}
                    </Text>
                  </Box>
                </Box>
              )
            })}
          </Stack>
        </Box>

        <Text fontSize="xs" color="var(--chakra-colors-fg-muted)" mt={2}>
          QA scores below {teamAvgScore - 5} (↓) or above {teamAvgScore + 5} (↑) vs. team avg of {teamAvgScore}. Click agent name to view all their calls.
        </Text>
      </Box>
    </Box>
  )
}
