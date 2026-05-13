'use client'

import { useEffect } from 'react'
import { Badge, Box, Flex, Stack, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { useAgentPanel } from '@/lib/context/agent-panel'
import { getAllCallDetails } from '@/lib/data/calls'
import type { CallDetailData } from '@/lib/types'

// ── Helpers ────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
}

function qaScore(c: CallDetailData): number {
  const base = c.qaStatus === 'flagged' ? 52 : c.qaStatus === 'reviewed' ? 80 : 67
  const s    = c.sentiment === 'negative' ? -12 : c.sentiment === 'positive' ? 8 : 0
  const e    = c.escalationStatus === 'escalated' ? -8 : 0
  return Math.min(99, Math.max(20, base + s + e))
}

function csatOf(c: CallDetailData): number {
  if (c.sentiment === 'positive') return 4.5
  if (c.sentiment === 'neutral')  return 3.2
  return 1.8
}

function avg(nums: number[]): number {
  if (nums.length === 0) return 0
  return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10
}

function avgInt(nums: number[]): number {
  if (nums.length === 0) return 0
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length)
}

function mode(arr: string[]): string {
  const freq: Record<string, number> = {}
  arr.forEach(s => { freq[s] = (freq[s] ?? 0) + 1 })
  return Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? ''
}

const FLAG_LABEL: Record<string, string> = {
  'escalation':          'Escalation',
  'churn-risk':          'Churn Risk',
  'coaching-opportunity':'Coaching Opp.',
  'policy-concern':      'Policy Concern',
  'product-bug':         'Product Bug',
}
const FLAG_PALETTE: Record<string, string> = {
  'escalation':          'red',
  'churn-risk':          'orange',
  'coaching-opportunity':'blue',
  'policy-concern':      'yellow',
  'product-bug':         'gray',
}
const SEV_PALETTE: Record<string, string> = {
  critical: 'red', high: 'orange', medium: 'yellow', low: 'gray',
}
const QA_PALETTE: Record<string, string> = {
  flagged: 'red', unreviewed: 'yellow', reviewed: 'green',
}

// ── Sub-components ─────────────────────────────────────────────────────────

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

function SectionDivider({ label }: { label: string }) {
  return (
    <Box pt={1}>
      <Box h="1px" w="full" bg="var(--chakra-colors-border-subtle)" mb={3} />
      <Text fontSize="10px" fontWeight="semibold" color="var(--chakra-colors-fg-muted)"
        textTransform="uppercase" letterSpacing="wider" mb={2}>
        {label}
      </Text>
    </Box>
  )
}

function StatCell({ label, value, sub, danger }: {
  label: string; value: string | number; sub?: string; danger?: boolean
}) {
  return (
    <Box
      flex={1}
      bg="var(--chakra-colors-bg-subtle)"
      borderWidth="1px"
      borderColor={danger ? 'var(--chakra-colors-red-200)' : 'var(--chakra-colors-border-subtle)'}
      rounded="md" px={3} py={2.5}
    >
      <Text fontSize="xs" color="var(--chakra-colors-fg-muted)" mb={0.5}>{label}</Text>
      <Text
        fontSize="xl" fontWeight="bold" lineHeight="none"
        color={danger ? 'var(--chakra-colors-red-700)' : 'var(--chakra-colors-fg-default)'}
      >
        {value}
      </Text>
      {sub && (
        <Text fontSize="10px" color="var(--chakra-colors-fg-muted)" mt={0.5}>{sub}</Text>
      )}
    </Box>
  )
}

function topTags(calls: CallDetailData[], limit = 4): string[] {
  const freq: Record<string, number> = {}
  calls.forEach(c => {
    c.topics.forEach(t => { freq[t] = (freq[t] ?? 0) + 1 })
    c.flags.forEach(f => {
      const label = FLAG_LABEL[f]
      if (label) freq[label] = (freq[label] ?? 0) + 1
    })
  })
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag]) => tag)
}

