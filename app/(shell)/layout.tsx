import { Flex } from '@chakra-ui/react'
import { Sidebar } from '@/components/layout/Sidebar'
import { ShellContent } from '@/components/layout/ShellContent'

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <Flex h="100vh" overflow="hidden" bg="var(--chakra-colors-bg)">
      <Sidebar />
      <ShellContent>{children}</ShellContent>
    </Flex>
  )
}
