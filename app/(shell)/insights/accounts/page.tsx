import { Badge, Box, Flex, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { TRANSCRIPTS } from '@/lib/data/transcripts'

function buildAccountSummaries() {
  const map = new Map<string, { count: number; agents: Set<string>; regions: Set<string> }>()
  for (const t of TRANSCRIPTS) {
    if (!map.has(t.accountName)) {
      map.set(t.accountName, { count: 0, agents: new Set(), regions: new Set() })
    }
    const entry = map.get(t.accountName)!
    entry.count++
    entry.agents.add(t.agentName)
    entry.regions.add(t.region)
  }
  return Array.from(map.entries())
    .map(([name, data]) => ({
      name,
      count: data.count,
      agentCount: data.agents.size,
      regions: Array.from(data.regions).join(', '),
    }))
    .sort((a, b) => b.count - a.count)
}

const ACCOUNTS = buildAccountSummaries()

export default function AccountsPage() {
  return (
    <Box px={8} py={6}>
      <Flex align="center" gap={3} mb={2}>
        <Text fontSize="2xl" fontWeight="semibold" color="var(--chakra-colors-fg-default)" lineHeight="none">
          Accounts
        </Text>
        <Badge colorPalette="blue" variant="subtle" size="sm" rounded="sm">
          {ACCOUNTS.length}
        </Badge>
      </Flex>
      <Text fontSize="sm" color="var(--chakra-colors-fg-muted)" mb={6}>
        All accounts in your conversation library — sorted by call volume.
      </Text>

      <Box
        bg="var(--chakra-colors-bg-panel)"
        borderWidth="1px"
        borderColor="var(--chakra-colors-border-subtle)"
        rounded="sm"
        overflow="hidden"
      >
        {ACCOUNTS.map((account, i) => (
          <Link
            key={account.name}
            href={`/search?q=${encodeURIComponent(account.name)}`}
            style={{ textDecoration: 'none' }}
          >
            <Flex
              align="center"
              gap={4}
              px={5} py={3.5}
              borderTopWidth={i > 0 ? '1px' : '0'}
              borderColor="var(--chakra-colors-border-subtle)"
              _hover={{ bg: 'var(--chakra-colors-blue-50)' }}
              transition="background-color 0.1s ease"
              cursor="pointer"
            >
              <Box flex={1}>
                <Text fontSize="sm" fontWeight="medium" color="var(--chakra-colors-fg-default)" mb={0.5}>
                  {account.name}
                </Text>
                <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">
                  {account.agentCount} agent{account.agentCount !== 1 ? 's' : ''} · {account.regions}
                </Text>
              </Box>
              <Flex align="center" gap={1.5} flexShrink={0}>
                <Text fontSize="sm" fontWeight="semibold" color="var(--chakra-colors-fg-default)">
                  {account.count}
                </Text>
                <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">calls</Text>
              </Flex>
            </Flex>
          </Link>
        ))}
      </Box>
    </Box>
  )
}