function SentimentRow({ label, count, total, palette, tags }: {
  label: string; count: number; total: number; palette: string; tags: string[]
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  const barColor =
    palette === 'green'  ? 'var(--chakra-colors-green-400)'  :
    palette === 'gray'   ? 'var(--chakra-colors-gray-300)'   :
                           'var(--chakra-colors-red-400)'
  const tagPalette =
    palette === 'green' ? 'green' :
    palette === 'gray'  ? 'gray'  : 'red'

  return (
    <Box>
      <Flex align="center" gap={2} mb={tags.length > 0 ? 1.5 : 0}>
        <Text fontSize="xs" color="var(--chakra-colors-fg-muted)" w="60px" flexShrink={0}>
          {label}
        </Text>
        <Box flex={1} h="6px" bg="var(--chakra-colors-bg-subtle)" rounded="full" overflow="hidden"
          borderWidth="1px" borderColor="var(--chakra-colors-border-subtle)">
          <Box h="full" rounded="full" style={{ width: `${pct}%`, background: barColor,
            transition: 'width 0.6s cubic-bezier(0.215,0.61,0.355,1)' }} />
        </Box>
        <Text fontSize="xs" fontWeight="semibold" color="var(--chakra-colors-fg-default)" w="32px"
          textAlign="right" flexShrink={0}>
          {pct}%
        </Text>
      </Flex>
      {tags.length > 0 && (
        <Flex gap={1} flexWrap="wrap" pl="68px">
          {tags.map(tag => (
            <Badge key={tag} colorPalette={tagPalette} variant="subtle" size="sm" rounded="sm">
              {tag}
            </Badge>
          ))}
        </Flex>
      )}
    </Box>
  )
}

function FlagRow({ label, count, max, palette }: {
  label: string; count: number; max: number; palette: string
}) {
  if (count === 0) return null
  const barColor =
    palette === 'red'    ? 'var(--chakra-colors-red-400)'    :
    palette === 'orange' ? 'var(--chakra-colors-orange-400)' :
    palette === 'blue'   ? 'var(--chakra-colors-blue-400)'   :
    palette === 'yellow' ? 'var(--chakra-colors-yellow-400)' :
                           'var(--chakra-colors-gray-300)'
  const pct = max > 0 ? (count / max) * 100 : 0
  return (
    <Flex align="center" gap={2}>
      <Text fontSize="xs" color="var(--chakra-colors-fg-muted)" style={{ width: '110px', flexShrink: 0 }}>
        {label}
      </Text>
      <Box flex={1} h="5px" bg="var(--chakra-colors-bg-subtle)" rounded="full" overflow="hidden"
        borderWidth="1px" borderColor="var(--chakra-colors-border-subtle)">
        <Box h="full" rounded="full" style={{ width: `${pct}%`, background: barColor }} />
      </Box>
      <Text fontSize="xs" fontWeight="semibold" color="var(--chakra-colors-fg-default)" w="16px"
        textAlign="right" flexShrink={0}>
        {count}
      </Text>
    </Flex>
  )
}

// ── Main panel ─────────────────────────────────────────────────────────────

export function AgentPanel() {
  const { agentName, closeAgent } = useAgentPanel()
  const isOpen = !!agentName

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') closeAgent() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, closeAgent])

  // ── Compute agent stats ────────────────────────────────────────────────
  const allCalls    = getAllCallDetails()
  const agentCalls  = agentName ? allCalls.filter(c => c.agentName === agentName) : []
  const total       = agentCalls.length

  const csatScore   = avg(agentCalls.map(csatOf))
  const teamCsat    = avg(allCalls.map(csatOf))

  const qaScores    = agentCalls.map(qaScore)
  const avgQa       = avgInt(qaScores)
  const teamAvgQa   = avgInt(allCalls.map(qaScore))
  const qaDiff      = avgQa - teamAvgQa

  const flaggedCnt  = agentCalls.filter(c => c.qaStatus === 'flagged').length
  const flagRate    = total > 0 ? Math.round((flaggedCnt / total) * 100) : 0
  const teamFlagRate= allCalls.length > 0
    ? Math.round((allCalls.filter(c => c.qaStatus === 'flagged').length / allCalls.length) * 100)
    : 0
  const flagDanger  = flagRate > teamFlagRate + 8

  const coachingCnt = agentCalls.filter(c => c.flags.includes('coaching-opportunity')).length
  const escalated   = agentCalls.filter(c => c.escalationStatus === 'escalated').length
  const churnHigh   = agentCalls.filter(c => c.churnRisk === 'high').length

  // Sentiment distribution
  const posCalls    = agentCalls.filter(c => c.sentiment === 'positive')
  const neuCalls    = agentCalls.filter(c => c.sentiment === 'neutral')
  const negCalls    = agentCalls.filter(c => c.sentiment === 'negative')
  const posCount    = posCalls.length
  const neuCount    = neuCalls.length
  const negCount    = negCalls.length
  const posTags     = topTags(posCalls)
  const neuTags     = topTags(neuCalls)
  const negTags     = topTags(negCalls)

  // Flag breakdown
  const allFlagKeys = ['coaching-opportunity', 'churn-risk', 'escalation', 'policy-concern', 'product-bug']
  const flagCounts  = Object.fromEntries(
    allFlagKeys.map(k => [k, agentCalls.filter(c => c.flags.includes(k as never)).length])
  )
  const maxFlagCount = Math.max(...Object.values(flagCounts), 1)

  // Top issue areas
  const issueCounts: Record<string, number> = {}
  agentCalls.forEach(c => {
    issueCounts[c.issueCategory] = (issueCounts[c.issueCategory] ?? 0) + 1
  })
  const topIssues = Object.entries(issueCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)

  // Specialization (most common product area)
  const specialization = mode(agentCalls.map(c => c.productArea))

  // Recent calls (last 5)
  const recentCalls = [...agentCalls].slice(-5).reverse()

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeAgent}
        style={{
          position:   'fixed',
          inset:      0,
          background: 'rgba(0,0,0,0.35)',
          zIndex:     1000,
          opacity:    isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.2s ease',
        }}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={agentName ? `Agent profile: ${agentName}` : 'Agent profile'}
        style={{
          position:   'fixed',
          top:        0,
          right:      0,
          bottom:     0,
          width:      '360px',
          zIndex:     1001,
          transform:  isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.25s cubic-bezier(0.215, 0.61, 0.355, 1)',
          background: 'var(--chakra-colors-bg-panel)',
          borderLeft: '1px solid var(--chakra-colors-border-subtle)',
          display:    'flex',
          flexDirection: 'column',
          overflowY:  'auto',
        }}
      >
        {agentName && total > 0 && (
          <Stack gap={0} pb={6}>

            {/* ── Header ─────────────────────────────────────────── */}
            <Box px={5} pt={5} pb={4}>
              <Flex align="flex-start" justify="space-between" mb={4}>
                <Box />
                <Box
                  as="button"
                  onClick={closeAgent}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  w="28px" h="28px"
                  rounded="sm"
                  color="var(--chakra-colors-fg-muted)"
                  bg="transparent"
                  border="none"
                  cursor="pointer"
                  _hover={{ bg: 'var(--chakra-colors-bg-subtle)', color: 'var(--chakra-colors-fg-default)' }}
                >
                  <CloseIcon />
                </Box>
              </Flex>

              <Flex align="center" gap={3} mb={1}>
                <Flex
                  w="44px" h="44px" rounded="full" flexShrink={0}
                  bg="var(--chakra-colors-blue-200)"
                  color="var(--chakra-colors-blue-800)"
                  align="center" justify="center"
                  fontSize="14px" fontWeight="bold"
                >
                  {initials(agentName)}
                </Flex>
                <Box>
                  <Text fontSize="lg" fontWeight="semibold" color="var(--chakra-colors-fg-default)" lineHeight="tight">
                    {agentName}
                  </Text>
                  {specialization && (
                    <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">{specialization}</Text>
                  )}
                </Box>
              </Flex>

              <Link
                href={`/search?q=${encodeURIComponent(agentName)}`}
                style={{ textDecoration: 'none' }}
                onClick={closeAgent}
              >
                <Flex align="center" gap={1} mt={2} w="fit-content">
                  <Text fontSize="xs" color="var(--chakra-colors-blue-600)"
                    _hover={{ textDecoration: 'underline' }}>
                    View all {total} call{total !== 1 ? 's' : ''}
                  </Text>
                  <Box color="var(--chakra-colors-blue-600)"><ArrowIcon /></Box>
                </Flex>
              </Link>
            </Box>

            {/* ── Key stats ──────────────────────────────────────── */}
            <Box px={5} pb={4}>
              <Flex gap={2} mb={2}>
                <StatCell
                  label="CSAT Score"
                  value={csatScore.toFixed(1)}
                  sub={`/ 5.0 · team ${teamCsat.toFixed(1)}`}
                  danger={csatScore < teamCsat - 0.4}
                />
                <StatCell
                  label="Avg QA Score"
                  value={avgQa}
                  sub={`/ 100 · ${qaDiff >= 0 ? '+' : ''}${qaDiff} vs team`}
                  danger={qaDiff < -8}
                />
              </Flex>
              <Flex gap={2}>
                <StatCell
                  label="Flagged Rate"
                  value={`${flagRate}%`}
                  sub={`team avg ${teamFlagRate}%`}
                  danger={flagDanger}
                />
                <StatCell
                  label="Coaching Flags"
                  value={coachingCnt}
                  sub={`${escalated} escalated · ${churnHigh} churn↑`}
                  danger={coachingCnt > 3}
                />
              </Flex>
            </Box>

            {/* ── Customer sentiment ─────────────────────────────── */}
            <Box px={5} pb={4}>
              <SectionDivider label="Customer Sentiment" />
              <Stack gap={3}>
                <SentimentRow label="Positive" count={posCount} total={total} palette="green" tags={posTags} />
                <SentimentRow label="Neutral"  count={neuCount} total={total} palette="gray"  tags={neuTags} />
                <SentimentRow label="Negative" count={negCount} total={total} palette="red"   tags={negTags} />
              </Stack>
            </Box>

            {/* ── QA score vs team ───────────────────────────────── */}
            <Box px={5} pb={4}>
              <SectionDivider label="QA Score vs Team" />
              <Flex align="center" gap={2} mb={1}>
                <Box flex={1} h="8px" bg="var(--chakra-colors-bg-subtle)" rounded="full" overflow="hidden"
                  borderWidth="1px" borderColor="var(--chakra-colors-border-subtle)">
                  <Box
                    h="full" rounded="full"
                    style={{
                      width: `${avgQa}%`,
                      background: qaDiff < -8 ? 'var(--chakra-colors-red-400)' : qaDiff > 8 ? 'var(--chakra-colors-green-400)' : 'var(--chakra-colors-blue-400)',
                      transition: 'width 0.7s cubic-bezier(0.215,0.61,0.355,1)',
                    }}
                  />
                </Box>
                <Text fontSize="sm" fontWeight="bold"
                  color={qaDiff < -8 ? 'var(--chakra-colors-red-700)' : qaDiff > 8 ? 'var(--chakra-colors-green-700)' : 'var(--chakra-colors-fg-default)'}>
                  {avgQa}
                </Text>
              </Flex>
              <Flex align="center" gap={1}>
                <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">Team avg: {teamAvgQa}</Text>
                {qaDiff !== 0 && (
                  <Text fontSize="xs" fontWeight="semibold"
                    color={qaDiff < 0 ? 'var(--chakra-colors-red-600)' : 'var(--chakra-colors-green-600)'}>
                    ({qaDiff > 0 ? '+' : ''}{qaDiff})
                  </Text>
                )}
              </Flex>
            </Box>

            {/* ── Flag breakdown ─────────────────────────────────── */}
            {Object.values(flagCounts).some(v => v > 0) && (
              <Box px={5} pb={4}>
                <SectionDivider label="Flag Breakdown" />
                <Stack gap={2}>
                  {allFlagKeys.map(k => (
                    <FlagRow
                      key={k}
                      label={FLAG_LABEL[k]}
                      count={flagCounts[k]}
                      max={maxFlagCount}
                      palette={FLAG_PALETTE[k]}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            {/* ── Top issue areas ────────────────────────────────── */}
            {topIssues.length > 0 && (
              <Box px={5} pb={4}>
                <SectionDivider label="Top Issue Areas" />
                <Stack gap={1.5}>
                  {topIssues.map(([cat, cnt]) => (
                    <Flex key={cat} align="center" justify="space-between"
                      bg="var(--chakra-colors-bg-subtle)"
                      borderWidth="1px" borderColor="var(--chakra-colors-border-subtle)"
                      rounded="md" px={3} py={2}
                    >
                      <Text fontSize="xs" color="var(--chakra-colors-fg-default)"
                        style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      >
                        {cat}
                      </Text>
                      <Text fontSize="xs" fontWeight="semibold" color="var(--chakra-colors-fg-muted)"
                        ml={2} flexShrink={0}>
                        {cnt}
                      </Text>
                    </Flex>
                  ))}
                </Stack>
              </Box>
            )}

            {/* ── Recent calls ───────────────────────────────────── */}
            {recentCalls.length > 0 && (
              <Box px={5}>
                <SectionDivider label="Recent Calls" />
                <Stack gap={2}>
                  {recentCalls.map(call => (
                    <Link
                      key={call.id}
                      href={`/transcripts/${call.id}`}
                      style={{ textDecoration: 'none' }}
                      onClick={closeAgent}
                    >
                      <Box
                        borderWidth="1px" borderColor="var(--chakra-colors-border-subtle)"
                        bg="var(--chakra-colors-bg-subtle)"
                        rounded="md" px={3} py={2.5}
                        cursor="pointer"
                        transition="border-color 0.15s ease, background-color 0.15s ease"
                        _hover={{
                          borderColor: 'var(--chakra-colors-blue-300)',
                          bg:          'var(--chakra-colors-blue-50)',
                        }}
                      >
                        <Flex align="center" justify="space-between" mb={1}>
                          <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">{call.date}</Text>
                          <Flex gap={1.5}>
                            <Badge colorPalette={SEV_PALETTE[call.severity] ?? 'gray'}
                              variant="subtle" size="sm" rounded="sm" textTransform="capitalize">
                              {call.severity}
                            </Badge>
                            <Badge colorPalette={QA_PALETTE[call.qaStatus] ?? 'gray'}
                              variant="subtle" size="sm" rounded="sm" textTransform="capitalize">
                              {call.qaStatus}
                            </Badge>
                          </Flex>
                        </Flex>
                        <Text
                          fontSize="xs" fontWeight="medium" color="var(--chakra-colors-fg-default)"
                          lineHeight="snug"
                          overflow="hidden"
                          style={{ WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical' as const }}
                        >
                          {call.title}
                        </Text>
                        {call.flags.length > 0 && (
                          <Flex gap={1} mt={1.5} flexWrap="wrap">
                            {call.flags.slice(0, 3).map(f => (
                              <Badge key={f} colorPalette={FLAG_PALETTE[f] ?? 'gray'}
                                variant="outline" size="sm" rounded="sm">
                                {FLAG_LABEL[f] ?? f}
                              </Badge>
                            ))}
                          </Flex>
                        )}
                      </Box>
                    </Link>
                  ))}
                </Stack>
              </Box>
            )}

          </Stack>
        )}

        {/* Empty / loading state */}
        {agentName && total === 0 && (
          <Flex flex={1} align="center" justify="center" px={6}>
            <Text fontSize="sm" color="var(--chakra-colors-fg-muted)" textAlign="center">
              No call data found for {agentName}.
            </Text>
          </Flex>
        )}
      </div>
    </>
  )
}
