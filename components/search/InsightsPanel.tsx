import { Badge, Box, Flex, Stack, Text } from '@chakra-ui/react'
import type { CallResult } from '@/lib/types'

interface InsightsPanelProps {
  results: CallResult[]
  query: string
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text fontSize="xs" fontWeight="semibold" letterSpacing="wider" textTransform="uppercase" color="var(--chakra-colors-fg-muted)" mb={2}>
      {children}
    </Text>
  )
}

export function InsightsPanel({ results, query }: InsightsPanelProps) {
  // Tally top topics
  const topicCounts: Record<string, number> = {}
  results.forEach(r => r.topics.forEach(t => { topicCounts[t] = (topicCounts[t] ?? 0) + 1 }))
  const topTopics = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]).slice(0, 6)

  // Tally agents
  const agentCounts: Record<string, number> = {}
  results.forEach(r => { agentCounts[r.agentName] = (agentCounts[r.agentName] ?? 0) + 1 })
  const topAgents = Object.entries(agentCounts).sort((a, b) => b[1] - a[1]).slice(0, 4)

  // Tally regions
  const regionCounts: Record<string, number> = {}
  results.forEach(r => { regionCounts[r.region] = (regionCounts[r.region] ?? 0) + 1 })
  const topRegions = Object.entries(regionCounts).sort((a, b) => b[1] - a[1]).slice(0, 4)

  // Flag tallies
  const flagCounts: Record<string, number> = {}
  results.forEach(r => r.flags.forEach(f => { flagCounts[f] = (flagCounts[f] ?? 0) + 1 }))
  const hasFlags = Object.keys(flagCounts).length > 0

  const escalations = results.filter(r => r.flags.includes('escalation')).length
  const churnRisk   = results.filter(r => r.flags.includes('churn-risk')).length

  return (
    <Box
      w="256px"
      flexShrink={0}
      bg="var(--chakra-colors-bg-panel)"
      borderLeftWidth="1px"
      borderColor="var(--chakra-colors-border-subtle)"
      overflowY="auto"
      px={4}
      py={4}
    >
      {/* Result summary */}
      <Box mb={4} pb={4} borderBottomWidth="1px" borderColor="var(--chakra-colors-border-subtle)">
        <SectionLabel>Result summary</SectionLabel>
        <Text fontSize="2xl" fontWeight="semibold" color="var(--chakra-colors-fg-default)" lineHeight="none" mb={1}>
          {results.length}
        </Text>
        <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">
          calls matched "{query || 'all'}"
        </Text>
        {hasFlags && (
          <Stack gap={1} mt={3}>
            {escalations > 0 && (
              <Flex align="center" justify="space-between">
                <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">Escalations</Text>
                <Badge colorPalette="red" variant="subtle" size="sm">{escalations}</Badge>
              </Flex>
            )}
            {churnRisk > 0 && (
              <Flex align="center" justify="space-between">
                <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">Churn risk</Text>
                <Badge colorPalette="orange" variant="subtle" size="sm">{churnRisk}</Badge>
              </Flex>
            )}
          </Stack>
        )}
      </Box>

      {/* Top topics */}
      {topTopics.length > 0 && (
        <Box mb={4} pb={4} borderBottomWidth="1px" borderColor="var(--chakra-colors-border-subtle)">
          <SectionLabel>Top topics</SectionLabel>
          <Stack gap={1.5}>
            {topTopics.map(([topic, count]) => (
              <Flex key={topic} align="center" justify="space-between">
                <Text fontSize="xs" color="var(--chakra-colors-fg-default)">{topic}</Text>
                <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">{count}</Text>
              </Flex>
            ))}
          </Stack>
        </Box>
      )}

      {/* Top agents */}
      {topAgents.length > 0 && (
        <Box mb={4} pb={4} borderBottomWidth="1px" borderColor="var(--chakra-colors-border-subtle)">
          <SectionLabel>Agents</SectionLabel>
          <Stack gap={1.5}>
            {topAgents.map(([agent, count]) => (
              <Flex key={agent} align="center" justify="space-between">
                <Text fontSize="xs" color="var(--chakra-colors-fg-default)">{agent.split(' ')[0]} {agent.split(' ')[1]?.[0]}.</Text>
                <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">{count}</Text>
              </Flex>
            ))}
          </Stack>
        </Box>
      )}

      {/* Regions */}
      {topRegions.length > 0 && (
        <Box mb={4} pb={4} borderBottomWidth="1px" borderColor="var(--chakra-colors-border-subtle)">
          <SectionLabel>Regions</SectionLabel>
          <Stack gap={1.5}>
            {topRegions.map(([region, count]) => (
              <Flex key={region} align="center" justify="space-between">
                <Text fontSize="xs" color="var(--chakra-colors-fg-default)">{region}</Text>
                <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">{count}</Text>
              </Flex>
            ))}
          </Stack>
        </Box>
      )}

      {/* AI synthesis note */}
      <Box
        bg="var(--chakra-colors-blue-50)"
        borderWidth="1px"
        borderColor="var(--chakra-colors-blue-200)"
        rounded="sm"
        p={3}
      >
        <Flex align="center" gap={1.5} mb={1.5}>
          <Text fontSize="xs" fontWeight="semibold" color="var(--chakra-colors-blue-700)">AI pattern note</Text>
          <Badge colorPalette="blue" variant="subtle" size="sm">Beta</Badge>
        </Flex>
        <Text fontSize="xs" color="var(--chakra-colors-blue-800)" lineHeight="tall">
          {results.length > 0
            ? `Billing confusion and access issues are the most frequent themes in this result set. ${churnRisk > 0 ? `${churnRisk} calls carry churn risk signals.` : ''}`
            : 'No results to analyse.'}
        </Text>
      </Box>
    </Box>
  )
}
