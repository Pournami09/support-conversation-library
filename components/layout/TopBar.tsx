'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Flex, Input, Text } from '@chakra-ui/react'

function IconSearch() {
  return (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

export function TopBar() {
  const router = useRouter()
  const [value, setValue] = useState('')

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`)
      setValue('')
    }
  }

  return (
    <Flex
      h="44px"
      px={5}
      bg="var(--chakra-colors-bg-panel)"
      borderBottomWidth="1px"
      borderColor="var(--chakra-colors-border-subtle)"
      align="center"
      gap={3}
      flexShrink={0}
    >
      <Box
        color="var(--chakra-colors-fg-muted)"
        display="flex"
        alignItems="center"
        flexShrink={0}
      >
        <IconSearch />
      </Box>

      <Input
        placeholder="Search calls, issues, quotes, accounts, or themes…"
        border="none"
        outline="none"
        _focusVisible={{ boxShadow: 'none' }}
        fontSize="sm"
        color="var(--chakra-colors-fg-default)"
        _placeholder={{ color: 'var(--chakra-colors-fg-muted)', fontSize: 'sm' }}
        flex={1}
        h="full"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <Flex
        align="center"
        gap="3px"
        px="7px"
        py="3px"
        borderWidth="1px"
        borderColor="var(--chakra-colors-border-subtle)"
        rounded="sm"
        bg="var(--chakra-colors-bg-subtle)"
        flexShrink={0}
      >
        <Text fontSize="11px" color="var(--chakra-colors-fg-muted)" lineHeight="none">⌘K</Text>
      </Flex>
    </Flex>
  )
}
