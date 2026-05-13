'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Badge, Box, Flex, Stack, Text } from '@chakra-ui/react'
import { SEARCH_RESULTS } from '@/lib/data/searchResults'
import type { FilterState } from '@/lib/types'
import { ResultCard } from './ResultCard'
import { InsightsPanel } from './InsightsPanel'
import { UnifiedSearchBar } from './UnifiedSearchBar'

const DEFAULT_FILTERS: FilterState = {
  dateRange: 'all',
  agents: [],
  regions: [],
  issueCategories: [],
  severity: [],
  flags: [],
  durationRange: 'any',
  flaggedOnly: false,
}

interface SearchResultsProps {
  initialQuery: string
}

export function SearchResults({ initialQuery }: SearchResultsProps) {
  const router = useRouter()
  const [query, setQuery]     = useState(initialQuery)
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [loading, setLoading] = useState(false)
  const [showInsights, setShowInsights] = useState(true)

  function handleSearch(q: string) {
    setLoading(true)
    setQuery(q)
    router.push(`/search?q=${encodeURIComponent(q)}`, { scroll: false })
    setTimeout(() => setLoading(false), 300)
  }

  // Filter results
  const filteredResults = useMemo(() => {
    let results = [...SEARCH_RESULTS]

    if (query.trim()) {
      const q = query.toLowerCase()
      results = results.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.aiSummary.toLowerCase().includes(q) ||
        r.topics.some(t => t.toLowerCase().includes(q)) ||
        r.accountName.toLowerCase().includes(q) ||
        r.agentName.toLowerCase().includes(q) ||
        r.snippets.some(s => s.text.toLowerCase().includes(q))
      )
    }

    if (filters.flaggedOnly)        results = results.filter(r => r.flags.length > 0)
    if (filters.severity.length > 0) results = results.filter(r => filters.severity.includes(r.severity))
    if (filters.flags.length > 0)   results = results.filter(r => r.flags.some(f => filters.flags.includes(f)))
    if (filters.regions.length > 0) results = results.filter(r => filters.regions.includes(r.region))
    if (filters.agents.length > 0)  results = results.filter(r => filters.agents.includes(r.agentName))

    return results
  }, [query, filters])

  function resetFilters() { setFilters(DEFAULT_FILTERS) }

  const activeFilterCount =
    filters.severity.length + filters.flags.length + filters.regions.length +
    filters.agents.length + filters.issueCategories.length + (filters.flaggedOnly ? 1 : 0)

  return (
    <Flex h="100%" overflow="hidden" flexDirection="column">

      {/* ── Unified search + filter bar ──────────────────────────────── */}
      <Box
        px={5}
        pt={4}
        pb={3}
        borderBottomWidth="1px"
        borderColor="var(--chakra-colors-border-subtle)"
        bg="var(--chakra-colors-bg-subtle)"
        flexShrink={0}
      >
        <UnifiedSearchBar
          query={query}
          filters={filters}
          onChange={setFilters}
          onSearch={handleSearch}
          alwaysExpanded
        />
      </Box>

      {/* ── Result count + insights toggle ───────────────────────────── */}
      <Box
        px={5}
        py="9px"
        borderBottomWidth="1px"
        borderColor="var(--chakra-colors-border-subtle)"
        bg="var(--chakra-colors-bg-panel)"
        flexShrink={0}
      >
        <Flex align="center" gap={2}>
          <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">
            {loading ? 'Searching…' : `${filteredResults.length} result${filteredResults.length !== 1 ? 's' : ''}`}
            {query && ` for "${query}"`}
          </Text>
          {activeFilterCount > 0 && (
            <>
              <Badge colorPalette="blue" variant="subtle" size="sm">
                {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}
              </Badge>
              <Text
                fontSize="xs"
                color="var(--chakra-colors-blue-600)"
                cursor="pointer"
                _hover={{ textDecoration: 'underline' }}
                onClick={resetFilters}
              >
                Clear all
              </Text>
            </>
          )}
          <Box flex={1} />
          <Box
            as="button"
            px={2.5}
            py="4px"
            borderWidth="1px"
            borderColor="var(--chakra-colors-border-subtle)"
            rounded="sm"
            fontSize="xs"
            color="var(--chakra-colors-fg-muted)"
            _hover={{ bg: 'var(--chakra-colors-blue-50)' }}
            transition="background-color 0.15s ease"
            onClick={() => setShowInsights(p => !p)}
          >
            {showInsights ? 'Hide insights' : 'Show insights'}
          </Box>
        </Flex>
      </Box>

      {/* ── Results + insights ───────────────────────────────────────── */}
      <Flex flex={1} overflow="hidden">
        <Box flex={1} overflowY="auto" px={5} py={4}>
          {loading ? (
            <Stack gap={3}>
              {[1, 2, 3].map(i => (
                <Box
                  key={i}
                  bg="var(--chakra-colors-bg-panel)"
                  borderWidth="1px"
                  borderColor="var(--chakra-colors-border-subtle)"
                  rounded="sm"
                  h="180px"
                />
              ))}
            </Stack>
          ) : filteredResults.length === 0 ? (
            <Box
              bg="var(--chakra-colors-bg-panel)"
              borderWidth="1px"
              borderColor="var(--chakra-colors-border-subtle)"
              rounded="sm"
              px={6}
              py={10}
              textAlign="center"
            >
              <Text fontSize="sm" fontWeight="medium" color="var(--chakra-colors-fg-default)" mb={1}>
                No results found
              </Text>
              <Text fontSize="sm" color="var(--chakra-colors-fg-muted)" mb={3}>
                Try a different search term or remove some filters.
              </Text>
              {activeFilterCount > 0 && (
                <Box
                  as="button"
                  px={3}
                  py="6px"
                  borderWidth="1px"
                  borderColor="var(--chakra-colors-border-subtle)"
                  rounded="sm"
                  fontSize="xs"
                  color="var(--chakra-colors-fg-default)"
                  cursor="pointer"
                  _hover={{ bg: 'var(--chakra-colors-blue-50)' }}
                  onClick={resetFilters}
                >
                  Clear all filters
                </Box>
              )}
            </Box>
          ) : (
            <Stack gap={3}>
              {filteredResults.map(result => (
                <ResultCard key={result.id} result={result} query={query} />
              ))}
            </Stack>
          )}
        </Box>

        {showInsights && (
          <InsightsPanel results={filteredResults} query={query} />
        )}
      </Flex>
    </Flex>
  )
}
