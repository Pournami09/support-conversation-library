import { Badge, Box, Flex, Grid, Stack, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { SAVED_VIEWS, COLLECTIONS } from '@/lib/data/savedViews'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text fontSize="xs" fontWeight="semibold" letterSpacing="wider" textTransform="uppercase" color="var(--chakra-colors-fg-muted)" mb={3}>
      {children}
    </Text>
  )
}

const VIEW_ICONS: Record<string, string> = {
  alert:      "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  'trend-down': "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6",
  billing:    "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
  shield:     "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  rocket:     "M13 10V3L4 14h7v7l9-11h-7z",
}

export function CollectionsView() {
  return (
    <Box px={8} py={6}>
      <Flex align="center" gap={3} mb={6}>
        <Text fontSize="2xl" fontWeight="semibold" color="var(--chakra-colors-fg-default)" lineHeight="none">
          Saved Views & Collections
        </Text>
      </Flex>

      {/* Saved views */}
      <Box mb={8}>
        <SectionLabel>Saved views</SectionLabel>
        <Grid templateColumns="repeat(3, 1fr)" gap={3}>
          {SAVED_VIEWS.map(view => (
            <Link key={view.id} href={`/search?q=${encodeURIComponent(view.query)}`}>
            <Box
              display="block"
              bg="var(--chakra-colors-bg-panel)"
              borderWidth="1px"
              borderColor="var(--chakra-colors-border-subtle)"
              rounded="sm"
              p={4}
              _hover={{ borderColor: 'var(--chakra-colors-blue-300)', bg: 'var(--chakra-colors-blue-50)' }}
              transition="background-color 0.15s ease, border-color 0.15s ease"
            >
              <Flex align="flex-start" gap={3}>
                <Box color="var(--chakra-colors-blue-500)" flexShrink={0} mt="1px">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={VIEW_ICONS[view.icon] ?? VIEW_ICONS.alert} />
                  </svg>
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="medium" color="var(--chakra-colors-fg-default)" mb={0.5}>
                    {view.name}
                  </Text>
                  <Text fontSize="xs" color="var(--chakra-colors-fg-muted)" mb={2} lineHeight="tall">
                    {view.description}
                  </Text>
                  <Flex align="center" gap={2}>
                    <Badge colorPalette="blue" variant="subtle" size="sm">{view.callCount} calls</Badge>
                    <Text fontSize="xs" color="var(--chakra-colors-fg-subtle)">Updated {view.lastUpdated}</Text>
                  </Flex>
                </Box>
              </Flex>
            </Box>
            </Link>
          ))}
        </Grid>
      </Box>

      {/* Evidence collections */}
      <Box>
        <Flex align="center" justify="space-between" mb={3}>
          <SectionLabel>Evidence collections</SectionLabel>
          <Box
            as="button"
            px={3}
            py="5px"
            borderWidth="1px"
            borderColor="var(--chakra-colors-border-subtle)"
            rounded="sm"
            fontSize="xs"
            color="var(--chakra-colors-fg-muted)"
            cursor="pointer"
            _hover={{ bg: 'var(--chakra-colors-blue-50)' }}
            transition="background-color 0.15s ease"
          >
            + New collection
          </Box>
        </Flex>
        <Stack gap={2}>
          {COLLECTIONS.map(col => (
            <Box
              key={col.id}
              bg="var(--chakra-colors-bg-panel)"
              borderWidth="1px"
              borderColor="var(--chakra-colors-border-subtle)"
              rounded="sm"
              px={4}
              py={3}
              _hover={{ borderColor: 'var(--chakra-colors-blue-200)' }}
              transition="border-color 0.15s ease"
            >
              <Flex align="center" justify="space-between">
                <Box>
                  <Text fontSize="sm" fontWeight="medium" color="var(--chakra-colors-fg-default)" mb={0.5}>
                    {col.name}
                  </Text>
                  <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">{col.description}</Text>
                </Box>
                <Flex align="center" gap={3} flexShrink={0}>
                  <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">{col.callCount} calls</Text>
                  <Text fontSize="xs" color="var(--chakra-colors-fg-subtle)">{col.lastUpdated}</Text>
                  <Box
                    as="button"
                    px={2.5}
                    py="4px"
                    borderWidth="1px"
                    borderColor="var(--chakra-colors-border-subtle)"
                    rounded="sm"
                    fontSize="xs"
                    color="var(--chakra-colors-fg-muted)"
                    cursor="pointer"
                    _hover={{ bg: 'var(--chakra-colors-blue-50)' }}
                    transition="background-color 0.15s ease"
                  >
                    Open
                  </Box>
                </Flex>
              </Flex>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
