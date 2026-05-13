'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

interface AgentPanelCtx {
  agentName: string | null
  openAgent: (name: string) => void
  closeAgent: () => void
}

const Ctx = createContext<AgentPanelCtx>({
  agentName: null,
  openAgent: () => {},
  closeAgent: () => {},
})

export function useAgentPanel() {
  return useContext(Ctx)
}

export function AgentPanelProvider({ children }: { children: ReactNode }) {
  const [agentName, setAgentName] = useState<string | null>(null)
  return (
    <Ctx.Provider value={{
      agentName,
      openAgent: setAgentName,
      closeAgent: () => setAgentName(null),
    }}>
      {children}
    </Ctx.Provider>
  )
}
