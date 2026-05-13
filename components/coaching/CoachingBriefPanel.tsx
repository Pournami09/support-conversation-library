'use client'

import { useState } from 'react'
import { Badge, Box, Flex, Stack, Text, Textarea } from '@chakra-ui/react'
import type { CallDetailData } from '@/lib/types'

// ── Icons ──────────────────────────────────────────────────────────────────

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
function ChevronDown({ open }: { open: boolean }) {
  return (
    <Ico>
      <polyline points={open ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
    </Ico>
  )
}
function CopyIcon() {
  return (
    <Ico size={13}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </Ico>
  )
}
function CheckIcon() {
  return <Ico size={13}><polyline points="20 6 9 17 4 12"/></Ico>
}
function SparklesIcon() {
  return <Ico size={13}><path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z"/></Ico>
}

// ── Helpers ────────────────────────────────────────────────────────────────

function coachingPoint(call: CallDetailData): string {
  const cat = call.issueCategory.toLowerCase()
  if (call.flags.includes('policy-concern'))
    return `Policy protocol not followed — review SOP for ${call.issueCategory} handling`
  if (call.flags.includes('escalation') && call.escalationStatus !== 'escalated')
    return `Escalation signal present but not escalated — missed opportunity to involve T2`
  if (call.flags.includes('churn-risk') && call.sentiment === 'negative')
    return `High churn-risk customer left dissatisfied — retention offer or save attempt not attempted`
  if (cat.includes('billing'))
    return `Billing dispute handling — missed opportunity to proactively offer refund or ticket reference`
  if (cat.includes('cancell'))
    return `Cancellation call — save attempt script not used or retention offer not made`
  if (cat.includes('onboard'))
    return `Onboarding friction — customer struggled with setup, agent could have offered guided walkthrough`
  if (call.sentiment === 'negative' && call.qaStatus === 'flagged')
    return `Customer dissatisfaction unresolved — call ended negatively without clear next steps given`
  return `Quality flag raised — review call for coaching opportunities in ${call.issueCategory}`
}

function coachingOutcome(call: CallDetailData): string {
  if (call.resolutionOutcome.toLowerCase().includes('partial')) return 'Partial resolution — follow-up required'
  if (call.resolutionOutcome.toLowerCase().includes('escalat')) return 'Escalated to T2'
  if (call.resolutionOutcome.toLowerCase().includes('unresolved')) return 'Unresolved — customer left dissatisfied'
  return call.resolutionOutcome.length > 80
    ? call.resolutionOutcome.substring(0, 80) + '…'
    : call.resolutionOutcome
}

function buildBriefText(calls: CallDetailData[]): string {
  const lines: string[] = [
    '--- COACHING BRIEF ---',
    `Generated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
    `Calls reviewed: ${calls.length}`,
    '',
  ]

  calls.forEach((call, i) => {
    lines.push(`${i + 1}. ${call.agentName} — ${call.date}`)
    lines.push(`   Call: ${call.title}`)
    lines.push(`   Customer: ${call.customerName} (${call.accountName})`)
    lines.push(`   Outcome: ${coachingOutcome(call)}`)
    lines.push(`   Coaching focus: ${coachingPoint(call)}`)
    if (call.notableFlags.length > 0) {
      lines.push(`   Notable: ${call.notableFlags[0]}`)
    }
    lines.push('')
  })

  lines.push('Action items:')
  calls.forEach((call, i) => {
    lines.push(`  ${i + 1}. 1:1 with ${call.agentName} — address: ${coachingPoint(call).split('—')[0].trim()}`)
  })

  return lines.join('\n')
}

// ── Component ──────────────────────────────────────────────────────────────

interface CoachingBriefPanelProps {
  calls: CallDetailData[]
}

export function CoachingBriefPanel({ calls }: CoachingBriefPanelProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const top3 = calls.slice(0, 3)
  const briefText = buildBriefText(top3)

  function handleCopy() {
    navigator.clipboard.writeText(briefText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <Box
      borderWidth="1px"
      borderColor="var(--chakra-colors-border-subtle)"
      bg="var(--chakra-colors-bg-panel)"
      rounded="md"
      mb={6}
      overflow="hidden"
    >
      {/* ── Header / toggle ────────────────────────────────────────── */}
      <Flex
        as="button"
        w="full"
        align="center"
        justify="space-between"
        px={4}
        py={3}
        cursor="pointer"
        bg={open ? 'var(--chakra-colors-blue-50)' : 'var(--chakra-colors-bg-panel)'}
        borderBottomWidth={open ? '1px' : '0'}
        borderColor="var(--chakra-colors-border-subtle)"
        _hover={{ bg: open ? 'var(--chakra-colors-blue-50)' : 'var(--chakra-colors-bg-subtle)' }}
        transition="background-color 0.15s ease"
        onClick={() => setOpen(p => !p)}
        aria-expanded={open}
      >
        <Flex align="center" gap={2}>
          <Box color="var(--chakra-colors-blue-500)"><SparklesIcon /></Box>
          <Text fontSize="sm" fontWeight="semibold" color="var(--chakra-colors-fg-default)">
            Generate Coaching Brief
          </Text>
          <Badge colorPalette="blue" variant="subtle" size="sm" rounded="sm">
            Top {Math.min(top3.length, 3)} calls
          </Badge>
        </Flex>
        <Box color="var(--chakra-colors-fg-muted)">
          <ChevronDown open={open} />
        </Box>
      </Flex>

      {/* ── Body ───────────────────────────────────────────────────── */}
      {open && (
        <Box px={4} py={4}>
          {top3.length === 0 ? (
            <Text fontSize="sm" color="var(--chakra-colors-fg-muted)">No coaching calls in queue.</Text>
          ) : (
            <>
              {/* Call cards */}
              <Stack gap={3} mb={4}>
                {top3.map((call, i) => (
                  <Box
                    key={call.id}
                    borderWidth="1px"
                    borderColor="var(--chakra-colors-border-subtle)"
                    bg="var(--chakra-colors-bg-subtle)"
                    rounded="md"
                    px={4}
                    py={3}
                  >
                    <Flex align="center" justify="space-between" mb={1.5}>
                      <Flex align="center" gap={2}>
                        <Flex
                          w="20px" h="20px" rounded="full" flexShrink={0}
                          bg="var(--chakra-colors-blue-200)"
                          color="var(--chakra-colors-blue-800)"
                          align="center" justify="center"
                          fontSize="8px" fontWeight="bold"
                        >
                          {i + 1}
                        </Flex>
                        <Text fontSize="xs" fontWeight="semibold" color="var(--chakra-colors-fg-default)">
                          {call.agentName}
                        </Text>
                        <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">·</Text>
                        <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">{call.date}</Text>
                      </Flex>
                      <a
                        href={`/transcripts/${call.id}`}
                        style={{ fontSize: '0.75rem', color: 'var(--chakra-colors-blue-600)', textDecoration: 'none' }}
                        onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                        onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
                      >
                        View call →
                      </a>
                    </Flex>

                    <Text
                      fontSize="xs" color="var(--chakra-colors-fg-default)" fontWeight="medium" mb={1}
                      overflow="hidden"
                      style={{ WebkitLineClamp: 1, display: '-webkit-box', WebkitBoxOrient: 'vertical' as const }}
                    >
                      {call.title}
                    </Text>

                    <Box
                      bg="var(--chakra-colors-orange-50)"
                      borderWidth="1px"
                      borderColor="var(--chakra-colors-orange-200)"
                      rounded="sm"
                      px={3}
                      py={2}
                      mt={1.5}
                    >
                      <Text fontSize="xs" fontWeight="semibold" color="var(--chakra-colors-orange-700)" mb={0.5}>
                        Coaching focus
                      </Text>
                      <Text fontSize="xs" color="var(--chakra-colors-fg-default)" lineHeight="tall">
                        {coachingPoint(call)}
                      </Text>
                    </Box>

                    <Text fontSize="xs" color="var(--chakra-colors-fg-muted)" mt={1.5}>
                      Outcome: {coachingOutcome(call)}
                    </Text>
                  </Box>
                ))}
              </Stack>

              {/* Copyable brief text */}
              <Box mb={3}>
                <Text fontSize="xs" fontWeight="semibold" color="var(--chakra-colors-fg-muted)" mb={1.5}>
                  Brief (copy for team lead)
                </Text>
                <Textarea
                  value={briefText}
                  readOnly
                  size="sm"
                  minH="160px"
                  rounded="sm"
                  fontSize="xs"
                  fontFamily="mono"
                  resize="vertical"
                  bg="var(--chakra-colors-bg-subtle)"
                  color="var(--chakra-colors-fg-default)"
                  borderColor="var(--chakra-colors-border-subtle)"
                />
              </Box>

              <Box
                as="button"
                display="flex"
                alignItems="center"
                gap="6px"
                px={3}
                py="6px"
                borderWidth="1px"
                borderColor={copied ? 'var(--chakra-colors-green-300)' : 'var(--chakra-colors-border-subtle)'}
                bg={copied ? 'var(--chakra-colors-green-50)' : 'var(--chakra-colors-bg-panel)'}
                rounded="sm"
                fontSize="xs"
                fontWeight="medium"
                color={copied ? 'var(--chakra-colors-green-700)' : 'var(--chakra-colors-fg-default)'}
                cursor="pointer"
                transition="all 0.15s ease"
                onClick={handleCopy}
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
                {copied ? 'Copied!' : 'Copy brief'}
              </Box>
            </>
          )}
        </Box>
      )}
    </Box>
  )
}
