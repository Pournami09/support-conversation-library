import { Badge, Box, Flex, Table, Text } from '@chakra-ui/react'
import Link from 'next/link'
import type { CallDetailData } from '@/lib/types'

const SEVERITY_PALETTE: Record<string, string> = {
  critical: 'red', high: 'orange', medium: 'yellow', low: 'gray',
}
const QA_PALETTE: Record<string, string> = {
  flagged: 'red', unreviewed: 'yellow', reviewed: 'green',
}
const QA_LABEL: Record<string, string> = {
  flagged: 'Flagged', unreviewed: 'Unreviewed', reviewed: 'Reviewed',
}
const FLAG_LABEL: Record<string, string> = {
  'escalation': 'Escalation',
  'churn-risk': 'Churn Risk',
  'product-bug': 'Bug',
  'policy-concern': 'Policy',
  'coaching-opportunity': 'Coaching',
}
const FLAG_PALETTE: Record<string, string> = {
  'escalation': 'red',
  'churn-risk': 'orange',
  'product-bug': 'gray',
  'policy-concern': 'yellow',
  'coaching-opportunity': 'blue',
}

export function CallsTable({ calls }: { calls: CallDetailData[] }) {
  if (calls.length === 0) {
    return (
      <Box
        bg="var(--chakra-colors-bg-panel)"
        borderWidth="1px"
        borderColor="var(--chakra-colors-border-subtle)"
        rounded="sm"
        px={8} py={12}
        textAlign="center"
      >
        <Text fontSize="sm" color="var(--chakra-colors-fg-muted)">No calls match this filter.</Text>
      </Box>
    )
  }

  return (
    <Box
      bg="var(--chakra-colors-bg-panel)"
      borderWidth="1px"
      borderColor="var(--chakra-colors-border-subtle)"
      rounded="sm"
      overflow="hidden"
    >
      <Table.Root size="sm">
        <Table.Header>
          <Table.Row bg="var(--chakra-colors-bg-subtle)">
            {['Date', 'Agent', 'Customer', 'Account', 'Severity', 'QA Status', 'Flags', 'Duration'].map(col => (
              <Table.ColumnHeader
                key={col}
                py={3} px={4}
                color="var(--chakra-colors-fg-muted)"
                fontWeight="semibold"
                fontSize="xs"
                letterSpacing="wider"
                textTransform="uppercase"
              >
                {col}
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {calls.map(call => (
            <Table.Row
              key={call.id}
              borderTopWidth="1px"
              borderColor="var(--chakra-colors-border-subtle)"
              _hover={{ bg: 'var(--chakra-colors-blue-50)' }}
              transition="background-color 0.1s ease"
              cursor="pointer"
            >
              <Table.Cell py={3} px={4}>
                <Link href={`/transcripts/${call.id}`} style={{ display: 'block' }}>
                  <Text fontSize="sm" color="var(--chakra-colors-fg-default)">{call.date}</Text>
                  <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">{call.time}</Text>
                </Link>
              </Table.Cell>
              <Table.Cell py={3} px={4}>
                <Link href={`/transcripts/${call.id}`} style={{ display: 'block' }}>
                  <Text fontSize="sm" color="var(--chakra-colors-fg-default)">{call.agentName}</Text>
                </Link>
              </Table.Cell>
              <Table.Cell py={3} px={4}>
                <Link href={`/transcripts/${call.id}`} style={{ display: 'block' }}>
                  <Text fontSize="sm" color="var(--chakra-colors-fg-default)">{call.customerName}</Text>
                </Link>
              </Table.Cell>
              <Table.Cell py={3} px={4}>
                <Link href={`/transcripts/${call.id}`} style={{ display: 'block' }}>
                  <Text fontSize="sm" color="var(--chakra-colors-fg-muted)">{call.accountName}</Text>
                </Link>
              </Table.Cell>
              <Table.Cell py={3} px={4}>
                <Link href={`/transcripts/${call.id}`} style={{ display: 'block' }}>
                  <Badge
                    colorPalette={SEVERITY_PALETTE[call.severity] ?? 'gray'}
                    variant="subtle" size="sm" rounded="sm"
                    textTransform="capitalize"
                  >
                    {call.severity}
                  </Badge>
                </Link>
              </Table.Cell>
              <Table.Cell py={3} px={4}>
                <Link href={`/transcripts/${call.id}`} style={{ display: 'block' }}>
                  <Badge
                    colorPalette={QA_PALETTE[call.qaStatus] ?? 'gray'}
                    variant="subtle" size="sm" rounded="sm"
                  >
                    {QA_LABEL[call.qaStatus] ?? call.qaStatus}
                  </Badge>
                </Link>
              </Table.Cell>
              <Table.Cell py={3} px={4}>
                <Link href={`/transcripts/${call.id}`} style={{ display: 'block' }}>
                  <Flex gap={1} flexWrap="wrap">
                    {call.flags.length > 0 ? call.flags.map(f => (
                      <Badge
                        key={f}
                        colorPalette={FLAG_PALETTE[f] ?? 'gray'}
                        variant="subtle" size="sm" rounded="sm"
                      >
                        {FLAG_LABEL[f] ?? f}
                      </Badge>
                    )) : (
                      <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">—</Text>
                    )}
                  </Flex>
                </Link>
              </Table.Cell>
              <Table.Cell py={3} px={4}>
                <Link href={`/transcripts/${call.id}`} style={{ display: 'block' }}>
                  <Text fontSize="sm" color="var(--chakra-colors-fg-muted)">{call.duration}</Text>
                </Link>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  )
}
