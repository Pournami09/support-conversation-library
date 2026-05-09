import { Badge, Box, Flex, Table, Text } from '@chakra-ui/react'
import Link from 'next/link'
import type { Transcript } from '@/lib/types'

export function TranscriptsList({ transcripts }: { transcripts: Transcript[] }) {
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
            {['Date', 'Time', 'Agent', 'Customer', 'Account', 'Region', 'Duration', 'Tags'].map(col => (
              <Table.ColumnHeader
                key={col}
                py={3}
                px={4}
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
          {transcripts.map((t) => (
            <Table.Row
              key={t.id}
              borderTopWidth="1px"
              borderColor="var(--chakra-colors-border-subtle)"
              _hover={{ bg: 'var(--chakra-colors-blue-50)' }}
              transition="background-color 0.1s ease"
              cursor="pointer"
            >
              <Table.Cell py={3} px={4}>
                <Link href={`/transcripts/${t.id}`} style={{ display: 'block' }}>
                  <Text fontSize="sm" color="var(--chakra-colors-fg-default)">{t.date}</Text>
                </Link>
              </Table.Cell>
              <Table.Cell py={3} px={4}>
                <Link href={`/transcripts/${t.id}`} style={{ display: 'block' }}>
                  <Text fontSize="sm" color="var(--chakra-colors-fg-muted)">{t.time}</Text>
                </Link>
              </Table.Cell>
              <Table.Cell py={3} px={4}>
                <Link href={`/transcripts/${t.id}`} style={{ display: 'block' }}>
                  <Text fontSize="sm" color="var(--chakra-colors-fg-default)">{t.agentName}</Text>
                </Link>
              </Table.Cell>
              <Table.Cell py={3} px={4}>
                <Link href={`/transcripts/${t.id}`} style={{ display: 'block' }}>
                  <Text fontSize="sm" color="var(--chakra-colors-fg-default)">{t.customerName}</Text>
                </Link>
              </Table.Cell>
              <Table.Cell py={3} px={4}>
                <Link href={`/transcripts/${t.id}`} style={{ display: 'block' }}>
                  <Text fontSize="sm" color="var(--chakra-colors-fg-muted)">{t.accountName}</Text>
                </Link>
              </Table.Cell>
              <Table.Cell py={3} px={4}>
                <Link href={`/transcripts/${t.id}`} style={{ display: 'block' }}>
                  <Text fontSize="sm" color="var(--chakra-colors-fg-muted)">{t.region}</Text>
                </Link>
              </Table.Cell>
              <Table.Cell py={3} px={4}>
                <Link href={`/transcripts/${t.id}`} style={{ display: 'block' }}>
                  <Text fontSize="sm" color="var(--chakra-colors-fg-muted)">{t.duration}</Text>
                </Link>
              </Table.Cell>
              <Table.Cell py={3} px={4}>
                <Link href={`/transcripts/${t.id}`} style={{ display: 'block' }}>
                  <Flex gap={1} flexWrap="wrap">
                    {t.tags.map(tag => (
                      <Badge key={tag} colorPalette="blue" variant="subtle" size="sm">{tag}</Badge>
                    ))}
                  </Flex>
                </Link>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  )
}
