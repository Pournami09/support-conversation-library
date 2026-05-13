import { Badge, Box, Flex, Text } from '@chakra-ui/react'
import { getAllCallDetails } from '@/lib/data/calls'
import { CallsTable } from '@/components/calls/CallsTable'

export default function EnterpriseTeamPage() {
  const calls = getAllCallDetails().filter(c =>
    c.severity === 'critical' ||
    (c.severity === 'high' && c.churnRisk === 'high')
  )

  return (
    <Box px={8} py={6}>
      <Flex align="center" gap={3} mb={2}>
        <Text fontSize="2xl" fontWeight="semibold" color="var(--chakra-colors-fg-default)" lineHeight="none">
          Enterprise
        </Text>
        <Badge colorPalette="blue" variant="subtle" size="sm" rounded="sm">
          {calls.length}
        </Badge>
      </Flex>
      <Text fontSize="sm" color="var(--chakra-colors-fg-muted)" mb={6}>
        High-priority calls from Enterprise accounts — critical severity or high churn-risk accounts requiring dedicated attention.
      </Text>
      <CallsTable calls={calls} />
    </Box>
  )
}
