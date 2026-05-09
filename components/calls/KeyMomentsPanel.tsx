import { Box, Flex, Stack, Text } from '@chakra-ui/react'
import type { CallDetailData, KeyMoment } from '@/lib/types'

interface KeyMomentsPanelProps {
  keyMoments: CallDetailData['keyMoments']
  activeLineIndex: number | null
  onSelect: (lineIndex: number) => void
}

export function KeyMomentsPanel({ keyMoments, activeLineIndex, onSelect }: KeyMomentsPanelProps) {
  return (
    <Box
      bg="var(--chakra-colors-bg-panel)"
      borderWidth="1px"
      borderColor="var(--chakra-colors-border-subtle)"
      rounded="sm"
      overflow="hidden"
      mb={4}
    >
      <Box
        px={4} py={3}
        borderBottomWidth="1px"
        borderColor="var(--chakra-colors-border-subtle)"
        bg="var(--chakra-colors-bg-subtle)"
      >
        <Text fontSize="xs" fontWeight="semibold" letterSpacing="wider" textTransform="uppercase" color="var(--chakra-colors-fg-muted)">
          Key moments
        </Text>
      </Box>

      <Stack gap={0}>
        {keyMoments.map((moment, i) => {
          const isActive = activeLineIndex === moment.lineIndex
          return (
            <Flex
              key={moment.id}
              gap={3}
              px={4}
              py={3}
              borderBottomWidth={i < keyMoments.length - 1 ? '1px' : '0'}
              borderColor="var(--chakra-colors-border-subtle)"
              bg={isActive ? 'var(--chakra-colors-blue-50)' : 'transparent'}
              cursor="pointer"
              _hover={{ bg: isActive ? 'var(--chakra-colors-blue-50)' : 'var(--chakra-colors-bg-subtle)' }}
              transition="background-color 0.1s ease"
              align="flex-start"
              onClick={() => onSelect(moment.lineIndex)}
            >
              {/* Timeline dot + line */}
              <Flex flexDirection="column" align="center" flexShrink={0} pt="3px">
                <Box
                  w="8px"
                  h="8px"
                  rounded="full"
                  bg={isActive ? 'var(--chakra-colors-blue-500)' : 'var(--chakra-colors-border-subtle)'}
                  borderWidth="2px"
                  borderColor={isActive ? 'var(--chakra-colors-blue-500)' : 'var(--chakra-colors-fg-muted)'}
                  transition="background-color 0.1s ease, border-color 0.1s ease"
                  flexShrink={0}
                />
                {i < keyMoments.length - 1 && (
                  <Box w="1px" flex={1} bg="var(--chakra-colors-border-subtle)" mt="2px" minH="20px" />
                )}
              </Flex>

              <Box flex={1} pb={i < keyMoments.length - 1 ? 3 : 0}>
                <Flex align="center" gap={2} mb={0.5}>
                  <Text fontSize="xs" color="var(--chakra-colors-fg-muted)" fontFamily="mono" flexShrink={0}>
                    {moment.timestamp}
                  </Text>
                  <Text fontSize="xs" fontWeight="medium" color={isActive ? 'var(--chakra-colors-blue-700)' : 'var(--chakra-colors-fg-default)'}>
                    {moment.label}
                  </Text>
                </Flex>
                <Text fontSize="xs" color="var(--chakra-colors-fg-muted)" fontStyle="italic" lineHeight="tall">
                  {moment.snippet}
                </Text>
              </Box>
            </Flex>
          )
        })}
      </Stack>
    </Box>
  )
}
