'use client'

import { useState } from 'react'
import { Badge, Box, Flex, Stack, Text } from '@chakra-ui/react'
import Link from 'next/link'
import type { CallResult } from '@/lib/types'
import { SeverityBadge, FlagBadge } from '@/components/shared/Badges'

interface ResultCardProps {
  result: CallResult
  query: string
}

// Highlight matching terms in a snippet text
function HighlightedText({ text, terms }: { text: string; terms: string[] }) {
  if (terms.length === 0) return <>{text}</>

  const pattern = new RegExp(`(${terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi')
  const parts = text.split(pattern)

  return (
    <>
      {parts.map((part, i) =>
        terms.some(t => t.toLowerCase() === part.toLowerCase())
          ? <Box key={i} as="mark" bg="var(--chakra-colors-yellow-100)" color="inherit" fontWeight="medium" px="1px" rounded="sm">{part}</Box>
          : <span key={i}>{part}</span>
      )}
    </>
  )
}

export function ResultCard({ result, query }: ResultCardProps) {
  const [copied, setCopied] = useState(false)

  function copyEvidence() {
    const text = result.snippets.map(s => `[${s.speaker}]: "${s.text}"`).join('\n\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Box
      bg="var(--chakra-colors-bg-panel)"
      borderWidth="1px"
      borderColor="var(--chakra-colors-border-subtle)"
      rounded="sm"
      overflow="hidden"
      _hover={{ borderColor: 'var(--chakra-colors-blue-200)' }}
      transition="border-color 0.15s ease"
    >
      {/* ── Card header ──────────────────────────────────────────────── */}
      <Box px={4} pt={4} pb={3}>
        <Flex align="flex-start" justify="space-between" gap={3} mb={2}>
          <Box flex={1}>
            <Link href={`/transcripts/${result.id}`}>
              <Text
                fontSize="sm"
                fontWeight="semibold"
                color="var(--chakra-colors-blue-700)"
                _hover={{ textDecoration: 'underline' }}
                lineHeight="snug"
                display="block"
                mb={1}
              >
                {result.title}
              </Text>
            </Link>
            <Flex align="center" gap={3} flexWrap="wrap">
              <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">
                {result.accountName}
              </Text>
              <Text fontSize="xs" color="var(--chakra-colors-fg-subtle)">·</Text>
              <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">
                {result.agentName}
              </Text>
              <Text fontSize="xs" color="var(--chakra-colors-fg-subtle)">·</Text>
              <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">
                {result.date} at {result.time}
              </Text>
              <Text fontSize="xs" color="var(--chakra-colors-fg-subtle)">·</Text>
              <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">
                {result.region}
              </Text>
              <Text fontSize="xs" color="var(--chakra-colors-fg-subtle)">·</Text>
              <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">
                {result.duration}
              </Text>
            </Flex>
          </Box>
          <Flex gap={2} align="center" flexShrink={0}>
            <SeverityBadge severity={result.severity} />
          </Flex>
        </Flex>

        {/* Flags and topics */}
        <Flex gap={1.5} flexWrap="wrap">
          {result.flags.map(f => <FlagBadge key={f} flag={f} />)}
          {result.topics.map(t => (
            <Badge key={t} colorPalette="gray" variant="subtle" size="sm" rounded="sm">{t}</Badge>
          ))}
        </Flex>
      </Box>

      {/* ── AI summary ───────────────────────────────────────────────── */}
      <Box
        px={4}
        py={3}
        borderTopWidth="1px"
        borderColor="var(--chakra-colors-border-subtle)"
        bg="var(--chakra-colors-bg-subtle)"
      >
        <Flex align="center" gap={2} mb={1.5}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--chakra-colors-fg-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M12 3 9 9 3 12l6 3 3 6 3-6 6-3-6-3z" />
          </svg>
          <Text fontSize="xs" fontWeight="semibold" letterSpacing="wider" textTransform="uppercase" color="var(--chakra-colors-fg-muted)">
            AI Summary
          </Text>
          <Badge colorPalette="blue" variant="subtle" size="sm">Beta</Badge>
        </Flex>
        <Text fontSize="sm" color="var(--chakra-colors-fg-default)" lineHeight="tall">
          {result.aiSummary}
        </Text>
      </Box>

      {/* ── Why this result ───────────────────────────────────────────── */}
      <Box
        px={4}
        py={3}
        borderTopWidth="1px"
        borderColor="var(--chakra-colors-border-subtle)"
      >
        <Flex align="flex-start" gap={2}>
          <Box
            px={2}
            py="2px"
            bg="var(--chakra-colors-blue-50)"
            borderWidth="1px"
            borderColor="var(--chakra-colors-blue-200)"
            rounded="sm"
            flexShrink={0}
          >
            <Text fontSize="10px" fontWeight="semibold" letterSpacing="wider" textTransform="uppercase" color="var(--chakra-colors-blue-700)">
              Why
            </Text>
          </Box>
          <Text fontSize="xs" color="var(--chakra-colors-fg-muted)" lineHeight="tall" pt="1px">
            {result.whyResult}
          </Text>
        </Flex>
      </Box>

      {/* ── Transcript snippets ───────────────────────────────────────── */}
      <Stack
        gap={0}
        borderTopWidth="1px"
        borderColor="var(--chakra-colors-border-subtle)"
      >
        {result.snippets.map((snippet, i) => (
          <Box
            key={i}
            px={4}
            py={3}
            borderBottomWidth={i < result.snippets.length - 1 ? '1px' : '0'}
            borderColor="var(--chakra-colors-border-subtle)"
          >
            <Flex align="flex-start" gap={3}>
              <Badge
                size="sm"
                colorPalette={snippet.speaker === 'Agent' ? 'blue' : 'gray'}
                variant={snippet.speaker === 'Agent' ? 'subtle' : 'outline'}
                rounded="sm"
                flexShrink={0}
                mt="1px"
                w="64px"
                textAlign="center"
              >
                {snippet.speaker}
              </Badge>
              <Text fontSize="sm" color="var(--chakra-colors-fg-default)" lineHeight="tall">
                "<HighlightedText text={snippet.text} terms={snippet.matchTerms} />"
              </Text>
            </Flex>
          </Box>
        ))}
      </Stack>

      {/* ── Actions ──────────────────────────────────────────────────── */}
      <Flex
        gap={2}
        px={4}
        py={3}
        borderTopWidth="1px"
        borderColor="var(--chakra-colors-border-subtle)"
        bg="var(--chakra-colors-bg-subtle)"
      >
        <Link href={`/transcripts/${result.id}`}>
          <Box
            px={3}
            py="5px"
            bg="var(--chakra-colors-blue-600)"
            color="white"
            fontSize="xs"
            fontWeight="medium"
            rounded="sm"
            cursor="pointer"
            _hover={{ bg: 'var(--chakra-colors-blue-700)' }}
            transition="background-color 0.15s ease"
            _active={{ transform: 'scale(0.97)' }}
          >
            Open call
          </Box>
        </Link>
        <Box
          as="button"
          px={3}
          py="5px"
          borderWidth="1px"
          borderColor="var(--chakra-colors-border-subtle)"
          bg="var(--chakra-colors-bg-panel)"
          color="var(--chakra-colors-fg-default)"
          fontSize="xs"
          rounded="sm"
          cursor="pointer"
          _hover={{ bg: 'var(--chakra-colors-blue-50)' }}
          transition="background-color 0.15s ease"
          _active={{ transform: 'scale(0.97)' }}
          onClick={copyEvidence}
        >
          {copied ? 'Copied!' : 'Copy evidence'}
        </Box>
        <Box
          as="button"
          px={3}
          py="5px"
          borderWidth="1px"
          borderColor="var(--chakra-colors-border-subtle)"
          bg="var(--chakra-colors-bg-panel)"
          color="var(--chakra-colors-fg-default)"
          fontSize="xs"
          rounded="sm"
          cursor="pointer"
          _hover={{ bg: 'var(--chakra-colors-blue-50)' }}
          transition="background-color 0.15s ease"
          _active={{ transform: 'scale(0.97)' }}
        >
          Save to collection
        </Box>
      </Flex>
    </Box>
  )
}
