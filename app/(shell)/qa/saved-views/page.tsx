import { Box, Text } from '@chakra-ui/react'

export default function QaSavedViewsPage() {
  return (
    <Box px={8} py={6}>
      <Text fontSize="2xl" fontWeight="semibold" color="var(--chakra-colors-fg-default)" mb={2}>
        Saved Views
      </Text>
      <Text fontSize="sm" color="var(--chakra-colors-fg-muted)">
        Your saved QA filters and queue configurations.
      </Text>
    </Box>
  )
}
