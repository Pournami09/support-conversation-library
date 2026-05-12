import { Badge, Box, Flex, Text } from '@chakra-ui/react'
import { getAllCallDetails } from '@/lib/data/calls'
import { CallsTable } from '@/components/calls/CallsTable'

export default function BillingSpecialistsPage() {
  const calls = getAllCallDetails().filter(c =>
    c.productArea === 'Billing & Subscriptions' ||
    c.issueCategory.toLowerCase().includes('billing') ||
    c.issueCategory.toLowerCase().includes('cancell') ||
    c.issueCategory.toLowerCase().includes('renewal')
  )

  return (
    <Box px={8} py={6}>
      <Flex align="center" gap={3} mb={2}>
        <Text fontSize="2xl" fontWeight="semibold" color="var(--chakra-colors-fg-default)" lineHeight="none">
          Billing Specialists
        </Text>
        <Badge colorPalette="blue" variant="subtle" size="sm" rounded="sm">
          {calls.length}
        </Badge>
      </Flex>
      <Text fontSize="sm" color="var(--chakra-colors-fg-muted)" mb={6}>
        Calls handled by Billing Specialists — invoice disputes, subscription changes, cancellation requests, and renewal discussions.
      </Text>
      <CallsTable calls={calls} />
    </Box>
  )
}
