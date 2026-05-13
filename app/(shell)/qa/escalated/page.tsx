import { Badge, Box, Flex, Text } from '@chakra-ui/react'
import { getAllCallDetails } from '@/lib/data/calls'
import { CallsTable } from '@/components/calls/CallsTable'

export default function EscalatedPage() {
  const calls = getAllCallDetails().filter(
    c => c.escalationStatus === 'escalated' || c.flags.includes('escalation')
  )

  return (
    <Box px={8} py={6}>
      <Flex align="center" gap={3} mb={2}>
        <Text fontSize="2xl" fontWeight="semibold" color="var(--chakra-colors-fg-default)" lineHeight="none">
          Escalated
        </Text>
        <Badge colorPalette="red" variant="subtle" size="sm" rounded="sm">
          {calls.length}
        </Badge>
      </Flex>
      <Text fontSize="sm" color="var(--chakra-colors-fg-muted)" mb={6}>
        Calls that were escalated to a supervisor or flagged with an escalation signal — review for protocol adherence and resolution quality.
      </Text>
      <CallsTable calls={calls} />
    </Box>
  )
}
