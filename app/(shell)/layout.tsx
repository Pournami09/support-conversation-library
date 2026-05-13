import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { Box, Flex } from '@chakra-ui/react'

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <Flex h="100vh" overflow="hidden" bg="var(--chakra-colors-bg)">
      <Sidebar />
      <Flex flex={1} flexDirection="column" overflow="hidden">
        <TopBar />
        <Box as="main" flex={1} minH={0} overflowY="auto" bg="var(--chakra-colors-bg-subtle)">
          {children}
        </Box>
      </Flex>
    </Flex>
  )
}
