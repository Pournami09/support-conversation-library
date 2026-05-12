import { Badge, Box, Flex, Text } from '@chakra-ui/react'
import { getAllCallDetails } from '@/lib/data/calls'
import { CallsTable } from '@/components/calls/CallsTable'

export default function PolicyViolationsPage() {
  const calls = getAllCallDetails().filter(c =>
    c.flags.includes('policy-concern') ||
    (c.qaStatus === 'flagged' && c.flags.includes('escalation'))
  )

  return (
    <Box px={8} py={6}>
      <Flex align="center" gap={3} mb={2}>
        <Text fontSize="2xl" fontWeight="semibold" color="var(--chakra-colors-fg-default)" lineHeight="none">
          Policy Violations
        </Text>
        <Badge colorPalette="gray" variant="subtle" size="sm" rounded="sm">
          {calls.length}
        </Badge>
      </Flex>
      <Text fontSize="sm" color="var(--chakra-colors-fg-muted)" mb={6}>
        Calls with detected policy concerns or missed escalation protocol — requires QA review and possible compliance action.
      </Text>
      <CallsTable calls={calls} />
    </Box>
  )
}
