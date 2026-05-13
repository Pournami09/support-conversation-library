'use client'

import { Badge, Box, CloseButton, Flex, Stack, Text } from '@chakra-ui/react'
import Link from 'next/link'
import type { Theme } from '@/lib/types'
import { TrendBadge } from '@/components/shared/Badges'

interface ThemeDrawerProps {
  theme: Theme | null
  onClose: () => void
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text fontSize="xs" fontWeight="semibold" letterSpacing="wider" textTransform="uppercase" color="var(--chakra-colors-fg-muted)" mb={2}>
      {children}
    </Text>
  )
}

export function ThemeDrawer({ theme, onClose }: ThemeDrawerProps) {
  if (!theme) return null

  return (
    <Box
      position="fixed"
      right={0}
      top={0}
      bottom={0}
      w="420px"
      bg="var(--chakra-colors-bg-panel)"
      borderLeftWidth="1px"
      borderColor="var(--chakra-colors-border-subtle)"
      overflowY="auto"
      zIndex={100}
      style={{
        transform: 'translateX(0)',
        transition: 'transform 0.2s cubic-bezier(0.215, 0.61, 0.355, 1)',
      }}
    >
      {/* Header */}
      <Box
        px={5}
        py={4}
        borderBottomWidth="1px"
        borderColor="var(--chakra-colors-border-subtle)"
        bg="var(--chakra-colors-bg-subtle)"
        position="sticky"
        top={0}
        zIndex={1}
      >
        <Flex align="flex-start" justify="space-between" gap={3}>
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color="var(--chakra-colors-fg-default)" mb={1}>
              {theme.name}
            </Text>
            <Flex align="center" gap={2}>
              <TrendBadge trend={theme.trend} percent={theme.trendPercent} />
              <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">
                {theme.callCount} calls · {theme.productArea}
              </Text>
            </Flex>
          </Box>
          <CloseButton size="sm" onClick={onClose} />
        </Flex>
      </Box>

      <Box px={5} py={4}>
        <Stack gap={5}>
          {/* Summary */}
          <Box>
            <SectionLabel>Summary</SectionLabel>
            <Text fontSize="sm" color="var(--chakra-colors-fg-default)" lineHeight="tall">
              {theme.summary}
            </Text>
          </Box>

          {/* Why it matters */}
          <Box
            bg="var(--chakra-colors-orange-50)"
            borderWidth="1px"
            borderColor="var(--chakra-colors-orange-200)"
            rounded="sm"
            p={3}
          >
            <SectionLabel>Why it matters</SectionLabel>
            <Text fontSize="sm" color="var(--chakra-colors-fg-default)" lineHeight="tall">
              {theme.whyItMatters}
            </Text>
          </Box>

          {/* Tags */}
          <Box>
            <SectionLabel>Related tags</SectionLabel>
            <Flex gap={1.5} flexWrap="wrap">
              {theme.tags.map(t => (
                <Badge key={t} colorPalette="blue" variant="subtle" size="sm" rounded="sm">{t}</Badge>
              ))}
            </Flex>
          </Box>

          {/* Common language */}
          <Box>
            <SectionLabel>Common customer language</SectionLabel>
            <Stack gap={1.5}>
              {theme.commonLanguage.map((phrase, i) => (
                <Flex key={i} align="flex-start" gap={2}>
                  <Box
                    w="6px"
                    h="6px"
                    rounded="full"
                    bg="var(--chakra-colors-blue-400)"
                    flexShrink={0}
                    mt="5px"
                  />
                  <Text fontSize="sm" color="var(--chakra-colors-fg-default)" fontStyle="italic">
                    "{phrase}"
                  </Text>
                </Flex>
              ))}
            </Stack>
          </Box>

          {/* Representative quotes */}
          <Box>
            <SectionLabel>Representative quotes</SectionLabel>
            <Stack gap={3}>
              {theme.representativeQuotes.map((q, i) => (
                <Box
                  key={i}
                  bg="var(--chakra-colors-bg-subtle)"
                  borderWidth="1px"
                  borderColor="var(--chakra-colors-border-subtle)"
                  borderLeftWidth="3px"
                  borderLeftColor="var(--chakra-colors-blue-400)"
                  rounded="sm"
                  px={3}
                  py={2.5}
                >
                  <Text fontSize="sm" color="var(--chakra-colors-fg-default)" fontStyle="italic" lineHeight="tall" mb={1.5}>
                    "{q.text}"
                  </Text>
                  <Flex align="center" gap={2}>
                    <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">{q.account}</Text>
                    <Text fontSize="xs" color="var(--chakra-colors-fg-subtle)">·</Text>
                    <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">{q.date}</Text>
                  </Flex>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Example calls */}
          <Box>
            <SectionLabel>Example calls</SectionLabel>
            <Stack gap={0}>
              {theme.relatedCalls.map((call, i) => (
                <Link key={call.id} href={`/transcripts/${call.id}`}>
                  <Box
                    display="block"
                    py={2.5}
                    borderBottomWidth={i < theme.relatedCalls.length - 1 ? '1px' : '0'}
                    borderColor="var(--chakra-colors-border-subtle)"
                    _hover={{ bg: 'var(--chakra-colors-blue-50)' }}
                    px={2}
                    rounded="sm"
                    transition="background-color 0.1s ease"
                  >
                    <Text fontSize="sm" color="var(--chakra-colors-blue-700)" mb={0.5} fontWeight="medium">
                      {call.title}
                    </Text>
                    <Flex align="center" gap={2}>
                      <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">{call.account}</Text>
                      <Text fontSize="xs" color="var(--chakra-colors-fg-subtle)">·</Text>
                      <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">{call.date}</Text>
                    </Flex>
                  </Box>
                </Link>
              ))}
            </Stack>
          </Box>

          {/* Regions */}
          <Box>
            <SectionLabel>Regions affected</SectionLabel>
            <Flex gap={1.5} flexWrap="wrap">
              {theme.regions.map(r => (
                <Badge key={r} colorPalette="gray" variant="subtle" size="sm" rounded="sm">{r}</Badge>
              ))}
            </Flex>
          </Box>

          {/* Actions */}
          <Box borderTopWidth="1px" borderColor="var(--chakra-colors-border-subtle)" pt={4}>
            <SectionLabel>Actions</SectionLabel>
            <Flex gap={2} flexWrap="wrap">
              <Box
                as="button"
                px={3}
                py="6px"
                bg="var(--chakra-colors-blue-600)"
                color="white"
                fontSize="xs"
                fontWeight="medium"
                rounded="sm"
                cursor="pointer"
                _hover={{ bg: 'var(--chakra-colors-blue-700)' }}
                transition="background-color 0.15s ease"
                _active={{ transform: 'scale(0.97)' }}
              >
                Save to collection
              </Box>
              <Box
                as="button"
                px={3}
                py="6px"
                borderWidth="1px"
                borderColor="var(--chakra-colors-border-subtle)"
                bg="var(--chakra-colors-bg-panel)"
                color="var(--chakra-colors-fg-default)"
                fontSize="xs"
                rounded="sm"
                cursor="pointer"
                _hover={{ bg: 'var(--chakra-colors-blue-50)' }}
                transition="background-color 0.15s ease"
                _active={{ transform: 'scale(0.97)' }}
              >
                Export theme report
              </Box>
              <Link href={`/search?q=${encodeURIComponent(theme.name)}`}>
                <Box
                  px={3}
                  py="6px"
                  borderWidth="1px"
                  borderColor="var(--chakra-colors-border-subtle)"
                  bg="var(--chakra-colors-bg-panel)"
                  color="var(--chakra-colors-fg-default)"
                  fontSize="xs"
                  rounded="sm"
                  cursor="pointer"
                  display="block"
                  _hover={{ bg: 'var(--chakra-colors-blue-50)' }}
                  transition="background-color 0.15s ease"
                >
                  Search this theme
                </Box>
              </Link>
            </Flex>
          </Box>
        </Stack>
      </Box>
    </Box>
  )
}
