import { Box, Text } from '@chakra-ui/react'

export default function QaReportsPage() {
  return (
    <Box px={8} py={6}>
      <Text fontSize="2xl" fontWeight="semibold" color="var(--chakra-colors-fg-default)" mb={2}>
        QA Reports
      </Text>
      <Text fontSize="sm" color="var(--chakra-colors-fg-muted)">
        Team-wide quality scores, trends, and agent performance summaries.
      </Text>
    </Box>
  )
}
