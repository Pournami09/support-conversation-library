import { Badge, Box, Flex, Grid, Stack, Text } from '@chakra-ui/react'
import { SAVED_VIEWS, COLLECTIONS } from '@/lib/data/savedViews'

// ── Icons ──────────────────────────────────────────────────────────────────

function Ico({ children, size = 16 }: { children: React.ReactNode; size?: number }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, display: 'inline-block' }}
    >
      {children}
    </svg>
  )
}
function AlertIcon()   { return <Ico><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></Ico> }
function TrendDownIcon() { return <Ico><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></Ico> }
function BillingIcon() { return <Ico><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></Ico> }
function ShieldIcon()  { return <Ico><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></Ico> }
function RocketIcon()  { return <Ico><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></Ico> }
function FolderIcon()  { return <Ico><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></Ico> }
function PlusIcon()    { return <Ico><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Ico> }

const ICON_MAP: Record<string, React.FC> = {
  'alert':       AlertIcon,
  'trend-down':  TrendDownIcon,
  'billing':     BillingIcon,
  'shield':      ShieldIcon,
  'rocket':      RocketIcon,
}

const ICON_PALETTE: Record<string, { bg: string; color: string }> = {
  'alert':       { bg: 'var(--chakra-colors-red-100)',    color: 'var(--chakra-colors-red-600)' },
  'trend-down':  { bg: 'var(--chakra-colors-orange-100)', color: 'var(--chakra-colors-orange-600)' },
  'billing':     { bg: 'var(--chakra-colors-yellow-100)', color: 'var(--chakra-colors-yellow-700)' },
  'shield':      { bg: 'var(--chakra-colors-blue-100)',   color: 'var(--chakra-colors-blue-600)' },
  'rocket':      { bg: 'var(--chakra-colors-green-100)',  color: 'var(--chakra-colors-green-700)' },
}

// ── Helpers ────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const LATEST_DATE = new Date('2025-03-28')

function isNew(dateStr: string): boolean {
  const d = new Date(dateStr)
  return (LATEST_DATE.getTime() - d.getTime()) < 3 * 24 * 60 * 60 * 1000
}

