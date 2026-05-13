'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Badge, Box, Flex, Input, Stack, Text } from '@chakra-ui/react'
import { SEARCH_RESULTS } from '@/lib/data/searchResults'
import type { FilterState } from '@/lib/types'
import { ResultCard } from './ResultCard'
import { FilterPanel } from './FilterPanel'
import { InsightsPanel } from './InsightsPanel'

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
  const [query, setQuery]       = useState(initialQuery)
  const [inputVal, setInputVal] = useState(initialQuery)
  const [filters, setFilters]   = useState<FilterState>(DEFAULT_FILTERS)
  const [loading, setLoading]   = useState(false)
  const [showInsights, setShowInsights] = useState(true)

  function handleSearch(q: string) {
    setLoading(true)
    setQuery(q)
    router.push(`/search?q=${encodeURIComponent(q)}`, { scroll: false })
    // Simulate brief loading
    setTimeout(() => setLoading(false), 300)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSearch(inputVal)
  }

  // Filter results
  const filteredResults = useMemo(() => {
    let results = [...SEARCH_RESULTS]

    // Query match (simple: title, topics, aiSummary)
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

    if (filters.flaggedOnly) {
      results = results.filter(r => r.flags.length > 0)
    }
    if (filters.severity.length > 0) {
      results = results.filter(r => filters.severity.includes(r.severity))
    }
    if (filters.flags.length > 0) {
      results = results.filter(r => r.flags.some(f => filters.flags.includes(f)))
    }
    if (filters.regions.length > 0) {
      results = results.filter(r => filters.regions.includes(r.region))
    }
    if (filters.agents.length > 0) {
      results = results.filter(r => filters.agents.includes(r.agentName))
    }

    return results
  }, [query, filters])

  function resetFilters() {
    setFilters(DEFAULT_FILTERS)
  }

  const activeFilterCount = filters.severity.length + filters.flags.length + filters.regions.length + filters.agents.length + filters.issueCategories.length + (filters.flaggedOnly ? 1 : 0)

  return (
    <Flex h="100%" overflow="hidden">
      {/* ── Filter panel ─────────────────────────────────────────────── */}
      <FilterPanel filters={filters} onChange={setFilters} />

      {/* ── Main content ─────────────────────────────────────────────── */}
      <Flex flex={1} flexDirection="column" overflow="hidden">
        {/* Search bar + controls */}
        <Box
          px={5}
          py={3}
          borderBottomWidth="1px"
          borderColor="var(--chakra-colors-border-subtle)"
          bg="var(--chakra-colors-bg-panel)"
          flexShrink={0}
        >
          <Flex align="center" gap={3} mb={2}>
            <Box
              flex={1}
              bg="var(--chakra-colors-bg-subtle)"
              borderWidth="1px"
              borderColor="var(--chakra-colors-border-subtle)"
              rounded="sm"
              _focusWithin={{ borderColor: 'var(--chakra-colors-blue-400)' }}
              transition="border-color 0.15s ease"
            >
              <Flex align="center" gap={2} px={3} py="7px">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <Input
                  placeholder="Refine search…"
                  border="none"
                outline="none"
                _focusVisible={{ boxShadow: 'none' }}
                  fontSize="sm"
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </Flex>
            </Box>
            <Box
              as="button"
              px={3}
              py="6px"
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
          <Flex align="center" gap={2}>
            <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">
              {loading ? 'Searching…' : `${filteredResults.length} result${filteredResults.length !== 1 ? 's' : ''}`}
              {query && ` for "${query}"`}
            </Text>
            {activeFilterCount > 0 && (
              <>
                <Badge colorPalette="blue" variant="subtle" size="sm">{activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}</Badge>
                <Text
                  fontSize="xs"
                  color="var(--chakra-colors-blue-600)"
                  cursor="pointer"
                  _hover={{ textDecoration: 'underline' }}
                  onClick={resetFilters}
                >
                  Clear
                </Text>
              </>
            )}
          </Flex>
        </Box>

        <Flex flex={1} overflow="hidden">
          {/* Results list */}
          <Box flex={1} overflowY="auto" px={5} py={4}>
            {loading ? (
              <Stack gap={3}>
                {[1, 2, 3].map(i => (
                  <Box key={i} bg="var(--chakra-colors-bg-panel)" borderWidth="1px" borderColor="var(--chakra-colors-border-subtle)" rounded="sm" h="180px" />
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

          {/* Insights panel */}
          {showInsights && (
            <InsightsPanel results={filteredResults} query={query} />
          )}
        </Flex>
      </Flex>
    </Flex>
  )
}
