'use client'

import { Box, Checkbox, Flex, Stack, Switch, Text } from '@chakra-ui/react'
import type { FilterState, SeverityLevel, CallFlag } from '@/lib/types'
import { AGENTS, ISSUE_CATEGORIES, REGIONS } from '@/lib/data/searchResults'

interface FilterPanelProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text
      fontSize="xs"
      fontWeight="semibold"
      letterSpacing="wider"
      textTransform="uppercase"
      color="var(--chakra-colors-fg-muted)"
      mb={2}
      mt={4}
      _first={{ mt: 0 }}
    >
      {children}
    </Text>
  )
}

function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box borderBottomWidth="1px" borderColor="var(--chakra-colors-border-subtle)" pb={4} mb={0}>
      <SectionLabel>{label}</SectionLabel>
      {children}
    </Box>
  )
}

export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  function toggleArrayItem<T>(arr: T[], item: T): T[] {
    return arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item]
  }

  return (
    <Box
      w="224px"
      flexShrink={0}
      bg="var(--chakra-colors-bg-panel)"
      borderRightWidth="1px"
      borderColor="var(--chakra-colors-border-subtle)"
      overflowY="auto"
      px={4}
      py={4}
      fontSize="sm"
    >
      {/* Flagged only toggle */}
      <FilterSection label="Quick filter">
        <Flex align="center" justify="space-between">
          <Text fontSize="sm" color="var(--chakra-colors-fg-default)">Flagged calls only</Text>
          <Switch.Root
            size="sm"
            checked={filters.flaggedOnly}
            onCheckedChange={({ checked }) => onChange({ ...filters, flaggedOnly: checked })}
          >
            <Switch.HiddenInput />
            <Switch.Control />
          </Switch.Root>
        </Flex>
      </FilterSection>

      {/* Date range */}
      <FilterSection label="Date range">
        <Stack gap={1}>
          {(['7d', '30d', '90d', 'all'] as const).map(range => (
            <Flex
              key={range}
              align="center"
              gap={2}
              py="4px"
              cursor="pointer"
              onClick={() => onChange({ ...filters, dateRange: range })}
            >
              <Box
                w="14px"
                h="14px"
                rounded="full"
                borderWidth="2px"
                borderColor={filters.dateRange === range
                  ? 'var(--chakra-colors-blue-500)'
                  : 'var(--chakra-colors-border-subtle)'}
                bg={filters.dateRange === range ? 'var(--chakra-colors-blue-500)' : 'transparent'}
                flexShrink={0}
                transition="background-color 0.1s ease, border-color 0.1s ease"
              />
              <Text fontSize="sm" color="var(--chakra-colors-fg-default)">
                {range === '7d' ? 'Last 7 days' : range === '30d' ? 'Last 30 days' : range === '90d' ? 'Last 90 days' : 'All time'}
              </Text>
            </Flex>
          ))}
        </Stack>
      </FilterSection>

      {/* Severity */}
      <FilterSection label="Severity">
        <Stack gap={1}>
          {(['critical', 'high', 'medium', 'low'] as SeverityLevel[]).map(s => (
            <Flex key={s} align="center" gap={2} py="3px">
              <Checkbox.Root
                size="sm"
                checked={filters.severity.includes(s)}
                onCheckedChange={() => onChange({ ...filters, severity: toggleArrayItem(filters.severity, s) })}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control rounded="sm" />
                <Checkbox.Label>
                  <Text fontSize="sm" color="var(--chakra-colors-fg-default)" textTransform="capitalize">{s}</Text>
                </Checkbox.Label>
              </Checkbox.Root>
            </Flex>
          ))}
        </Stack>
      </FilterSection>

      {/* Flags */}
      <FilterSection label="Flags">
        <Stack gap={1}>
          {(['escalation', 'churn-risk', 'product-bug', 'policy-concern', 'coaching-opportunity'] as CallFlag[]).map(f => (
            <Flex key={f} align="center" gap={2} py="3px">
              <Checkbox.Root
                size="sm"
                checked={filters.flags.includes(f)}
                onCheckedChange={() => onChange({ ...filters, flags: toggleArrayItem(filters.flags, f) })}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control rounded="sm" />
                <Checkbox.Label>
                  <Text fontSize="sm" color="var(--chakra-colors-fg-default)">
                    {f === 'churn-risk' ? 'Churn risk'
                      : f === 'product-bug' ? 'Product bug'
                      : f === 'policy-concern' ? 'Policy concern'
                      : f === 'coaching-opportunity' ? 'Coaching'
                      : 'Escalation'}
                  </Text>
                </Checkbox.Label>
              </Checkbox.Root>
            </Flex>
          ))}
        </Stack>
      </FilterSection>

      {/* Issue category */}
      <FilterSection label="Issue category">
        <Stack gap={1}>
          {ISSUE_CATEGORIES.map(cat => (
            <Flex key={cat} align="center" gap={2} py="3px">
              <Checkbox.Root
                size="sm"
                checked={filters.issueCategories.includes(cat)}
                onCheckedChange={() => onChange({ ...filters, issueCategories: toggleArrayItem(filters.issueCategories, cat) })}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control rounded="sm" />
                <Checkbox.Label>
                  <Text fontSize="sm" color="var(--chakra-colors-fg-default)">{cat}</Text>
                </Checkbox.Label>
              </Checkbox.Root>
            </Flex>
          ))}
        </Stack>
      </FilterSection>

      {/* Region */}
      <FilterSection label="Region">
        <Stack gap={1}>
          {REGIONS.map(r => (
            <Flex key={r} align="center" gap={2} py="3px">
              <Checkbox.Root
                size="sm"
                checked={filters.regions.includes(r)}
                onCheckedChange={() => onChange({ ...filters, regions: toggleArrayItem(filters.regions, r) })}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control rounded="sm" />
                <Checkbox.Label>
                  <Text fontSize="sm" color="var(--chakra-colors-fg-default)">{r}</Text>
                </Checkbox.Label>
              </Checkbox.Root>
            </Flex>
          ))}
        </Stack>
      </FilterSection>

      {/* Agent */}
      <FilterSection label="Agent">
        <Stack gap={1}>
          {AGENTS.map(a => (
            <Flex key={a} align="center" gap={2} py="3px">
              <Checkbox.Root
                size="sm"
                checked={filters.agents.includes(a)}
                onCheckedChange={() => onChange({ ...filters, agents: toggleArrayItem(filters.agents, a) })}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control rounded="sm" />
                <Checkbox.Label>
                  <Text fontSize="sm" color="var(--chakra-colors-fg-default)">{a.split(' ')[0]}&nbsp;{a.split(' ')[1][0]}.</Text>
                </Checkbox.Label>
              </Checkbox.Root>
            </Flex>
          ))}
        </Stack>
      </FilterSection>

      {/* Duration */}
      <Box pb={4}>
        <SectionLabel>Call duration</SectionLabel>
        <Stack gap={1}>
          {([
            ['any',    'Any duration'],
            ['short',  'Under 5 min'],
            ['medium', '5–15 min'],
            ['long',   'Over 15 min'],
          ] as const).map(([val, label]) => (
            <Flex
              key={val}
              align="center"
              gap={2}
              py="4px"
              cursor="pointer"
              onClick={() => onChange({ ...filters, durationRange: val })}
            >
              <Box
                w="14px"
                h="14px"
                rounded="full"
                borderWidth="2px"
                borderColor={filters.durationRange === val
                  ? 'var(--chakra-colors-blue-500)'
                  : 'var(--chakra-colors-border-subtle)'}
                bg={filters.durationRange === val ? 'var(--chakra-colors-blue-500)' : 'transparent'}
                flexShrink={0}
                transition="background-color 0.1s ease, border-color 0.1s ease"
              />
              <Text fontSize="sm" color="var(--chakra-colors-fg-default)">{label}</Text>
            </Flex>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
