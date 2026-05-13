import { Badge, Box, Flex, Text } from '@chakra-ui/react'
import { getAllCallDetails } from '@/lib/data/calls'
import { CallsTable } from '@/components/calls/CallsTable'

export default function PendingPage() {
  const calls = getAllCallDetails().filter(c =>
    c.escalationStatus === 'pending' ||
    (c.qaStatus === 'unreviewed' && c.churnRisk === 'high')
  )

  return (
    <Box px={8} py={6}>
      <Flex align="center" gap={3} mb={2}>
        <Text fontSize="2xl" fontWeight="semibold" color="var(--chakra-colors-fg-default)" lineHeight="none">
          Pending &gt;48h
        </Text>
        <Badge colorPalette="yellow" variant="subtle" size="sm" rounded="sm">
          {calls.length}
        </Badge>
      </Flex>
      <Text fontSize="sm" color="var(--chakra-colors-fg-muted)" mb={6}>
        Open escalations and high churn-risk calls still awaiting review after 48 hours — prioritise for immediate action.
      </Text>
      <CallsTable calls={calls} />
    </Box>
  )
}
