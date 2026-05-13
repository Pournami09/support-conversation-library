'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Badge, Box, Flex, Grid, Input, Stack, Text,
} from '@chakra-ui/react'
import { SAVED_VIEWS } from '@/lib/data/savedViews'
import { THEMES } from '@/lib/data/themes'
import { RECENT_SEARCHES, SUGGESTED_SEARCHES } from '@/lib/data/searchResults'
import { TrendBadge } from '@/components/shared/Badges'

// ── Icons ──────────────────────────────────────────────────────────────────

function Icon({ d }: { d: string }) {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  )
}

const ICONS = {
  search:    "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  clock:     "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  bookmark:  "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z",
  alert:     "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  trendDown: "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6",
  billing:   "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
  shield:    "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  rocket:    "M13 10V3L4 14h7v7l9-11h-7z",
  tag:       "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z",
}

// ── Saved view icon map ────────────────────────────────────────────────────

const VIEW_ICON: Record<string, string> = {
  alert:      ICONS.alert,
  'trend-down': ICONS.trendDown,
  billing:    ICONS.billing,
  shield:     ICONS.shield,
  rocket:     ICONS.rocket,
}

// ── Section header ─────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text
      fontSize="xs"
      fontWeight="semibold"
      letterSpacing="wider"
      textTransform="uppercase"
      color="var(--chakra-colors-fg-muted)"
      mb={2}
    >
      {children}
    </Text>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

