import { Box, Flex } from '@chakra-ui/react'

export default function Loading() {
  return (
    <Flex
      h="full"
      align="center"
      justify="center"
      bg="var(--chakra-colors-bg-subtle)"
    >
      <Box
        w="18px"
        h="18px"
        rounded="full"
        border="2px solid"
        borderColor="var(--chakra-colors-border-muted)"
        borderTopColor="var(--chakra-colors-blue-500)"
        style={{ animation: 'spin 0.65s linear infinite' }}
      />
    </Flex>
  )
}
