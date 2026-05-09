'use client'

import { useState } from 'react'
import { Badge, Box, Flex, Grid, Stack, Text } from '@chakra-ui/react'
import Link from 'next/link'
import type { CallDetailData } from '@/lib/types'
import { SeverityBadge, FlagBadge } from '@/components/shared/Badges'
import { AiSummaryCard } from './AiSummaryCard'
import { KeyMomentsPanel } from './KeyMomentsPanel'
import { TranscriptViewer } from './TranscriptViewer'
import { CallMetadata } from './CallMetadata'

export default function CallDetail({ call }: { call: CallDetailData }) {
  const [activeLineIndex, setActiveLineIndex] = useState<number | null>(null)

  function handleKeyMomentSelect(lineIndex: number) {
    setActiveLineIndex(lineIndex === activeLineIndex ? null : lineIndex)
  }

  return (
    <Box>
      {/* ── Sticky header ──────────────────────────────────────────────── */}
      <Flex
        px={6}
        py={3}
        bg="var(--chakra-colors-bg-panel)"
        borderBottomWidth="1px"
        borderColor="var(--chakra-colors-border-subtle)"
        align="center"
        gap={3}
        position="sticky"
        top={0}
        zIndex={10}
        flexWrap="wrap"
      >
        <Link href="/search">
          <Text fontSize="sm" color="var(--chakra-colors-blue-600)" _hover={{ textDecoration: 'underline' }}>
            ← Search
          </Text>
        </Link>
        <Text color="var(--chakra-colors-fg-subtle)">·</Text>
        <Link href="/transcripts">
          <Text fontSize="sm" color="var(--chakra-colors-blue-600)" _hover={{ textDecoration: 'underline' }}>
            Transcripts
          </Text>
        </Link>
        <Text color="var(--chakra-colors-fg-subtle)">·</Text>
        <Text fontSize="sm" fontWeight="medium" color="var(--chakra-colors-fg-default)" flex={1} style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {call.title}
        </Text>
        <Flex align="center" gap={2} flexShrink={0}>
          <SeverityBadge severity={call.severity} />
          {call.flags.slice(0, 2).map(f => <FlagBadge key={f} flag={f} />)}
        </Flex>
      </Flex>

      {/* ── Page header ──────────────────────────────────────────────── */}
      <Box
        px={6}
        py={4}
        borderBottomWidth="1px"
        borderColor="var(--chakra-colors-border-subtle)"
        bg="var(--chakra-colors-bg-subtle)"
      >
        <Text fontSize="lg" fontWeight="semibold" color="var(--chakra-colors-fg-default)" mb={2} lineHeight="snug">
          {call.title}
        </Text>
        <Flex align="center" gap={3} flexWrap="wrap">
          <Flex align="center" gap={1}>
            <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">Account:</Text>
            <Text fontSize="xs" fontWeight="medium" color="var(--chakra-colors-fg-default)">{call.accountName}</Text>
          </Flex>
          <Text fontSize="xs" color="var(--chakra-colors-fg-subtle)">·</Text>
          <Flex align="center" gap={1}>
            <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">Customer:</Text>
            <Text fontSize="xs" fontWeight="medium" color="var(--chakra-colors-fg-default)">{call.customerName}</Text>
          </Flex>
          <Text fontSize="xs" color="var(--chakra-colors-fg-subtle)">·</Text>
          <Flex align="center" gap={1}>
            <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">Agent:</Text>
            <Text fontSize="xs" fontWeight="medium" color="var(--chakra-colors-fg-default)">{call.agentName}</Text>
          </Flex>
          <Text fontSize="xs" color="var(--chakra-colors-fg-subtle)">·</Text>
          <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">{call.date} at {call.time}</Text>
          <Text fontSize="xs" color="var(--chakra-colors-fg-subtle)">·</Text>
          <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">{call.region}</Text>
          <Text fontSize="xs" color="var(--chakra-colors-fg-subtle)">·</Text>
          <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">{call.duration}</Text>
        </Flex>
        {call.topics.length > 0 && (
          <Flex gap={1.5} mt={2} flexWrap="wrap">
            {call.topics.map(t => (
              <Badge key={t} colorPalette="blue" variant="subtle" size="sm" rounded="sm">{t}</Badge>
            ))}
          </Flex>
        )}
      </Box>

      {/* ── Two-column layout ────────────────────────────────────────── */}
      <Grid templateColumns="1fr 320px" gap={5} px={6} py={5} maxW="1400px">
        {/* Left column */}
        <Stack gap={0}>
          <AiSummaryCard call={call} />
          <KeyMomentsPanel
            keyMoments={call.keyMoments}
            activeLineIndex={activeLineIndex}
            onSelect={handleKeyMomentSelect}
          />
          <TranscriptViewer
            lines={call.lines}
            highlightedLines={call.highlightedLines}
            activeLineIndex={activeLineIndex}
            onLineClick={handleKeyMomentSelect}
          />
        </Stack>

        {/* Right column — metadata + actions */}
        <Box>
          <CallMetadata call={call} />
        </Box>
      </Grid>
    </Box>
  )
}