export function HomeSearch() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  function handleSearch(q: string) {
    if (!q.trim()) return
    router.push(`/search?q=${encodeURIComponent(q.trim())}`)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSearch(query)
  }

  return (
    <Box px={10} pt={12} pb={8} maxW="1000px" mx="auto">

      {/* ── Page header ──────────────────────────────────────────────── */}
      <Box mb={8} textAlign="center">
        <Text fontSize="2xl" fontWeight="semibold" color="var(--chakra-colors-fg-default)" mb={1}>
          Support Conversation Library
        </Text>
        <Text fontSize="sm" color="var(--chakra-colors-fg-muted)">
          Search 100,000+ transcripts · find patterns · gather evidence
        </Text>
      </Box>

      {/* ── Search bar ───────────────────────────────────────────────── */}
      <Box
        bg="var(--chakra-colors-bg-panel)"
        borderWidth="1px"
        borderColor="var(--chakra-colors-border-subtle)"
        rounded="sm"
        mb={8}
        _focusWithin={{ borderColor: 'var(--chakra-colors-blue-500)', boxShadow: '0 0 0 3px var(--chakra-colors-blue-100)' }}
        transition="box-shadow 0.15s ease, border-color 0.15s ease"
      >
        <Flex align="center" gap={3} px={4} py={3}>
          <Box color="var(--chakra-colors-fg-muted)" flexShrink={0}>
            <Icon d={ICONS.search} />
          </Box>
          <Input
            placeholder="Search calls, issues, quotes, accounts, or themes…"
            border="none"
            outline="none"
            _focusVisible={{ boxShadow: 'none' }}
            fontSize="sm"
            color="var(--chakra-colors-fg-default)"
            _placeholder={{ color: 'var(--chakra-colors-fg-muted)' }}
            flex={1}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {query.length > 0 && (
            <Box
              as="button"
              px={3}
              py="5px"
              bg="var(--chakra-colors-blue-600)"
              color="white"
              fontSize="xs"
              fontWeight="medium"
              rounded="sm"
              cursor="pointer"
              _hover={{ bg: 'var(--chakra-colors-blue-700)' }}
              transition="background-color 0.15s ease"
              _active={{ transform: 'scale(0.97)' }}
              onClick={() => handleSearch(query)}
            >
              Search
            </Box>
          )}
        </Flex>
      </Box>

      {/* ── Two-column quick-access area ─────────────────────────────── */}
      <Grid templateColumns="1fr 1fr" gap={5} mb={8}>

        {/* Recent searches */}
        <Box
          bg="var(--chakra-colors-bg-panel)"
          borderWidth="1px"
          borderColor="var(--chakra-colors-border-subtle)"
          rounded="sm"
          p={4}
        >
          <SectionLabel>Recent searches</SectionLabel>
          <Stack gap={0}>
            {RECENT_SEARCHES.map(s => (
              <Flex
                key={s}
                align="center"
                gap={2}
                py="7px"
                px={2}
                rounded="sm"
                cursor="pointer"
                _hover={{ bg: 'var(--chakra-colors-blue-50)' }}
                transition="background-color 0.1s ease"
                onClick={() => handleSearch(s)}
              >
                <Box color="var(--chakra-colors-fg-subtle)" flexShrink={0}>
                  <Icon d={ICONS.clock} />
                </Box>
                <Text fontSize="sm" color="var(--chakra-colors-fg-default)">{s}</Text>
              </Flex>
            ))}
          </Stack>
        </Box>

        {/* Suggested searches */}
        <Box
          bg="var(--chakra-colors-bg-panel)"
          borderWidth="1px"
          borderColor="var(--chakra-colors-border-subtle)"
          rounded="sm"
          p={4}
        >
          <SectionLabel>Suggested</SectionLabel>
          <Flex gap={2} flexWrap="wrap">
            {SUGGESTED_SEARCHES.map(s => (
              <Badge
                key={s}
                colorPalette="blue"
                variant="outline"
                size="sm"
                rounded="sm"
                cursor="pointer"
                _hover={{ bg: 'var(--chakra-colors-blue-50)' }}
                transition="background-color 0.1s ease"
                onClick={() => handleSearch(s)}
              >
                {s}
              </Badge>
            ))}
          </Flex>
        </Box>
      </Grid>

      {/* ── Saved views ───────────────────────────────────────────────── */}
      <Box mb={8}>
        <Flex align="center" justify="space-between" mb={3}>
          <SectionLabel>Saved views</SectionLabel>
          <Text
            fontSize="xs"
            color="var(--chakra-colors-blue-600)"
            cursor="pointer"
            _hover={{ textDecoration: 'underline' }}
            onClick={() => router.push('/collections')}
          >
            View all
          </Text>
        </Flex>
        <Grid templateColumns="repeat(5, 1fr)" gap={3}>
          {SAVED_VIEWS.map(view => (
            <Box
              key={view.id}
              bg="var(--chakra-colors-bg-panel)"
              borderWidth="1px"
              borderColor="var(--chakra-colors-border-subtle)"
              rounded="sm"
              p={3}
              cursor="pointer"
              _hover={{ borderColor: 'var(--chakra-colors-blue-300)', bg: 'var(--chakra-colors-blue-50)' }}
              transition="background-color 0.15s ease, border-color 0.15s ease"
              onClick={() => router.push(`/search?q=${encodeURIComponent(view.query)}`)}
            >
              <Box color="var(--chakra-colors-blue-500)" mb={2}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={VIEW_ICON[view.icon] ?? ICONS.bookmark} />
                </svg>
              </Box>
              <Text fontSize="xs" fontWeight="medium" color="var(--chakra-colors-fg-default)" mb={1} lineHeight="snug">
                {view.name}
              </Text>
              <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">
                {view.callCount} calls
              </Text>
            </Box>
          ))}
        </Grid>
      </Box>

      {/* ── Trending themes ───────────────────────────────────────────── */}
      <Box>
        <Flex align="center" justify="space-between" mb={3}>
          <SectionLabel>Trending themes</SectionLabel>
          <Text
            fontSize="xs"
            color="var(--chakra-colors-blue-600)"
            cursor="pointer"
            _hover={{ textDecoration: 'underline' }}
            onClick={() => router.push('/themes')}
          >
            Browse all themes →
          </Text>
        </Flex>
        <Grid templateColumns="repeat(3, 1fr)" gap={3}>
          {THEMES.filter(t => t.trend === 'rising').slice(0, 3).map(theme => (
            <Box
              key={theme.id}
              bg="var(--chakra-colors-bg-panel)"
              borderWidth="1px"
              borderColor="var(--chakra-colors-border-subtle)"
              rounded="sm"
              p={4}
              cursor="pointer"
              _hover={{ borderColor: 'var(--chakra-colors-blue-300)' }}
              transition="border-color 0.15s ease"
              onClick={() => router.push(`/themes?theme=${theme.id}`)}
            >
              <Flex align="center" justify="space-between" mb={2}>
                <Text fontSize="sm" fontWeight="medium" color="var(--chakra-colors-fg-default)">
                  {theme.name}
                </Text>
                <TrendBadge trend={theme.trend} percent={theme.trendPercent} />
              </Flex>
              <Text fontSize="xs" color="var(--chakra-colors-fg-muted)" mb={2} lineHeight="tall">
                {theme.callCount} calls · {theme.regions.join(', ')}
              </Text>
              <Text fontSize="xs" color="var(--chakra-colors-fg-subtle)" lineHeight="tall" fontStyle="italic" style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' } as React.CSSProperties}>
                {theme.evidenceSnippet}
              </Text>
            </Box>
          ))}
        </Grid>
      </Box>
    </Box>
  )
}
