'use client'

import type { ReactNode } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import { TopBar } from './TopBar'
import { BreadcrumbBar } from './Breadcrumb'
import { AgentPanelProvider } from '@/lib/context/agent-panel'
import { AgentPanel } from '@/components/agent/AgentPanel'

export function ShellContent({ children }: { children: ReactNode }) {
  return (
    <AgentPanelProvider>
      <Flex flex={1} flexDirection="column" overflow="hidden">
        <TopBar />
        <BreadcrumbBar />
        <Box as="main" flex={1} minH={0} overflowY="auto" bg="var(--chakra-colors-bg-subtle)">
          {children}
        </Box>
      </Flex>
      <AgentPanel />
    </AgentPanelProvider>
  )
}
