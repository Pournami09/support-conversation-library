'use client'

import { useState } from 'react'
import { Badge, Box, Flex, Grid, Stack, Text } from '@chakra-ui/react'
import { useSearchParams } from 'next/navigation'
import { THEMES } from '@/lib/data/themes'
import type { Theme } from '@/lib/types'
import { TrendBadge } from '@/components/shared/Badges'
import { ThemeDrawer } from './ThemeDrawer'

function ThemeCard({ theme, isActive, onClick }: { theme: Theme; isActive: boolean; onClick: () => void }) {
  const trendColor = theme.trend === 'rising' ? 'var(--chakra-colors-red-500)' : theme.trend === 'declining' ? 'var(--chakra-colors-green-500)' : 'var(--chakra-colors-gray-400)'

  return (
    <Box
      bg="var(--chakra-colors-bg-panel)"
      borderWidth={isActive ? '2px' : '1px'}
      borderColor={isActive ? 'var(--chakra-colors-blue-400)' : 'var(--chakra-colors-border-subtle)'}
      rounded="sm"
      overflow="hidden"
      cursor="pointer"
      _hover={{ borderColor: 'var(--chakra-colors-blue-300)' }}
      transition="border-color 0.15s ease"
      onClick={onClick}
    >
      {/* Trend bar at top */}
      <Box h="3px" bg={trendColor} opacity={0.6} />

      <Box px={4} py={4}>
        <Flex align="flex-start" justify="space-between" gap={2} mb={2}>
          <Text fontSize="sm" fontWeight="semibold" color="var(--chakra-colors-fg-default)" lineHeight="snug">
            {theme.name}
          </Text>
          <TrendBadge trend={theme.trend} percent={theme.trendPercent} />
        </Flex>

        <Flex align="center" gap={2} mb={3}>
          <Text fontSize="xs" fontWeight="semibold" color="var(--chakra-colors-fg-default)">{theme.callCount}</Text>
          <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">calls</Text>
          <Text fontSize="xs" color="var(--chakra-colors-fg-subtle)">·</Text>
          <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">{theme.productArea}</Text>
        </Flex>

        <Text fontSize="xs" color="var(--chakra-colors-fg-muted)" lineHeight="tall" mb={3} style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' } as React.CSSProperties}>
          {theme.summary}
        </Text>

        {/* Evidence snippet */}
        <Box
          bg="var(--chakra-colors-bg-subtle)"
          borderWidth="1px"
          borderColor="var(--chakra-colors-border-subtle)"
          borderLeftWidth="2px"
          borderLeftColor="var(--chakra-colors-blue-300)"
          rounded="sm"
          px={3}
          py={2}
          mb={3}
        >
          <Text fontSize="xs" color="var(--chakra-colors-fg-muted)" fontStyle="italic" style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' } as React.CSSProperties} lineHeight="tall">
            {theme.evidenceSnippet}
          </Text>
          <Text fontSize="xs" color="var(--chakra-colors-fg-subtle)" mt={1}>{theme.evidenceAccount}</Text>
        </Box>

        {/* Tags */}
        <Flex gap={1.5} flexWrap="wrap" mb={3}>
          {theme.tags.slice(0, 3).map(t => (
            <Badge key={t} colorPalette="blue" variant="subtle" size="sm" rounded="sm">{t}</Badge>
          ))}
          {theme.tags.length > 3 && (
            <Badge colorPalette="gray" variant="subtle" size="sm" rounded="sm">+{theme.tags.length - 3}</Badge>
          )}
        </Flex>

        {/* Regions */}
        <Flex align="center" gap={2}>
          <Text fontSize="xs" color="var(--chakra-colors-fg-subtle)">Regions:</Text>
          <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">{theme.regions.join(' · ')}</Text>
        </Flex>
      </Box>

      {/* Footer action */}
      <Box
        px={4}
        py={2.5}
        borderTopWidth="1px"
        borderColor="var(--chakra-colors-border-subtle)"
        bg="var(--chakra-colors-bg-subtle)"
      >
        <Text fontSize="xs" color="var(--chakra-colors-blue-600)" fontWeight="medium">
          View {theme.relatedCalls.length} example calls →
        </Text>
      </Box>
    </Box>
  )
}