function daysAgo(dateStr: string): number {
  const d = new Date(dateStr)
  return Math.floor((LATEST_DATE.getTime() - d.getTime()) / (24 * 60 * 60 * 1000))
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function QaSavedViewsPage() {
  return (
    <Box px={8} py={6}>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <Flex align="center" justify="space-between" mb={2}>
        <Flex align="center" gap={3}>
          <Text fontSize="2xl" fontWeight="semibold" color="var(--chakra-colors-fg-default)" lineHeight="none">
            Saved Views
          </Text>
          <Badge colorPalette="blue" variant="subtle" size="sm" rounded="sm">
            {SAVED_VIEWS.length}
          </Badge>
        </Flex>
        <Box
          as="button"
          display="flex"
          alignItems="center"
          gap="6px"
          px={3}
          py="6px"
          borderWidth="1px"
          borderColor="var(--chakra-colors-border-subtle)"
          rounded="sm"
          fontSize="xs"
          fontWeight="medium"
          color="var(--chakra-colors-fg-default)"
          bg="var(--chakra-colors-bg-panel)"
          cursor="pointer"
          _hover={{ bg: 'var(--chakra-colors-bg-subtle)' }}
        >
          <Box color="var(--chakra-colors-fg-muted)"><PlusIcon /></Box>
          New saved view
        </Box>
      </Flex>
      <Text fontSize="sm" color="var(--chakra-colors-fg-muted)" mb={6}>
        Saved QA filters and queue configurations. Open any view to see calls matching that criteria today.
      </Text>

      {/* ── Saved views grid ───────────────────────────────────────── */}
      <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={3} mb={10}>
        {SAVED_VIEWS.map(view => {
          const Icon = ICON_MAP[view.icon] ?? AlertIcon
          const pal  = ICON_PALETTE[view.icon] ?? ICON_PALETTE.alert
          const fresh = isNew(view.lastUpdated)
          const ago   = daysAgo(view.lastUpdated)

          return (
            <a
              key={view.id}
              href={`/search?q=${encodeURIComponent(view.query)}`}
              style={{ display: 'block', textDecoration: 'none' }}
            >
            <Box
              borderWidth="1px"
              borderColor="var(--chakra-colors-border-subtle)"
              bg="var(--chakra-colors-bg-panel)"
              rounded="md"
              px={4}
              py={4}
              cursor="pointer"
              transition="box-shadow 0.15s ease, border-color 0.15s ease"
              _hover={{
                borderColor: 'var(--chakra-colors-blue-300)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              <Flex align="flex-start" gap={3}>
                <Flex
                  w="36px" h="36px" rounded="md" flexShrink={0}
                  bg={pal.bg} color={pal.color}
                  align="center" justify="center"
                >
                  <Icon />
                </Flex>
                <Box flex={1} minW={0}>
                  <Flex align="center" gap={2} mb={0.5}>
                    <Text
                      fontSize="sm" fontWeight="semibold"
                      color="var(--chakra-colors-fg-default)"
                      style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                      {view.name}
                    </Text>
                    {fresh && (
                      <Badge colorPalette="green" variant="subtle" size="sm" rounded="sm" flexShrink={0}>
                        New
                      </Badge>
                    )}
                  </Flex>
                  <Text
                    fontSize="xs" color="var(--chakra-colors-fg-muted)" lineHeight="tall" mb={3}
                    overflow="hidden"
                    style={{ WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical' as const }}
                  >
                    {view.description}
                  </Text>
                  <Flex align="center" justify="space-between">
                    <Flex align="center" gap={1.5}>
                      <Text fontSize="lg" fontWeight="bold" color="var(--chakra-colors-fg-default)" lineHeight="none">
                        {view.callCount}
                      </Text>
                      <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">calls</Text>
                    </Flex>
                    <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">
                      {ago === 0 ? 'Updated today' : ago === 1 ? 'Updated yesterday' : `Updated ${ago}d ago`}
                    </Text>
                  </Flex>
                </Box>
              </Flex>
            </Box>
            </a>
          )
        })}
      </Grid>

      {/* ── Collections ────────────────────────────────────────────── */}
      <Box mb={2}>
        <Flex align="center" gap={3} mb={1}>
          <Text fontSize="lg" fontWeight="semibold" color="var(--chakra-colors-fg-default)">
            Collections
          </Text>
          <Badge colorPalette="gray" variant="subtle" size="sm" rounded="sm">
            {COLLECTIONS.length}
          </Badge>
        </Flex>
        <Text fontSize="sm" color="var(--chakra-colors-fg-muted)" mb={4}>
          Manually curated call sets — use these to build evidence packages or share context with your team.
        </Text>
      </Box>
      <Stack gap={2}>
        {COLLECTIONS.map(col => {
          const ago = daysAgo(col.lastUpdated)
          return (
            <Box
              key={col.id}
              borderWidth="1px"
              borderColor="var(--chakra-colors-border-subtle)"
              bg="var(--chakra-colors-bg-panel)"
              rounded="md"
              px={4}
              py={3}
              cursor="pointer"
              transition="border-color 0.15s ease"
              _hover={{ borderColor: 'var(--chakra-colors-blue-300)' }}
            >
              <Flex align="center" gap={3}>
                <Box color="var(--chakra-colors-fg-muted)"><FolderIcon /></Box>
                <Box flex={1}>
                  <Flex align="center" gap={2} mb={0.5}>
                    <Text fontSize="sm" fontWeight="semibold" color="var(--chakra-colors-fg-default)">
                      {col.name}
                    </Text>
                    <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">·</Text>
                    <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">{col.callCount} calls</Text>
                  </Flex>
                  <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">{col.description}</Text>
                </Box>
                <Text fontSize="xs" color="var(--chakra-colors-fg-muted)" flexShrink={0}>
                  {ago === 0 ? 'Today' : ago === 1 ? 'Yesterday' : `${ago}d ago`}
                </Text>
              </Flex>
            </Box>
          )
        })}
      </Stack>
    </Box>
  )
}
