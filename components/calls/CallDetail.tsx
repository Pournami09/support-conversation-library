'use client'

import { useState } from 'react'
import { Badge, Box, Button, Flex, Text } from '@chakra-ui/react'
import Link from 'next/link'
import type { CallDetailData, SeverityLevel } from '@/lib/types'
import { EvidencePanel } from './EvidencePanel'
import { TranscriptPanel } from './TranscriptPanel'

// ── SVG icons ─────────────────────────────────────────────────────────────

function SvgWrap({ size = 14, children }: { size?: number; children: React.ReactNode }) {
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
function ChevronLeft()  { return <SvgWrap><polyline points="15 18 9 12 15 6" /></SvgWrap> }
function ChevronRight() { return <SvgWrap><polyline points="9 18 15 12 9 6" /></SvgWrap> }
function BookmarkIcon() { return <SvgWrap><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></SvgWrap> }
function ShareIcon() {
  return (
    <SvgWrap>
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </SvgWrap>
  )
}
function FlagIcon() {
  return (
    <SvgWrap>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </SvgWrap>
  )
}
function UserCheckIcon() {
  return (
    <SvgWrap>
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <polyline points="17 11 19 13 23 9" />
    </SvgWrap>
  )
}
function ClipboardIcon() {
  return (
    <SvgWrap>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </SvgWrap>
  )
}

// ── Palette constants ──────────────────────────────────────────────────────

const SEVERITY_PALETTE: Record<SeverityLevel, string> = {
  critical: 'red',
  high: 'orange',
  medium: 'yellow',
  low: 'gray',
}
const FLAG_PALETTE: Record<string, string> = {
  'escalation': 'red',
  'churn-risk': 'orange',
  'product-bug': 'gray',
  'policy-concern': 'yellow',
  'coaching-opportunity': 'blue',
}
const FLAG_LABEL: Record<string, string> = {
  'escalation': 'Escalation',
  'churn-risk': 'Churn Risk',
  'product-bug': 'Product Bug',
  'policy-concern': 'Policy Concern',
  'coaching-opportunity': 'Coaching',
}
const ACCOUNT_TIER: Record<SeverityLevel, string> = {
  critical: 'Enterprise',
  high: 'Professional',
  medium: 'Business',
  low: 'Starter',
}

// ── Strip helpers ──────────────────────────────────────────────────────────

function MetaChip({ label, value }: { label: string; value: string }) {
  return (
    <Flex align="center" gap={1.5} px={3} py={2.5} flexShrink={0}>
      <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">{label}</Text>
      <Text fontSize="xs" fontWeight="medium" color="var(--chakra-colors-fg-default)">{value}</Text>
    </Flex>
  )
}
function StripSep() {
  return <Box w="1px" h="14px" bg="var(--chakra-colors-border-subtle)" flexShrink={0} alignSelf="center" />
}

// ── Component ─────────────────────────────────────────────────────────────

export default function CallDetail({ call }: { call: CallDetailData }) {
  const [activeLineIndex, setActiveLineIndex] = useState<number | null>(null)

  function handleMomentSelect(lineIndex: number) {
    setActiveLineIndex(prev => prev === lineIndex ? null : lineIndex)
  }

  const callRef = `CVR-2024-${call.id.padStart(5, '0')}`

  return (
    <Flex h="full" flexDirection="column" bg="var(--chakra-colors-bg-panel)" overflow="hidden">

      {/* ── Header: breadcrumbs + navigation ─────────────────────────── */}
      <Flex
        px={6} py={3}
        borderBottomWidth="1px"
        borderColor="var(--chakra-colors-border-subtle)"
        align="center"
        justify="space-between"
        bg="var(--chakra-colors-bg-panel)"
        flexShrink={0}
      >
        <Flex align="center" gap={1.5}>
          <Link href="/qa/queue">
            <Text fontSize="sm" color="var(--chakra-colors-fg-default)"
              _hover={{ color: 'var(--chakra-colors-blue-600)' }} cursor="pointer">
              Scoring Queue
            </Text>
          </Link>
          <Text fontSize="xs" color="var(--chakra-colors-fg-subtle)"><ChevronRight /></Text>
          <Link href="/search">
            <Text fontSize="sm" color="var(--chakra-colors-fg-default)"
              _hover={{ color: 'var(--chakra-colors-blue-600)' }} cursor="pointer">
              Search Results
            </Text>
          </Link>
          <Text fontSize="xs" color="var(--chakra-colors-fg-subtle)"><ChevronRight /></Text>
          <Text fontSize="sm" color="var(--chakra-colors-fg-muted)">{callRef}</Text>
        </Flex>

        <Flex align="center" gap={2}>
          <Button variant="outline" size="xs" rounded="sm" px={3} gap={1}>
            <ChevronLeft /> Prev
          </Button>
          <Button variant="outline" size="xs" rounded="sm" px={3} gap={1}>
            Next <ChevronRight />
          </Button>
          <Box w="1px" h="16px" bg="var(--chakra-colors-border-subtle)" flexShrink={0} />
          <Button variant="outline" size="xs" rounded="sm" px={3} gap={1.5}>
            <BookmarkIcon /> Save
          </Button>
          <Button variant="outline" size="xs" rounded="sm" px={3} gap={1.5}>
            <ShareIcon /> Share
          </Button>
        </Flex>
      </Flex>

      {/* ── Conversation details strip ────────────────────────────────── */}
      <Flex
        borderBottomWidth="1px"
        borderColor="var(--chakra-colors-border-subtle)"
        bg="var(--chakra-colors-bg-subtle)"
        flexShrink={0}
        align="center"
        overflowX="auto"
        flexWrap="nowrap"
      >
        <MetaChip label="Customer" value={call.customerName} />
        <StripSep />
        <MetaChip label="Agent" value={call.agentName} />
        <StripSep />
        <MetaChip label="Account" value={call.accountName} />
        <StripSep />
        <MetaChip label="Date" value={`${call.date} · ${call.time}`} />
        <StripSep />
        <MetaChip label="Duration" value={call.duration} />
        <StripSep />
        <Flex align="center" gap={1.5} px={3} py={2.5} flexShrink={0}>
          <Badge
            colorPalette="blue"
            variant="subtle" size="sm" rounded="sm"
          >
            {ACCOUNT_TIER[call.severity]}
          </Badge>
        </Flex>
        <StripSep />
        <Flex align="center" gap={1.5} px={3} py={2.5} flexShrink={0}>
          <Badge
            colorPalette={SEVERITY_PALETTE[call.severity]}
            variant="subtle" size="sm" rounded="sm"
            textTransform="capitalize"
          >
            {call.severity}
          </Badge>
        </Flex>
        {call.flags.map(f => (
          <Box key={f} px={2} py={2.5} flexShrink={0}>
            <Badge
              colorPalette={FLAG_PALETTE[f] ?? 'gray'}
              variant="subtle" size="sm" rounded="sm"
            >
              {FLAG_LABEL[f] ?? f}
            </Badge>
          </Box>
        ))}
      </Flex>

      {/* ── Action bar ────────────────────────────────────────────────── */}
      <Flex
        px={3} py={2}
        borderBottomWidth="1px"
        borderColor="var(--chakra-colors-border-subtle)"
        align="center"
        gap={2}
        bg="var(--chakra-colors-bg-panel)"
        flexShrink={0}
      >
        <Button variant="outline" size="sm" rounded="sm" flex={1} gap={1.5}>
          <FlagIcon /> Flag Review
        </Button>
        <Button variant="outline" size="sm" rounded="sm" flex={1} gap={1.5}>
          <UserCheckIcon /> Assign Coaching
        </Button>
        <Button variant="outline" size="sm" rounded="sm" gap={1.5}>
          <ClipboardIcon /> Copy Evidence Link
        </Button>
        <Button colorPalette="blue" size="sm" rounded="sm" gap={1.5}>
          <BookmarkIcon /> Add to Collection
        </Button>
      </Flex>

      {/* ── Split pane ────────────────────────────────────────────────── */}
      <Flex flex={1} overflow="hidden">
        <Box
          flex={1}
          overflowY="auto"
          borderRightWidth="1px"
          borderColor="var(--chakra-colors-border-subtle)"
        >
          <EvidencePanel
            call={call}
            activeLineIndex={activeLineIndex}
            onMomentSelect={handleMomentSelect}
          />
        </Box>

        <Box flex={1} overflowY="auto">
          <TranscriptPanel
            call={call}
            activeLineIndex={activeLineIndex}
            onLineClick={handleMomentSelect}
          />
        </Box>
      </Flex>
    </Flex>
  )
}
