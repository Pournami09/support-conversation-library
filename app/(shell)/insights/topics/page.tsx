import { Badge, Box, Flex, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { THEMES } from '@/lib/data/themes'

const TREND_PALETTE: Record<string, string> = {
  rising: 'red', stable: 'gray', declining: 'green',
}
const TREND_LABEL: Record<string, string> = {
  rising: 'Rising', stable: 'Stable', declining: 'Declining',
}

export default function TopicsPage() {
  return (
    <Box px={8} py={6}>
      <Flex align="center" gap={3} mb={2}>
        <Text fontSize="2xl" fontWeight="semibold" color="var(--chakra-colors-fg-default)" lineHeight="none">
          Topics
        </Text>
        <Badge colorPalette="blue" variant="subtle" size="sm" rounded="sm">
          {THEMES.length}
        </Badge>
      </Flex>
      <Text fontSize="sm" color="var(--chakra-colors-fg-muted)" mb={6}>
        Recurring themes surfaced across your conversation library — ranked by call volume and trend direction.
      </Text>

      <Box
        bg="var(--chakra-colors-bg-panel)"
        borderWidth="1px"
        borderColor="var(--chakra-colors-border-subtle)"
        rounded="sm"
        overflow="hidden"
      >
        {THEMES.map((theme, i) => (
          <Link key={theme.id} href={`/themes?theme=${theme.id}`} style={{ textDecoration: 'none' }}>
            <Flex
              align="flex-start"
              gap={4}
              px={5} py={4}
              borderTopWidth={i > 0 ? '1px' : '0'}
              borderColor="var(--chakra-colors-border-subtle)"
              _hover={{ bg: 'var(--chakra-colors-blue-50)' }}
              transition="background-color 0.1s ease"
              cursor="pointer"
            >
              <Box flex={1} minW={0}>
                <Flex align="center" gap={2} mb={1}>
                  <Text fontSize="sm" fontWeight="medium" color="var(--chakra-colors-fg-default)">
                    {theme.name}
                  </Text>
                  <Badge
                    colorPalette={TREND_PALETTE[theme.trend]}
                    variant="subtle" size="sm" rounded="sm"
                  >
                    {TREND_LABEL[theme.trend]}
                    {theme.trend !== 'stable' ? ` +${theme.trendPercent}%` : ''}
                  </Badge>
                </Flex>
                <Text
                  fontSize="xs"
                  color="var(--chakra-colors-fg-muted)"
                  lineHeight="tall"
                  overflow="hidden"
                  style={{ WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical' as const }}
                >
                  {theme.summary}
                </Text>
                <Flex gap={1} flexWrap="wrap" mt={2}>
                  {theme.tags.map(tag => (
                    <Badge key={tag} colorPalette="gray" variant="subtle" size="sm" rounded="sm">
                      {tag}
                    </Badge>
                  ))}
                </Flex>
              </Box>
              <Flex direction="column" align="flex-end" flexShrink={0} gap={1}>
                <Text fontSize="lg" fontWeight="semibold" color="var(--chakra-colors-fg-default)" lineHeight="none">
                  {theme.callCount}
                </Text>
                <Text fontSize="xs" color="var(--chakra-colors-fg-muted)">calls</Text>
              </Flex>
            </Flex>
          </Link>
        ))}
      </Box>
    </Box>
  )
}
