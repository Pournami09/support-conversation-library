import { Badge, Box, Flex, Text } from '@chakra-ui/react'
import { getAllCallDetails } from '@/lib/data/calls'
import { CallsTable } from '@/components/calls/CallsTable'
import { CoachingBriefPanel } from '@/components/coaching/CoachingBriefPanel'

export default function CoachingQueuePage() {
  const calls = getAllCallDetails().filter(c =>
    c.flags.includes('coaching-opportunity') ||
    (c.qaStatus === 'flagged' && c.sentiment === 'negative')
  )

  return (
    <Box px={8} py={6}>
      <Flex align="center" gap={3} mb={2}>
        <Text fontSize="2xl" fontWeight="semibold" color="var(--chakra-colors-fg-default)" lineHeight="none">
          Coaching Queue
        </Text>
        <Badge colorPalette="gray" variant="subtle" size="sm" rounded="sm">
          {calls.length}
        </Badge>
      </Flex>
      <Text fontSize="sm" color="var(--chakra-colors-fg-muted)" mb={6}>
        Calls flagged for coaching — agent behaviour, missed opportunities, or negative outcomes that warrant a 1:1 review session.
      </Text>

      <CoachingBriefPanel calls={calls} />

      <CallsTable calls={calls} />
    </Box>
  )
}
