import { Box, Text } from '@chakra-ui/react'

export default function ScoringQueuePage() {
  return (
    <Box px={8} py={6}>
      <Text fontSize="2xl" fontWeight="semibold" color="var(--chakra-colors-fg-default)" mb={2}>
        Scoring Queue
      </Text>
      <Text fontSize="sm" color="var(--chakra-colors-fg-muted)">
        Review and score agent conversations against your rubrics.
      </Text>
    </Box>
  )
}
