import { TRANSCRIPTS } from '@/lib/data/transcripts'
import { TranscriptsList } from '@/components/transcripts/TranscriptsList'
import { Box, Flex, Text } from '@chakra-ui/react'

export default function TranscriptsPage() {
  return (
    <Box px={8} py={6}>
      <Flex align="center" gap={3} mb={5}>
        <Text fontSize="2xl" fontWeight="semibold" color="var(--chakra-colors-fg-default)" lineHeight="none">
          All Calls
        </Text>
      </Flex>
      <TranscriptsList transcripts={TRANSCRIPTS} />
    </Box>
  )
}
