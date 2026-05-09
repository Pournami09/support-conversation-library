import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { Box, Flex } from '@chakra-ui/react'

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <Flex h="100vh" overflow="hidden" bg="var(--chakra-colors-bg)">
      <Sidebar />
      <Flex flex={1} flexDirection="column" overflow="hidden">
        <TopBar />
        <Box flex={1} overflowY="auto">
          {children}
        </Box>
      </Flex>
    </Flex>
  )
}
