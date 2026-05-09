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

export function ThemesList() {
  const searchParams = useSearchParams()
  const initialTheme = searchParams.get('theme')
  const [activeThemeId, setActiveThemeId] = useState<string | null>(initialTheme)

  const activeTheme = THEMES.find(t => t.id === activeThemeId) ?? null

  const rising   = THEMES.filter(t => t.trend === 'rising')
  const stable   = THEMES.filter(t => t.trend === 'stable')
  const declining= THEMES.filter(t => t.trend === 'declining')

  function renderGroup(title: string, themes: Theme[]) {
    if (themes.length === 0) return null
    return (
      <Box mb={8}>
        <Flex align="center" gap={3} mb={3}>
          <Text fontSize="sm" fontWeight="semibold" color="var(--chakra-colors-fg-default)">{title}</Text>
          <Badge colorPalette="gray" variant="subtle" size="sm">{themes.length}</Badge>
        </Flex>
        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
          {themes.map(theme => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              isActive={activeThemeId === theme.id}
              onClick={() => setActiveThemeId(activeThemeId === theme.id ? null : theme.id)}
            />
          ))}
        </Grid>
      </Box>
    )
  }

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
          <Badge colorPalette="blue" variant="subtle" size="sm" rounded="sm">
            {THEMES.length}
          </Badge>
        </Flex>
        <Text fontSize="sm" color="var(--chakra-colors-fg-muted)" mb={6}>
          AI-detected patterns across customer conversations. Click a theme to explore evidence and example calls.
        </Text>

        {/* Theme groups */}
        {renderGroup('Rising themes', rising)}
        {renderGroup('Stable themes', stable)}
        {renderGroup('Declining themes', declining)}

        {/* No themes selected state */}
        {!activeTheme && (
          <Box
            bg="var(--chakra-colors-bg-panel)"
            borderWidth="1px"
            borderColor="var(--chakra-colors-border-subtle)"
            rounded="sm"
            px={5}
            py={4}
            maxW="480px"
          >
            <Text fontSize="sm" fontWeight="medium" color="var(--chakra-colors-fg-default)" mb={1}>
              Select a theme to explore
            </Text>
            <Text fontSize="sm" color="var(--chakra-colors-fg-muted)">
              Click any theme card to see a summary, why it matters, representative quotes, and example calls.
            </Text>
          </Box>
        )}
      </Box>

      {/* Theme drawer */}
      {activeTheme && (
        <>
          {/* Backdrop */}
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
