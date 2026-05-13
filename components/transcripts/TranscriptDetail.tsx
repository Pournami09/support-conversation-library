'use client'

import { useState, useCallback, useEffect } from 'react'
import {
  Badge, Box, Button, CloseButton, Dialog,
  Flex, Grid, Portal, Stack, Text,
} from '@chakra-ui/react'
// Grid kept for the two-column page layout below
import Link from 'next/link'
import type { TranscriptWithLines } from '@/lib/types'

// ── Metadata card ─────────────────────────────────────────────────────────

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <Box px={4} py={3} flexShrink={0}>
      <Text fontSize="10px" fontWeight="600" letterSpacing="0.07em" textTransform="uppercase"
        color="var(--chakra-colors-fg-muted)" mb={0.5}>
        {label}
      </Text>
      <Text fontSize="sm" fontWeight="medium" color="var(--chakra-colors-fg-default)" whiteSpace="nowrap">
        {value}
      </Text>
    </Box>
  )
}

function VSep() {
  return (
    <Box
      alignSelf="stretch"
      w="1px"
      my={2}
      bg="var(--chakra-colors-border-subtle)"
      flexShrink={0}
    />
  )
}

function MetadataCard({ transcript }: { transcript: TranscriptWithLines }) {
  return (
    <Box
      bg="var(--chakra-colors-bg-panel)"
      borderWidth="1px"
      borderColor="var(--chakra-colors-border-subtle)"
      rounded="sm"
      overflow="hidden"
      mb={4}
    >
      {/* Primary row: people + account */}
      <Flex
        align="stretch"
        borderBottomWidth="1px"
        borderColor="var(--chakra-colors-border-subtle)"
        flexWrap="wrap"
      >
        <MetaItem label="Agent"    value={transcript.agentName} />
        <VSep />
        <MetaItem label="Customer" value={transcript.customerName} />
        <VSep />
        <MetaItem label="Account"  value={transcript.accountName} />
        <VSep />
        <MetaItem label="Region"   value={transcript.region} />
      </Flex>

      {/* Secondary row: temporal + tags */}
      <Flex
        align="center"
        bg="var(--chakra-colors-bg-subtle)"
        flexWrap="wrap"
        minH="40px"
      >
        <Flex align="stretch" flexShrink={0}>
          <Box px={4} py={2.5} flexShrink={0}>
            <Flex align="center" gap={1.5}>
              <Text fontSize="xs" color="var(--chakra-colors-fg-muted)" fontWeight="medium">
                {transcript.date}
              </Text>
              <Text fontSize="xs" color="var(--chakra-colors-fg-subtle)">·</Text>
              <Text fontSize="xs" color="var(--chakra-colors-fg-muted)" fontWeight="medium">
                {transcript.time}
              </Text>
              <Text fontSize="xs" color="var(--chakra-colors-fg-subtle)">·</Text>
              <Text fontSize="xs" color="var(--chakra-colors-fg-muted)" fontWeight="medium">
                {transcript.duration}
              </Text>
            </Flex>
          </Box>
        </Flex>

        {transcript.tags.length > 0 && (
          <>
            <Box alignSelf="stretch" w="1px" my={1.5} bg="var(--chakra-colors-border-subtle)" flexShrink={0} />
            <Flex gap={1.5} px={4} py={2.5} flexWrap="wrap" align="center">
              {transcript.tags.map(tag => (
                <Badge key={tag} colorPalette="blue" variant="subtle" size="sm" rounded="sm">{tag}</Badge>
              ))}
            </Flex>
          </>
        )}
      </Flex>
    </Box>
  )
}

// ── Highlight modal ────────────────────────────────────────────────────────

