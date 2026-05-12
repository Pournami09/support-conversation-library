import { Box, Text } from '@chakra-ui/react'

export default function EvidenceBoardPage() {
  return (
    <Box px={8} py={6}>
      <Text fontSize="2xl" fontWeight="semibold" color="var(--chakra-colors-fg-default)" mb={2}>
        Evidence Board
      </Text>
      <Text fontSize="sm" color="var(--chakra-colors-fg-muted)">
        Pinned excerpts, flagged moments, and curated evidence from across conversations.
      </Text>
    </Box>
  )
}
