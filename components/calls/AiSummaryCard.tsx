import { Badge, Box, Flex, Stack, Text } from '@chakra-ui/react'
import type { CallDetailData } from '@/lib/types'
import { SeverityBadge, FlagBadge } from '@/components/shared/Badges'

export function AiSummaryCard({ call }: { call: CallDetailData }) {
  return (
    <Box
      bg="var(--chakra-colors-bg-panel)"
      borderWidth="1px"
      borderColor="var(--chakra-colors-border-subtle)"
      rounded="sm"
      overflow="hidden"
      mb={4}
    >
      {/* Header */}
      <Box
        px={4} py={3}
        borderBottomWidth="1px"
        borderColor="var(--chakra-colors-border-subtle)"
        bg="var(--chakra-colors-bg-subtle)"
      >
        <Flex align="center" justify="space-between">
          <Flex align="center" gap={2}>
            <Text fontSize="xs" fontWeight="semibold" letterSpacing="wider" textTransform="uppercase" color="var(--chakra-colors-fg-muted)">
              AI Summary
            </Text>
            <Badge colorPalette="blue" variant="subtle" size="sm">Beta</Badge>
          </Flex>
          <Flex align="center" gap={2}>
            <SeverityBadge severity={call.severity} />
            {call.flags.map(f => <FlagBadge key={f} flag={f} />)}
          </Flex>
        </Flex>
      </Box>

      {/* Summary body */}
      <Box px={4} py={3}>
        <Text fontSize="sm" color="var(--chakra-colors-fg-default)" lineHeight="tall" mb={4}>
          {call.aiSummary}
        </Text>

        <Stack gap={3}>
          <Box>
            <Text fontSize="xs" fontWeight="semibold" letterSpacing="wider" textTransform="uppercase" color="var(--chakra-colors-fg-muted)" mb={1}>
              Main issue
            </Text>
            <Text fontSize="sm" color="var(--chakra-colors-fg-default)">{call.mainIssue}</Text>
          </Box>

          <Box>
            <Text fontSize="xs" fontWeight="semibold" letterSpacing="wider" textTransform="uppercase" color="var(--chakra-colors-fg-muted)" mb={1}>
              Resolution
            </Text>
            <Text fontSize="sm" color="var(--chakra-colors-fg-default)">{call.resolutionOutcome}</Text>
          </Box>

          {call.notableFlags.length > 0 && (
            <Box>
              <Text fontSize="xs" fontWeight="semibold" letterSpacing="wider" textTransform="uppercase" color="var(--chakra-colors-fg-muted)" mb={2}>
                Notable flags
              </Text>
              <Stack gap={1.5}>
                {call.notableFlags.map((flag, i) => (
                  <Flex key={i} align="flex-start" gap={2}>
                    <Box w="6px" h="6px" rounded="full" bg="var(--chakra-colors-orange-400)" flexShrink={0} mt="5px" />
                    <Text fontSize="sm" color="var(--chakra-colors-fg-default)">{flag}</Text>
                  </Flex>
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  )
}
