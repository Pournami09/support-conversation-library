'use client'

import { useState } from 'react'
import { Badge, Box, CloseButton, Flex, Stack, Text } from '@chakra-ui/react'
import Link from 'next/link'
import type { Theme } from '@/lib/types'
import { TrendBadge } from '@/components/shared/Badges'

// ── Quote card ─────────────────────────────────────────────────────────────
// Copy icon always visible top-right; arrow appears on hover bottom-right.

function QuoteCard({ text, account, date, callId }: { text: string; account: string; date: string; callId?: string }) {
  const [hovered, setHovered] = useState(false)
  const [copied,  setCopied]  = useState(false)

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation()
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <Box
      bg="var(--chakra-colors-bg-subtle)"
      borderWidth="1px"
      borderColor={hovered ? 'var(--chakra-colors-blue-200)' : 'var(--chakra-colors-border-subtle)'}
      borderLeftWidth="3px"
      borderLeftColor="var(--chakra-colors-blue-400)"
      rounded="sm"
      px={3}
      pt={2.5}
      pb={2.5}
      position="relative"
      transition="border-color 0.15s"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Quote text — right-pad for copy button */}
      <Text fontSize="sm" color="var(--chakra-colors-fg-default)" fontStyle="italic" lineHeight="tall" mb={1.5} pr="32px">
        "{text}"
      </Text>

      {/* Meta row + bottom-right arrow */}
      <Flex align="center" justify="space-between">
        <Flex align="center" gap={2}>
          <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">{account}</Text>
          <Text fontSize="xs" color="var(--chakra-colors-fg-subtle)">·</Text>
          <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">{date}</Text>
        </Flex>

        {/* Arrow — hover-revealed, bottom-right, only when callId exists */}
        {callId && (
          <Link href={`/transcripts/${callId}`} onClick={e => e.stopPropagation()}>
            <Box
              as="span"
              display="flex"
              alignItems="center"
              justifyContent="center"
              w="22px"
              h="22px"
              borderRadius="5px"
              bg={hovered ? 'var(--chakra-colors-blue-100)' : 'transparent'}
              color={hovered ? 'var(--chakra-colors-blue-600)' : 'transparent'}
              transition="background 0.15s, color 0.15s"
              title="Go to transcript"
              style={{ cursor: 'pointer', flexShrink: 0 }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Box>
          </Link>
        )}
      </Flex>

      {/* Copy — always visible, top-right */}
      <Box
        as="button"
        position="absolute"
        top="8px"
        right="8px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        w="24px"
        h="24px"
        borderRadius="5px"
        bg={copied ? 'var(--chakra-colors-green-100)' : 'var(--chakra-colors-bg-subtle)'}
        color={copied ? 'var(--chakra-colors-green-600)' : 'var(--chakra-colors-fg-muted)'}
        border="none"
        cursor="pointer"
        transition="background 0.15s, color 0.15s"
        title={copied ? 'Copied!' : 'Copy quote'}
        onClick={handleCopy}
      >
        {copied ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </Box>
    </Box>
  )
}

// ── Action buttons (shared, rendered in header) ────────────────────────────

function ActionButtons({ theme }: { theme: Theme }) {
  return (
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
  )
}

// ── Drawer ─────────────────────────────────────────────────────────────────

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

type DrawerTab = 'summary' | 'calls'

export function ThemeDrawer({ theme, onClose }: ThemeDrawerProps) {
  const [activeTab, setActiveTab] = useState<DrawerTab>('summary')

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
      {/* ── Sticky header ─────────────────────────────────────────────── */}
      <Box
        px={5}
        pt={4}
        pb={0}
        borderBottomWidth="1px"
        borderColor="var(--chakra-colors-border-subtle)"
        bg="var(--chakra-colors-bg-subtle)"
        position="sticky"
        top={0}
        zIndex={1}
      >
        {/* Title + close */}
        <Flex align="flex-start" justify="space-between" gap={3} mb={2}>
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

        {/* CTA buttons — above the tab bar */}
        <Box mb={3}>
          <ActionButtons theme={theme} />
        </Box>

        {/* Tab bar */}
        <Flex gap={0} borderBottom="1px solid var(--chakra-colors-border-subtle)" pb={0} mx={-5} px={5}>
          {([
            { id: 'summary' as DrawerTab, label: 'AI Summary', sparkle: true },
            { id: 'calls'   as DrawerTab, label: 'Source Calls', count: theme.callCount },
          ]).map(tab => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
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
                {'sparkle' in tab && (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M12 3 9 9 3 12l6 3 3 6 3-6 6-3-6-3z" />
                  </svg>
                )}
                {tab.label}
                {'count' in tab && (
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
                    background: isActive ? 'var(--chakra-colors-blue-100)' : 'var(--chakra-colors-bg-panel)',
                    color: isActive ? 'var(--chakra-colors-blue-700)' : 'var(--chakra-colors-fg-muted)',
                    transition: 'background 0.15s, color 0.15s',
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </Flex>
      </Box>

      {/* ── Tab content ───────────────────────────────────────────────── */}
      <Box px={5} py={4}>

        {/* Summary tab */}
        {activeTab === 'summary' && (
          <Stack gap={5}>
            <Box>
              <Flex align="center" gap={1.5} mb={2}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--chakra-colors-fg-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M12 3 9 9 3 12l6 3 3 6 3-6 6-3-6-3z" />
                </svg>
                <Text fontSize="xs" fontWeight="semibold" letterSpacing="wider" textTransform="uppercase" color="var(--chakra-colors-fg-muted)">
                  AI Summary
                </Text>
              </Flex>
              <Text fontSize="sm" color="var(--chakra-colors-fg-default)" lineHeight="tall">
                {theme.summary}
              </Text>
            </Box>

            <Box>
              <SectionLabel>Related tags</SectionLabel>
              <Flex gap={1.5} flexWrap="wrap">
                {theme.tags.map(t => (
                  <Badge key={t} colorPalette="blue" variant="subtle" size="sm" rounded="sm">{t}</Badge>
                ))}
              </Flex>
            </Box>

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

            <Box>
              <SectionLabel>Representative quotes</SectionLabel>
              <Stack gap={3}>
                {theme.representativeQuotes.map((q, i) => (
                  <QuoteCard key={i} text={q.text} account={q.account} date={q.date} callId={q.callId} />
                ))}
              </Stack>
            </Box>
          </Stack>
        )}

        {/* Source Calls tab */}
        {activeTab === 'calls' && (
          <Stack gap={0}>
            {theme.relatedCalls.map((call, i) => (
              <Link key={call.id} href={`/transcripts/${call.id}`}>
                <Box
                  display="block"
                  py={3}
                  px={2}
                  borderBottomWidth={i < theme.relatedCalls.length - 1 ? '1px' : '0'}
                  borderColor="var(--chakra-colors-border-subtle)"
                  rounded="sm"
                  _hover={{ bg: 'var(--chakra-colors-blue-50)' }}
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
        )}

      </Box>
    </Box>
  )
}
