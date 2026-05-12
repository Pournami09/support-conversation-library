import { Box, Text } from '@chakra-ui/react'

export default function TrendsPage() {
  return (
    <Box px={8} py={6}>
      <Text fontSize="2xl" fontWeight="semibold" color="var(--chakra-colors-fg-default)" mb={2}>
        Trends
      </Text>
      <Text fontSize="sm" color="var(--chakra-colors-fg-muted)">
        Emerging patterns and recurring issues across your conversation library.
      </Text>
    </Box>
  )
}
