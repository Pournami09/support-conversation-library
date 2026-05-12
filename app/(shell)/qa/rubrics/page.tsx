import { Box, Text } from '@chakra-ui/react'

export default function RubricsPage() {
  return (
    <Box px={8} py={6}>
      <Text fontSize="2xl" fontWeight="semibold" color="var(--chakra-colors-fg-default)" mb={2}>
        Rubrics
      </Text>
      <Text fontSize="sm" color="var(--chakra-colors-fg-muted)">
        Define and manage your QA scoring rubrics and criteria.
      </Text>
    </Box>
  )
}
