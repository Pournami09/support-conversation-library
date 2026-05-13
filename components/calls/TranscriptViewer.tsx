'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import {
  Badge, Box, Button, CloseButton, Dialog,
  Flex, Portal, Stack, Text,
} from '@chakra-ui/react'
import type { TranscriptLine } from '@/lib/types'

// ── Highlight modal ────────────────────────────────────────────────────────

function HighlightModal({ open, text, onClose }: { open: boolean; text: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false)

  function copyText() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Dialog.Root open={open} onOpenChange={({ open }) => { if (!open) onClose() }} size="md">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content rounded="sm">
            <Dialog.Header
              borderBottomWidth="1px"
              borderColor="var(--chakra-colors-border-subtle)"
              pb={3}
            >
              <Dialog.Title fontSize="sm" fontWeight="semibold" color="var(--chakra-colors-fg-default)">
                Selected text
              </Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>
            <Dialog.Body py={4}>
              <Box
                bg="var(--chakra-colors-bg-subtle)"
                borderWidth="1px"
                borderColor="var(--chakra-colors-border-subtle)"
                borderLeftWidth="3px"
                borderLeftColor="var(--chakra-colors-blue-500)"
                rounded="sm"
                px={4}
                py={3}
                mb={4}
              >
                <Text fontSize="sm" color="var(--chakra-colors-fg-default)" fontStyle="italic" lineHeight="tall">
                  "{text}"
                </Text>
              </Box>
              <Stack gap={2}>
                <Text fontSize="xs" fontWeight="semibold" letterSpacing="wider" textTransform="uppercase" color="var(--chakra-colors-fg-muted)">
                  Actions
                </Text>
                <Flex gap={2} flexWrap="wrap">
                  <Button
                    size="sm" colorPalette="blue" variant="subtle" rounded="sm"
                    transition="transform 0.1s ease-out, background-color 0.15s ease"
                    _active={{ transform: 'scale(0.97)' }}
                  >
                    Save evidence
                  </Button>
                  <Button
                    size="sm" variant="outline" rounded="sm"
                    transition="transform 0.1s ease-out, background-color 0.15s ease"
                    _active={{ transform: 'scale(0.97)' }}
                    onClick={copyText}
                  >
                    {copied ? 'Copied!' : 'Copy quote'}
                  </Button>
                  <Button
                    size="sm" variant="outline" rounded="sm"
                    transition="transform 0.1s ease-out, background-color 0.15s ease"
                    _active={{ transform: 'scale(0.97)' }}
                  >
                    Add to collection
                  </Button>
                  <Button
                    size="sm" colorPalette="orange" variant="subtle" rounded="sm"
                    transition="transform 0.1s ease-out, background-color 0.15s ease"
                    _active={{ transform: 'scale(0.97)' }}
                  >
                    Flag for review
                  </Button>
                </Flex>
              </Stack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

// ── Transcript viewer ──────────────────────────────────────────────────────

interface TranscriptViewerProps {
  lines: TranscriptLine[]
  highlightedLines: number[]
  activeLineIndex: number | null
  onLineClick?: (lineIndex: number) => void
}

export function TranscriptViewer({
  lines,
  highlightedLines,
  activeLineIndex,
  onLineClick,
}: TranscriptViewerProps) {
  const [modalOpen, setModalOpen]     = useState(false)
  const [selectedText, setSelectedText] = useState('')
  const lineRefs = useRef<Record<number, HTMLDivElement | null>>({})

  // Scroll to active line when key moment is clicked
  useEffect(() => {
    if (activeLineIndex !== null && lineRefs.current[activeLineIndex]) {
      lineRefs.current[activeLineIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [activeLineIndex])

  const handleMouseUp = useCallback(() => {
    const text = window.getSelection()?.toString().trim()
    if (text) {
      setSelectedText(text)
      setModalOpen(true)
    }
  }, [])

  return (
    <>
      <Box
        bg="var(--chakra-colors-bg-panel)"
        borderWidth="1px"
        borderColor="var(--chakra-colors-border-subtle)"
        rounded="sm"
        overflow="hidden"
      >
        <Box
          px={4} py={3}
          borderBottomWidth="1px"
          borderColor="var(--chakra-colors-border-subtle)"
          bg="var(--chakra-colors-bg-subtle)"
        >
          <Flex align="center" justify="space-between">
            <Text fontSize="xs" fontWeight="semibold" letterSpacing="wider" textTransform="uppercase" color="var(--chakra-colors-fg-muted)">
              Transcript
            </Text>
            <Text fontSize="xs" color="var(--chakra-colors-fg-subtle)">
              Select any text to save or copy evidence
            </Text>
          </Flex>
        </Box>

        <Stack gap={0} onMouseUp={handleMouseUp} userSelect="text" cursor="text">
          {lines.map((line, i) => {
            const isHighlighted = highlightedLines.includes(i)
            const isActive      = activeLineIndex === i

            return (
              <Flex
                key={i}
                ref={(el) => { lineRefs.current[i] = el }}
                gap={4}
                px={4}
                py={3}
                borderBottomWidth={i < lines.length - 1 ? '1px' : '0'}
                borderColor="var(--chakra-colors-border-subtle)"
                bg={
                  isActive      ? 'var(--chakra-colors-blue-50)'
                  : isHighlighted ? 'var(--chakra-colors-yellow-50)'
                  : 'transparent'
                }
                borderLeftWidth={isActive ? '3px' : isHighlighted ? '2px' : '3px'}
                borderLeftColor={
                  isActive      ? 'var(--chakra-colors-blue-500)'
                  : isHighlighted ? 'var(--chakra-colors-yellow-400)'
                  : 'transparent'
                }
                _hover={{ bg: isActive ? 'var(--chakra-colors-blue-50)' : isHighlighted ? 'var(--chakra-colors-yellow-50)' : 'var(--chakra-colors-bg-subtle)' }}
                transition="background-color 0.15s ease"
                align="flex-start"
                cursor={onLineClick ? 'pointer' : 'text'}
                onClick={() => onLineClick?.(i)}
              >
                <Text
                  fontSize="xs"
                  color="var(--chakra-colors-fg-muted)"
                  fontFamily="mono"
                  flexShrink={0}
                  mt="2px"
                  w="36px"
                >
                  {line.timestamp}
                </Text>
                <Box flexShrink={0} w="72px">
                  <Badge
                    size="sm"
                    colorPalette={line.speaker === 'Agent' ? 'blue' : 'gray'}
                    variant={line.speaker === 'Agent' ? 'subtle' : 'outline'}
                    rounded="sm"
                  >
                    {line.speaker}
                  </Badge>
                </Box>
                <Text fontSize="sm" color="var(--chakra-colors-fg-default)" lineHeight="tall" flex={1}>
                  {line.text}
                </Text>
              </Flex>
            )
          })}
        </Stack>
      </Box>

      <HighlightModal
        open={modalOpen}
        text={selectedText}
        onClose={() => { setModalOpen(false); setSelectedText('') }}
      />
    </>
  )
}
