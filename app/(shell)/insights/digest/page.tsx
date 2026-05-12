import { Box, Text } from '@chakra-ui/react'

export default function DigestPage() {
  return (
    <Box px={8} py={6}>
      <Text fontSize="2xl" fontWeight="semibold" color="var(--chakra-colors-fg-default)" mb={2}>
        Digest
      </Text>
      <Text fontSize="sm" color="var(--chakra-colors-fg-muted)">
        Curated summaries of key conversations and signals from the past week.
      </Text>
    </Box>
  )
}
