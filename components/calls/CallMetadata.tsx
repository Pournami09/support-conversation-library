'use client'

import { useState, useEffect } from 'react'
import { Badge, Box, Flex, Stack, Text } from '@chakra-ui/react'
import type { CallDetailData } from '@/lib/types'
import { SeverityBadge, FlagBadge } from '@/components/shared/Badges'

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

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Flex align="flex-start" justify="space-between" gap={3} py={2.5} borderBottomWidth="1px" borderColor="var(--chakra-colors-border-subtle)">
      <Text fontSize="xs" fontWeight="semibold" letterSpacing="wide" textTransform="uppercase" color="var(--chakra-colors-fg-muted)" flexShrink={0} mt="1px">
        {label}
      </Text>
      <Box textAlign="right">{children}</Box>
    </Flex>
  )
}

const ESCALATION_PALETTE = { none: 'gray', escalated: 'red', pending: 'orange' } as const
const CHURN_PALETTE = { none: 'gray', low: 'yellow', medium: 'orange', high: 'red' } as const
const SENTIMENT_PALETTE = { positive: 'green', neutral: 'gray', negative: 'red' } as const
const QA_PALETTE = { unreviewed: 'gray', reviewed: 'green', flagged: 'orange' } as const

export function CallMetadata({ call }: { call: CallDetailData }) {
  const [copied, setCopied] = useState(false)

  function copySummary() {
    const text = `Call: ${call.title}\nDate: ${call.date} ${call.time}\nAgent: ${call.agentName}\nAccount: ${call.accountName}\n\nSummary: ${call.aiSummary}\n\nResolution: ${call.resolutionOutcome}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Stack gap={4}>
      {/* Call metadata */}
      <Box
        bg="var(--chakra-colors-bg-panel)"
        borderWidth="1px"
        borderColor="var(--chakra-colors-border-subtle)"
        rounded="sm"
        overflow="hidden"
      >
        <Box px={4} py={3} borderBottomWidth="1px" borderColor="var(--chakra-colors-border-subtle)" bg="var(--chakra-colors-bg-subtle)">
          <Text fontSize="xs" fontWeight="semibold" letterSpacing="wider" textTransform="uppercase" color="var(--chakra-colors-fg-muted)">
            Call metadata
          </Text>
        </Box>
        <Box px={4} py={1}>
          <MetaRow label="Category">
            <Text fontSize="xs" color="var(--chakra-colors-fg-default)">{call.issueCategory}</Text>
          </MetaRow>
          <MetaRow label="Product area">
            <Text fontSize="xs" color="var(--chakra-colors-fg-default)">{call.productArea}</Text>
          </MetaRow>
          <MetaRow label="Escalation">
            <Badge colorPalette={ESCALATION_PALETTE[call.escalationStatus]} variant="subtle" size="sm" rounded="sm">
              {call.escalationStatus === 'none' ? 'None' : call.escalationStatus === 'escalated' ? 'Escalated' : 'Pending'}
            </Badge>
          </MetaRow>
          <MetaRow label="Churn risk">
            <Badge colorPalette={CHURN_PALETTE[call.churnRisk]} variant="subtle" size="sm" rounded="sm" textTransform="capitalize">
              {call.churnRisk}
            </Badge>
          </MetaRow>
          <MetaRow label="Sentiment">
            <Badge colorPalette={SENTIMENT_PALETTE[call.sentiment]} variant="subtle" size="sm" rounded="sm" textTransform="capitalize">
              {call.sentiment}
            </Badge>
          </MetaRow>
          <MetaRow label="QA status">
            <Badge colorPalette={QA_PALETTE[call.qaStatus]} variant="subtle" size="sm" rounded="sm">
              {call.qaStatus === 'unreviewed' ? 'Unreviewed' : call.qaStatus === 'reviewed' ? 'Reviewed' : 'Flagged'}
            </Badge>
          </MetaRow>
          {call.ticketId && (
            <MetaRow label="Ticket">
              <Text fontSize="xs" color="var(--chakra-colors-blue-600)" fontFamily="mono">{call.ticketId}</Text>
            </MetaRow>
          )}
          {call.tags.length > 0 && (
            <Box py={2.5}>
              <Text fontSize="xs" fontWeight="semibold" letterSpacing="wide" textTransform="uppercase" color="var(--chakra-colors-fg-muted)" mb={2}>
                Tags
              </Text>
              <Flex gap={1.5} flexWrap="wrap">
                {call.tags.map(tag => (
                  <Badge key={tag} colorPalette="blue" variant="subtle" size="sm" rounded="sm">{tag}</Badge>
                ))}
              </Flex>
            </Box>
          )}
        </Box>
      </Box>

      {/* Sentiment scores */}
      <Box
        bg="var(--chakra-colors-bg-panel)"
        borderWidth="1px"
        borderColor="var(--chakra-colors-border-subtle)"
        rounded="sm"
        overflow="hidden"
      >
        <Box px={4} py={3} borderBottomWidth="1px" borderColor="var(--chakra-colors-border-subtle)" bg="var(--chakra-colors-bg-subtle)">
          <Text fontSize="xs" fontWeight="semibold" letterSpacing="wider" textTransform="uppercase" color="var(--chakra-colors-fg-muted)">Sentiment</Text>
        </Box>
        <Stack gap={3} px={4} py={3}>
          {[
            { label: 'Customer', value: call.sentimentScore.customer, color: 'var(--chakra-colors-green-500)' },
            { label: 'Agent',    value: call.sentimentScore.agent,    color: 'var(--chakra-colors-blue-500)' },
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

      {/* Actions */}
      <Box
        bg="var(--chakra-colors-bg-panel)"
        borderWidth="1px"
        borderColor="var(--chakra-colors-border-subtle)"
        rounded="sm"
        overflow="hidden"
      >
        <Box px={4} py={3} borderBottomWidth="1px" borderColor="var(--chakra-colors-border-subtle)" bg="var(--chakra-colors-bg-subtle)">
          <Text fontSize="xs" fontWeight="semibold" letterSpacing="wider" textTransform="uppercase" color="var(--chakra-colors-fg-muted)">Actions</Text>
        </Box>
        <Stack gap={2} px={4} py={3}>
          <Box
            as="button"
            w="full"
            px={3}
            py="7px"
            bg="var(--chakra-colors-blue-600)"
            color="white"
            fontSize="xs"
            fontWeight="medium"
            rounded="sm"
            cursor="pointer"
            textAlign="center"
            _hover={{ bg: 'var(--chakra-colors-blue-700)' }}
            transition="background-color 0.15s ease"
            _active={{ transform: 'scale(0.97)' }}
            onClick={copySummary}
          >
            {copied ? 'Copied!' : 'Copy summary'}
          </Box>
          <Box
            as="button"
            w="full"
            px={3}
            py="7px"
            borderWidth="1px"
            borderColor="var(--chakra-colors-border-subtle)"
            bg="var(--chakra-colors-bg-panel)"
            color="var(--chakra-colors-fg-default)"
            fontSize="xs"
            rounded="sm"
            cursor="pointer"
            textAlign="center"
            _hover={{ bg: 'var(--chakra-colors-blue-50)' }}
            transition="background-color 0.15s ease"
            _active={{ transform: 'scale(0.97)' }}
          >
            Save to collection
          </Box>
          <Box
            as="button"
            w="full"
            px={3}
            py="7px"
            borderWidth="1px"
            borderColor="var(--chakra-colors-border-subtle)"
            bg="var(--chakra-colors-bg-panel)"
            color="var(--chakra-colors-fg-default)"
            fontSize="xs"
            rounded="sm"
            cursor="pointer"
            textAlign="center"
            _hover={{ bg: 'var(--chakra-colors-blue-50)' }}
            transition="background-color 0.15s ease"
            _active={{ transform: 'scale(0.97)' }}
          >
            Share summary
          </Box>
          <Box
            as="button"
            w="full"
            px={3}
            py="7px"
            borderWidth="1px"
            borderColor="var(--chakra-colors-orange-200)"
            bg="var(--chakra-colors-orange-50)"
            color="var(--chakra-colors-orange-700)"
            fontSize="xs"
            rounded="sm"
            cursor="pointer"
            textAlign="center"
            _hover={{ bg: 'var(--chakra-colors-orange-100)' }}
            transition="background-color 0.15s ease"
            _active={{ transform: 'scale(0.97)' }}
          >
            Flag for QA review
          </Box>
        </Stack>
      </Box>
    </Stack>
  )
}
