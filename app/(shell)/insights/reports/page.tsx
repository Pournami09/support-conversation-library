import { Box, Text } from '@chakra-ui/react'

export default function InsightsReportsPage() {
  return (
    <Box px={8} py={6}>
      <Text fontSize="2xl" fontWeight="semibold" color="var(--chakra-colors-fg-default)" mb={2}>
        Insights Reports
      </Text>
      <Text fontSize="sm" color="var(--chakra-colors-fg-muted)">
        Scheduled and on-demand reports across themes, collections, and trends.
      </Text>
    </Box>
  )
}
