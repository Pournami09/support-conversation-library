'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Accordion, Badge, Box, Button, Flex, Input, Stack, Text } from '@chakra-ui/react'
import type { CallDetailData, KeyMoment, TranscriptLine as TLine } from '@/lib/types'

// ── SVG icons ─────────────────────────────────────────────────────────────

function Ico({ children, size = 14 }: { children: React.ReactNode; size?: number }) {
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
function AlignLeftIcon() {
  return (
    <Ico size={18}>
      <line x1="17" y1="10" x2="3" y2="10" /><line x1="21" y1="6" x2="3" y2="6" />
      <line x1="21" y1="14" x2="3" y2="14" /><line x1="17" y1="18" x2="3" y2="18" />
    </Ico>
  )
}
function SearchIcon() {
  return <Ico><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></Ico>
}
function DownloadIcon() {
  return (
    <Ico>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </Ico>
  )
}
function AlertIcon({ size = 10 }: { size?: number }) {
  return (
    <Ico size={size}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </Ico>
  )
}

// ── Palette helpers ───────────────────────────────────────────────────────

function getMomentPalette(label: string): string {
  const l = label.toLowerCase()
  if (l.includes('escalat') || l.includes('anger') || l.includes('legal') || l.includes('urgent')) return 'red'
  if (l.includes('coach') || l.includes('opportunit') || l.includes('success') || l.includes('resolved')) return 'blue'
  if (l.includes('product') || l.includes('bug') || l.includes('technical') || l.includes('error') || l.includes('root cause')) return 'orange'
  if (l.includes('policy') || l.includes('protocol')) return 'yellow'
  return 'gray'
}

const ACTIVE_BG: Record<string, string> = {
  red:    'var(--chakra-colors-red-50)',
  orange: 'var(--chakra-colors-orange-50)',
  blue:   'var(--chakra-colors-blue-50)',
  yellow: 'var(--chakra-colors-yellow-50)',
  gray:   'var(--chakra-colors-gray-50)',
}
const ACTIVE_BORDER: Record<string, string> = {
  red:    'var(--chakra-colors-red-500)',
  orange: 'var(--chakra-colors-orange-500)',
  blue:   'var(--chakra-colors-blue-500)',
  yellow: 'var(--chakra-colors-yellow-500)',
  gray:   'var(--chakra-colors-gray-400)',
}
const MOMENT_BORDER: Record<string, string> = {
  red:    'var(--chakra-colors-red-400)',
  orange: 'var(--chakra-colors-orange-400)',
  blue:   'var(--chakra-colors-blue-400)',
  yellow: 'var(--chakra-colors-yellow-400)',
  gray:   'var(--chakra-colors-gray-300)',
}
const MOMENT_HEADER_BG: Record<string, string> = {
  red:    'var(--chakra-colors-red-100)',
  orange: 'var(--chakra-colors-orange-100)',
  blue:   'var(--chakra-colors-blue-100)',
  yellow: 'var(--chakra-colors-yellow-100)',
  gray:   'var(--chakra-colors-gray-100)',
}
const MOMENT_TS_COLOR: Record<string, string> = {
  red:    'var(--chakra-colors-red-700)',
  orange: 'var(--chakra-colors-orange-700)',
  blue:   'var(--chakra-colors-blue-700)',
  yellow: 'var(--chakra-colors-yellow-700)',
  gray:   'var(--chakra-colors-gray-600)',
}

// ── Section building ──────────────────────────────────────────────────────

interface Section {
  key: string
  title: string
  lines: TLine[]
  startIndex: number
  timeRange: string
}

function buildSections(lines: TLine[]): Section[] {
  if (lines.length === 0) return []
  const s1End = Math.ceil(lines.length / 3)
  const s2End = Math.ceil((lines.length * 2) / 3)

  function range(slice: TLine[]): string {
    if (!slice.length) return ''
    return `${slice[0].timestamp} – ${slice[slice.length - 1].timestamp}`
  }

  return [
    { key: 's0', title: 'Opening & Issue Identification', lines: lines.slice(0, s1End),   startIndex: 0,     timeRange: range(lines.slice(0, s1End))   },
    { key: 's1', title: 'Investigation',                  lines: lines.slice(s1End, s2End), startIndex: s1End,  timeRange: range(lines.slice(s1End, s2End)) },
    { key: 's2', title: 'Resolution & Wrap-up',           lines: lines.slice(s2End),        startIndex: s2End,  timeRange: range(lines.slice(s2End))        },
  ].filter(s => s.lines.length > 0)
}

// ── Inline moment highlight card ─────────────────────────────────────────

function MomentCard({
  moment, line, agentName, isActive,
}: {
  moment: KeyMoment
  line: TLine
  agentName: string
  isActive: boolean
}) {
  const p = getMomentPalette(moment.label)
  return (
    <Box
      borderLeftWidth="4px"
      borderLeftColor={MOMENT_BORDER[p] ?? MOMENT_BORDER.gray}
      bg={isActive ? ACTIVE_BG[p] : ACTIVE_BG[p]}
      ml="-1px"
      outline={isActive ? `2px solid ${ACTIVE_BORDER[p] ?? ACTIVE_BORDER.gray}` : 'none'}
      outlineOffset="-2px"
      transition="outline 0.15s ease"
      rounded="sm"
    >
      <Flex align="center" gap={2}
        bg={MOMENT_HEADER_BG[p] ?? MOMENT_HEADER_BG.gray}
        px={3} py={1.5}
      >
        <Badge colorPalette={p} variant="subtle" size="sm" rounded="sm" gap={1}>
          <AlertIcon size={10} />
          {moment.label}
        </Badge>
      </Flex>
      <Flex gap={4} px={4} py={3} align="flex-start">
        <Text
          fontSize="xs" fontFamily="mono"
          color={MOMENT_TS_COLOR[p] ?? MOMENT_TS_COLOR.gray}
          fontWeight="semibold" w="40px" flexShrink={0} mt="2px"
        >
          {line.timestamp}
        </Text>
        <Box flex={1}>
          <Text
            fontSize="xs" fontWeight="semibold"
            color="var(--chakra-colors-fg-muted)"
            mb={0.5}
          >
            {line.speaker === 'Agent' ? `${agentName} (Agent)` : 'Customer'}
          </Text>
          <Text fontSize="sm" color="var(--chakra-colors-fg-default)" lineHeight="tall">
            &ldquo;{line.text}&rdquo;
          </Text>
        </Box>
      </Flex>
    </Box>
  )
}

// ── Regular line row ──────────────────────────────────────────────────────

function LineRow({
  line, agentName, isActive, isHighlighted, activePalette, onClick,
}: {
  line: TLine
  agentName: string
  isActive: boolean
  isHighlighted: boolean
  activePalette: string
  onClick: () => void
}) {
  const bg =
    isActive      ? (ACTIVE_BG[activePalette]     ?? ACTIVE_BG.blue) :
    isHighlighted ? 'var(--chakra-colors-yellow-50)' :
    'transparent'

  const borderColor =
    isActive      ? (ACTIVE_BORDER[activePalette]  ?? ACTIVE_BORDER.blue) :
    isHighlighted ? 'var(--chakra-colors-yellow-400)' :
    'transparent'

  const hoverBg =
    isActive      ? (ACTIVE_BG[activePalette]      ?? ACTIVE_BG.blue) :
    isHighlighted ? 'var(--chakra-colors-yellow-50)'  :
    'var(--chakra-colors-bg-subtle)'

  return (
    <Flex
      gap={4} px={4} py={3} align="flex-start"
      bg={bg}
      borderLeftWidth="3px"
      borderLeftColor={borderColor}
      cursor="pointer"
      _hover={{ bg: hoverBg }}
      transition="background-color 0.15s ease"
      onClick={onClick}
    >
      <Text
        fontSize="xs" fontFamily="mono"
        color="var(--chakra-colors-fg-muted)"
        w="40px" flexShrink={0} mt="2px"
      >
        {line.timestamp}
      </Text>
      <Box flex={1}>
        <Text
          fontSize="xs" fontWeight="semibold" mb={0.5}
          color={
            line.speaker === 'Agent'
              ? 'var(--chakra-colors-blue-700)'
              : 'var(--chakra-colors-fg-muted)'
          }
        >
          {line.speaker === 'Agent' ? `${agentName} (Agent)` : 'Customer'}
        </Text>
        <Text fontSize="sm" color="var(--chakra-colors-fg-default)" lineHeight="tall">
          {line.text}
        </Text>
      </Box>
    </Flex>
  )
}

// ── Main component ────────────────────────────────────────────────────────

interface TranscriptPanelProps {
  call: CallDetailData
  activeLineIndex: number | null
  onLineClick: (lineIndex: number) => void
}

export function TranscriptPanel({ call, activeLineIndex, onLineClick }: TranscriptPanelProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const sections = useMemo(() => buildSections(call.lines), [call.lines])
  const [openSections, setOpenSections] = useState<string[]>(() => sections.map(s => s.key))

  // Map lineIndex → KeyMoment for fast lookup
  const momentsByLine = useMemo(
    () => new Map(call.keyMoments.map(m => [m.lineIndex, m])),
    [call.keyMoments]
  )

  // Refs for every rendered line element (moment card or regular row)
  const lineRefs = useRef<Map<number, HTMLElement>>(new Map())

  // ── Scroll to active line when it changes ─────────────────────────
  useEffect(() => {
    if (activeLineIndex === null) return

    // Find which section contains this line
    const targetSection = sections.find(
      s => activeLineIndex >= s.startIndex && activeLineIndex < s.startIndex + s.lines.length
    )

    if (!targetSection) return

    const sectionIsOpen = openSections.includes(targetSection.key)

    const doScroll = () => {
      const el = lineRefs.current.get(activeLineIndex)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

    if (sectionIsOpen) {
      // Section already open — scroll immediately (small delay for render)
      setTimeout(doScroll, 50)
    } else {
      // Open the section first, then scroll after animation
      setOpenSections(prev => [...prev, targetSection.key])
      setTimeout(doScroll, 250)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLineIndex])

  function matchesSearch(line: TLine): boolean {
    if (!searchQuery.trim()) return true
    return line.text.toLowerCase().includes(searchQuery.toLowerCase())
  }

  return (
    <Stack gap={6} px={8} py={8}>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <Box borderBottomWidth="1px" borderColor="var(--chakra-colors-border-subtle)" pb={4}>
        <Flex align="center" gap={2} mb={3}>
          <AlignLeftIcon />
          <Text fontSize="lg" fontWeight="semibold" color="var(--chakra-colors-fg-default)">
            Transcript
          </Text>
        </Flex>
        <Flex align="center" gap={3}>
          <Box position="relative" flex={1}>
            <Box
              position="absolute" left={3} top="50%" transform="translateY(-50%)"
              color="var(--chakra-colors-fg-muted)" pointerEvents="none" zIndex={1}
            >
              <SearchIcon />
            </Box>
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search transcript..."
              size="sm" rounded="sm" pl={9}
              bg="var(--chakra-colors-bg-subtle)"
              borderColor="var(--chakra-colors-border-subtle)"
            />
          </Box>
          <Button variant="outline" size="sm" rounded="sm" gap={1.5}>
            <DownloadIcon /> Export
          </Button>
        </Flex>
      </Box>

      {/* ── Accordion sections ──────────────────────────────────────── */}
      <Accordion.Root
        value={openSections}
        onValueChange={e => setOpenSections(e.value)}
        multiple
      >
        <Stack gap={3}>
          {sections.map(section => {
            const visibleLines = section.lines.filter(matchesSearch)
            const hasResults = !searchQuery.trim() || visibleLines.length > 0

            return (
              <Accordion.Item key={section.key} value={section.key}>
                <Accordion.ItemTrigger
                  px={0} py={0}
                  _hover={{ bg: 'transparent' }}
                  borderBottomWidth="1px"
                  borderColor="var(--chakra-colors-border-subtle)"
                >
                  <Flex w="full" align="center" gap={3} py={2}>
                    <Accordion.ItemIndicator />
                    <Text
                      flex={1} fontSize="sm" fontWeight="semibold"
                      color="var(--chakra-colors-fg-default)" textAlign="left"
                    >
                      {section.title}
                    </Text>
                    <Text fontSize="xs" color="var(--chakra-colors-fg-muted)" flexShrink={0}>
                      {section.timeRange}
                    </Text>
                  </Flex>
                </Accordion.ItemTrigger>

                <Accordion.ItemContent pt={0} pb={0}>
                  <Box
                    borderLeftWidth="1px"
                    borderColor="var(--chakra-colors-border-subtle)"
                    ml={3} mt={2} mb={2}
                  >
                    {!hasResults ? (
                      <Box px={4} py={3}>
                        <Text fontSize="xs" color="var(--chakra-colors-fg-muted)" fontStyle="italic">
                          No matches in this section
                        </Text>
                      </Box>
                    ) : (
                      <Stack gap={0}>
                        {section.lines.map((line, i) => {
                          const lineIndex = section.startIndex + i
                          if (!matchesSearch(line)) return null

                          const moment    = momentsByLine.get(lineIndex)
                          const isActive  = activeLineIndex === lineIndex
                          const isHighlighted = call.highlightedLines.includes(lineIndex)

                          // Palette for this line: use moment palette if it's a key moment
                          const palette = moment
                            ? getMomentPalette(moment.label)
                            : 'blue'

                          // Shared ref registration
                          const setRef = (el: HTMLElement | null) => {
                            if (el) lineRefs.current.set(lineIndex, el)
                            else lineRefs.current.delete(lineIndex)
                          }

                          if (moment && !searchQuery.trim()) {
                            return (
                              <div
                                key={lineIndex}
                                ref={setRef}
                              >
                                <MomentCard
                                  moment={moment}
                                  line={line}
                                  agentName={call.agentName}
                                  isActive={isActive}
                                />
                              </div>
                            )
                          }

                          return (
                            <div
                              key={lineIndex}
                              ref={setRef}
                            >
                              <LineRow
                                line={line}
                                agentName={call.agentName}
                                isActive={isActive}
                                isHighlighted={isHighlighted}
                                activePalette={palette}
                                onClick={() => onLineClick(lineIndex)}
                              />
                            </div>
                          )
                        })}
                      </Stack>
                    )}
                  </Box>
                </Accordion.ItemContent>
              </Accordion.Item>
            )
          })}
        </Stack>
      </Accordion.Root>

    </Stack>
  )
}