type TabId = 'all' | 'rising' | 'stable' | 'declining'

const TAB_META: { id: TabId; label: string; dotColor: string }[] = [
  { id: 'all',      label: 'All',       dotColor: '' },
  { id: 'rising',   label: 'Rising',    dotColor: 'var(--chakra-colors-red-400)' },
  { id: 'stable',   label: 'Stable',    dotColor: 'var(--chakra-colors-gray-400)' },
  { id: 'declining',label: 'Declining', dotColor: 'var(--chakra-colors-green-500)' },
]

export function ThemesList() {
  const searchParams = useSearchParams()
  const initialTheme = searchParams.get('theme')
  const [activeThemeId, setActiveThemeId] = useState<string | null>(initialTheme)
  const [activeTab, setActiveTab] = useState<TabId>('all')

  const activeTheme = THEMES.find(t => t.id === activeThemeId) ?? null

  const counts: Record<TabId, number> = {
    all:       THEMES.length,
    rising:    THEMES.filter(t => t.trend === 'rising').length,
    stable:    THEMES.filter(t => t.trend === 'stable').length,
    declining: THEMES.filter(t => t.trend === 'declining').length,
  }

  const visibleThemes: Theme[] = activeTab === 'all'
    ? THEMES
    : THEMES.filter(t => t.trend === activeTab)

  return (
    <Box position="relative">
      <Box
        px={8}
        py={6}
        style={{ marginRight: activeTheme ? '420px' : '0', transition: 'margin-right 0.2s cubic-bezier(0.215, 0.61, 0.355, 1)' }}
      >
        {/* Page header */}
        <Flex align="center" gap={3} mb={2}>
          <Text fontSize="2xl" fontWeight="semibold" color="var(--chakra-colors-fg-default)" lineHeight="none">
            Themes & Insights
          </Text>
        </Flex>
        <Text fontSize="sm" color="var(--chakra-colors-fg-muted)" mb={5}>
          AI-detected patterns across customer conversations. Click a theme to explore evidence and example calls.
        </Text>

        {/* Tab bar */}
        <Flex
          gap={1}
          mb={5}
          borderBottom="1px solid var(--chakra-colors-border-subtle)"
          pb={0}
        >
          {TAB_META.map(tab => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  fontSize: '13px',
                  fontWeight: isActive ? '600' : '400',
                  color: isActive ? 'var(--chakra-colors-fg-default)' : 'var(--chakra-colors-fg-muted)',
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '2px solid var(--chakra-colors-blue-500)' : '2px solid transparent',
                  marginBottom: '-1px',
                  cursor: 'pointer',
                  transition: 'color 0.15s, border-color 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.dotColor && (
                  <span style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: tab.dotColor,
                    flexShrink: 0,
                    display: 'inline-block',
                  }} />
                )}
                {tab.label}
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '18px',
                  height: '18px',
                  padding: '0 5px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: '600',
                  background: isActive ? 'var(--chakra-colors-blue-100)' : 'var(--chakra-colors-bg-subtle)',
                  color: isActive ? 'var(--chakra-colors-blue-700)' : 'var(--chakra-colors-fg-muted)',
                  transition: 'background 0.15s, color 0.15s',
                }}>
                  {counts[tab.id]}
                </span>
              </button>
            )
          })}
        </Flex>

        {/* Theme grid */}
        {visibleThemes.length > 0 ? (
          <Grid templateColumns="repeat(3, 1fr)" gap={4}>
            {visibleThemes.map(theme => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                isActive={activeThemeId === theme.id}
                onClick={() => setActiveThemeId(activeThemeId === theme.id ? null : theme.id)}
              />
            ))}
          </Grid>
        ) : (
          <Box py={12} textAlign="center">
            <Text fontSize="sm" color="var(--chakra-colors-fg-muted)">No themes in this category.</Text>
          </Box>
        )}

      </Box>

      {/* Theme drawer */}
      {activeTheme && (
        <>
          <Box
            position="fixed"
            inset={0}
            zIndex={99}
            onClick={() => setActiveThemeId(null)}
          />
          <ThemeDrawer
            theme={activeTheme}
            onClose={() => setActiveThemeId(null)}
          />
        </>
      )}
    </Box>
  )
}
