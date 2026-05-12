import { Badge, Box, Flex, Text } from '@chakra-ui/react'
import { getAllCallDetails } from '@/lib/data/calls'
import { CallsTable } from '@/components/calls/CallsTable'

export default function Tier1SupportPage() {
  const calls = getAllCallDetails().filter(c =>
    c.productArea === 'Onboarding / Activation' ||
    c.productArea === 'Core Platform' ||
    c.productArea === 'User Management' ||
    c.issueCategory === 'General Inquiry'
  )

  return (
    <Box px={8} py={6}>
      <Flex align="center" gap={3} mb={2}>
        <Text fontSize="2xl" fontWeight="semibold" color="var(--chakra-colors-fg-default)" lineHeight="none">
          Tier 1 Support
        </Text>
        <Badge colorPalette="blue" variant="subtle" size="sm" rounded="sm">
          {calls.length}
        </Badge>
      </Flex>
      <Text fontSize="sm" color="var(--chakra-colors-fg-muted)" mb={6}>
        Calls handled by the Tier 1 Support team — onboarding, general inquiries, and core platform issues.
      </Text>
      <CallsTable calls={calls} />
    </Box>
  )
}
