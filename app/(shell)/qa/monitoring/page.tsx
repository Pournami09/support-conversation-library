import { Box, Text } from '@chakra-ui/react'

export default function MonitoringPage() {
  return (
    <Box px={8} py={6}>
      <Text fontSize="2xl" fontWeight="semibold" color="var(--chakra-colors-fg-default)" mb={2}>
        Monitoring
      </Text>
      <Text fontSize="sm" color="var(--chakra-colors-fg-muted)">
        Real-time and historical conversation monitoring across your team.
      </Text>
    </Box>
  )
}