function HighlightModal({ open, text, onClose }: { open: boolean; text: string; onClose: () => void }) {
  return (
    <Dialog.Root open={open} onOpenChange={({ open }) => { if (!open) onClose() }} size="md">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content rounded="sm">
            <Dialog.Header
              borderBottomWidth="1px"
              borderColor="var(--chakra-colors-border-subtle)"
              pb={3}
            >
              <Dialog.Title fontSize="sm" fontWeight="semibold" color="var(--chakra-colors-fg-default)">
                Selected Text
              </Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>
            <Dialog.Body py={4}>
              <Box
                bg="var(--chakra-colors-bg-subtle)"
                borderWidth="1px"
                borderColor="var(--chakra-colors-border-subtle)"
                borderLeftWidth="3px"
                borderLeftColor="var(--chakra-colors-blue-500)"
                rounded="sm"
                px={4}
                py={3}
                mb={4}
              >
                <Text fontSize="sm" color="var(--chakra-colors-fg-default)" fontStyle="italic">
                  "{text}"
                </Text>
              </Box>
              <Stack gap={2}>
                <Text fontSize="xs" fontWeight="semibold" letterSpacing="wider" textTransform="uppercase" color="var(--chakra-colors-fg-muted)">
                  Actions
                </Text>
                <Flex gap={2}>
                  <Button
                    size="sm" colorPalette="blue" variant="subtle" rounded="sm"
                    transition="transform 0.1s ease-out, background-color 0.15s ease"
                    _active={{ transform: 'scale(0.97)' }}
                  >
                    Add annotation
                  </Button>
                  <Button
                    size="sm" variant="outline" rounded="sm"
                    transition="transform 0.1s ease-out, background-color 0.15s ease"
                    _active={{ transform: 'scale(0.97)' }}
                    onClick={() => navigator.clipboard.writeText(text)}
                  >
                    Copy
                  </Button>
                  <Button
                    size="sm" colorPalette="orange" variant="subtle" rounded="sm"
                    transition="transform 0.1s ease-out, background-color 0.15s ease"
                    _active={{ transform: 'scale(0.97)' }}
                  >
                    Flag for review
                  </Button>
                </Flex>
              </Stack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

// ── Transcript viewer ─────────────────────────────────────────────────────

function TranscriptViewer({ lines }: { lines: TranscriptWithLines['lines'] }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedText, setSelectedText] = useState('')

  const handleMouseUp = useCallback(() => {
    const text = window.getSelection()?.toString().trim()
    if (text) {
      setSelectedText(text)
      setModalOpen(true)
    }
  }, [])

  return (
    <>
      <Box
        bg="var(--chakra-colors-bg-panel)"
        borderWidth="1px"
        borderColor="var(--chakra-colors-border-subtle)"
        rounded="sm"
        overflow="hidden"
      >
        <Box
          px={4}
          py={3}
          borderBottomWidth="1px"
          borderColor="var(--chakra-colors-border-subtle)"
          bg="var(--chakra-colors-bg-subtle)"
        >
          <Flex align="center" justify="space-between">
            <Text fontSize="xs" fontWeight="semibold" letterSpacing="wider" textTransform="uppercase" color="var(--chakra-colors-fg-muted)">
              Transcript
            </Text>
            <Text fontSize="xs" color="var(--chakra-colors-fg-subtle)">
              Select any text to annotate
            </Text>
          </Flex>
        </Box>
        <Stack gap={0} onMouseUp={handleMouseUp} userSelect="text" cursor="text">
          {lines.map((line, i) => (
            <Flex
              key={i}
              gap={4}
              px={4}
              py={3}
              borderBottomWidth={i < lines.length - 1 ? '1px' : '0'}
              borderColor="var(--chakra-colors-border-subtle)"
              _hover={{ bg: 'var(--chakra-colors-bg-subtle)' }}
              transition="background-color 0.15s ease"
              align="flex-start"
            >
              <Text
                fontSize="xs"
                color="var(--chakra-colors-fg-muted)"
                fontFamily="mono"
                flexShrink={0}
                mt="2px"
                w="36px"
              >
                {line.timestamp}
              </Text>
              <Box flexShrink={0} w="72px">
                <Badge
                  size="sm"
                  colorPalette={line.speaker === 'Agent' ? 'blue' : 'gray'}
                  variant={line.speaker === 'Agent' ? 'subtle' : 'outline'}
                  rounded="sm"
                >
                  {line.speaker}
                </Badge>
              </Box>
              <Text fontSize="sm" color="var(--chakra-colors-fg-default)" lineHeight="tall">
                {line.text}
              </Text>
            </Flex>
          ))}
        </Stack>
      </Box>

      <HighlightModal
        open={modalOpen}
        text={selectedText}
        onClose={() => { setModalOpen(false); setSelectedText('') }}
      />
    </>
  )
}

// ── Animated sentiment bar ────────────────────────────────────────────────
// Starts at 0 on mount, transitions to the real value — ease-out-cubic, 600ms.
// Seen once per transcript load, so the entrance animation adds value.

function AnimatedBar({ value, color }: { value: number; color: string }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const id = requestAnimationFrame(() => setWidth(value))
    return () => cancelAnimationFrame(id)
  }, [value])

  return (
    <Box
      h="full"
      rounded="full"
      style={{
        width: `${width}%`,
        background: color,
        transition: 'width 0.6s cubic-bezier(0.215, 0.61, 0.355, 1)',
      }}
    />
  )
}

