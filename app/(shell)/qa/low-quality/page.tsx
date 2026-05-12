import { Badge, Box, Flex, Text } from '@chakra-ui/react'
import { getAllCallDetails } from '@/lib/data/calls'
import { CallsTable } from '@/components/calls/CallsTable'

export default function LowQualityPage() {
  const calls = getAllCallDetails().filter(
    c => c.qaStatus === 'flagged' || (c.qaStatus === 'unreviewed' && c.sentiment === 'negative')
  )

  return (
    <Box px={8} py={6}>
      <Flex align="center" gap={3} mb={2}>
        <Text fontSize="2xl" fontWeight="semibold" color="var(--chakra-colors-fg-default)" lineHeight="none">
          Low Quality
        </Text>
        <Badge colorPalette="red" variant="subtle" size="sm" rounded="sm">
          {calls.length}
        </Badge>
      </Flex>
      <Text fontSize="sm" color="var(--chakra-colors-fg-muted)" mb={6}>
        Calls flagged by QA or with negative sentiment that remain unreviewed — require scoring and potential coaching action.
      </Text>
      <CallsTable calls={calls} />
    </Box>
  )
}
