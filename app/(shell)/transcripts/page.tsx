import { TRANSCRIPTS } from '@/lib/data/transcripts'
import { TranscriptsList } from '@/components/transcripts/TranscriptsList'
import { Badge, Box, Flex, Text } from '@chakra-ui/react'

export default function TranscriptsPage() {
  return (
    <Box px={8} py={6}>
      <Flex align="center" gap={3} mb={6}>
        <Text fontSize="2xl" fontWeight="semibold" color="var(--chakra-colors-fg-default)" lineHeight="none">
          Transcripts
        </Text>
        <Badge colorPalette="blue" variant="subtle" size="sm" rounded="sm">
          {TRANSCRIPTS.length}
        </Badge>
      </Flex>
      <TranscriptsList transcripts={TRANSCRIPTS} />
    </Box>
  )
}