// ── AI suggestions panel ──────────────────────────────────────────────────

function AiPanel() {
  const topics = ['Billing dispute', 'Refund request', 'Account verification', 'Storage upgrade']
  const actions = [
    'Follow up with customer within 48 hours',
    'Verify upgrade authorisation with account admin',
    'Process refund if charge is confirmed unauthorised',
  ]

  return (
    <Stack gap={4}>
      <Box
        bg="var(--chakra-colors-bg-panel)"
        borderWidth="1px"
        borderColor="var(--chakra-colors-border-subtle)"
        rounded="sm"
        overflow="hidden"
      >
        <Box
          px={4} py={3}
          borderBottomWidth="1px"
          borderColor="var(--chakra-colors-border-subtle)"
          bg="var(--chakra-colors-bg-subtle)"
        >
          <Flex align="center" justify="space-between">
            <Flex align="center" gap={1.5}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--chakra-colors-fg-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M12 3 9 9 3 12l6 3 3 6 3-6 6-3-6-3z" />
              </svg>
              <Text fontSize="xs" fontWeight="semibold" letterSpacing="wider" textTransform="uppercase" color="var(--chakra-colors-fg-muted)">AI Summary</Text>
            </Flex>
            <Badge colorPalette="blue" variant="subtle" size="sm">Beta</Badge>
          </Flex>
        </Box>
        <Box px={4} py={3}>
          <Text fontSize="sm" color="var(--chakra-colors-fg-default)" lineHeight="tall">
            Customer called regarding an unrecognised charge on their invoice. Agent identified the charge as a storage upgrade and offered a refund pending internal verification. Call resolved with a follow-up action assigned.
          </Text>
        </Box>
      </Box>

      <Box
        bg="var(--chakra-colors-bg-panel)"
        borderWidth="1px"
        borderColor="var(--chakra-colors-border-subtle)"
        rounded="sm"
        overflow="hidden"
      >
        <Box
          px={4} py={3}
          borderBottomWidth="1px"
          borderColor="var(--chakra-colors-border-subtle)"
          bg="var(--chakra-colors-bg-subtle)"
        >
          <Text fontSize="xs" fontWeight="semibold" letterSpacing="wider" textTransform="uppercase" color="var(--chakra-colors-fg-muted)">Sentiment</Text>
        </Box>
        <Stack gap={3} px={4} py={3}>
          {[
            { label: 'Customer', value: 72, color: 'var(--chakra-colors-green-500)' },
            { label: 'Agent',    value: 88, color: 'var(--chakra-colors-blue-500)' },
          ].map(({ label, value, color }) => (
            <Box key={label}>
              <Flex justify="space-between" mb={1}>
                <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">{label}</Text>
                <Text fontSize="xs" fontWeight="medium" color="var(--chakra-colors-fg-default)">{value}%</Text>
              </Flex>
              <Box h="6px" bg="var(--chakra-colors-bg-subtle)" rounded="full" overflow="hidden">
                <AnimatedBar value={value} color={color} />
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>

      <Box
        bg="var(--chakra-colors-bg-panel)"
        borderWidth="1px"
        borderColor="var(--chakra-colors-border-subtle)"
        rounded="sm"
        overflow="hidden"
      >
        <Box
          px={4} py={3}
          borderBottomWidth="1px"
          borderColor="var(--chakra-colors-border-subtle)"
          bg="var(--chakra-colors-bg-subtle)"
        >
          <Text fontSize="xs" fontWeight="semibold" letterSpacing="wider" textTransform="uppercase" color="var(--chakra-colors-fg-muted)">Key Topics</Text>
        </Box>
        <Flex gap={2} flexWrap="wrap" px={4} py={3}>
          {topics.map(t => (
            <Badge key={t} colorPalette="blue" variant="subtle" size="sm" rounded="sm">{t}</Badge>
          ))}
        </Flex>
      </Box>

      <Box
        bg="var(--chakra-colors-bg-panel)"
        borderWidth="1px"
        borderColor="var(--chakra-colors-border-subtle)"
        rounded="sm"
        overflow="hidden"
      >
        <Box
          px={4} py={3}
          borderBottomWidth="1px"
          borderColor="var(--chakra-colors-border-subtle)"
          bg="var(--chakra-colors-bg-subtle)"
        >
          <Text fontSize="xs" fontWeight="semibold" letterSpacing="wider" textTransform="uppercase" color="var(--chakra-colors-fg-muted)">Action Items</Text>
        </Box>
        <Stack gap={0} px={4} py={2}>
          {actions.map((action, i) => (
            <Flex
              key={i}
              gap={2}
              py={2}
              align="flex-start"
              borderBottomWidth={i < actions.length - 1 ? '1px' : '0'}
              borderColor="var(--chakra-colors-border-subtle)"
            >
              <Box w="6px" h="6px" rounded="full" flexShrink={0} mt="5px" bg="var(--chakra-colors-blue-400)" />
              <Text fontSize="sm" color="var(--chakra-colors-fg-default)">{action}</Text>
            </Flex>
          ))}
        </Stack>
      </Box>
    </Stack>
  )
}

// ── Main export ───────────────────────────────────────────────────────────

export default function TranscriptDetail({ transcript }: { transcript: TranscriptWithLines }) {
  return (
    <Box>
      {/* Page header */}
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
      >
        <Link href="/transcripts">
          <Text fontSize="sm" color="var(--chakra-colors-blue-600)" _hover={{ textDecoration: 'underline' }}>
            ← Transcripts
          </Text>
        </Link>
        <Text color="var(--chakra-colors-fg-subtle)">·</Text>
        <Text fontSize="sm" fontWeight="medium" color="var(--chakra-colors-fg-default)">
          {transcript.customerName} · {transcript.accountName}
        </Text>
        <Text color="var(--chakra-colors-fg-subtle)">·</Text>
        <Text fontSize="sm" color="var(--chakra-colors-fg-muted)">
          {transcript.date} at {transcript.time}
        </Text>
      </Flex>

      {/* Two-column layout */}
      <Grid templateColumns="1fr 360px" gap={6} px={6} py={5} maxW="1400px" mx="auto">
        <Stack gap={0}>
          <MetadataCard transcript={transcript} />
          <TranscriptViewer lines={transcript.lines} />
        </Stack>
        <Box>
          <AiPanel />
        </Box>
      </Grid>
    </Box>
  )
}
