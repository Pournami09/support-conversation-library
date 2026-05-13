'use client'

import { Box, Flex, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// ── Label map for URL segments ────────────────────────────────────────────────

const LABELS: Record<string, string> = {
  search: 'Search',
  transcripts: 'Transcripts',
  qa: 'QA',
  queue: 'Queue',
  reports: 'Reports',
  rubrics: 'Rubrics',
  monitoring: 'Monitoring',
  'low-quality': 'Low Quality',
  escalated: 'Escalated',
  teams: 'Teams',
  'tier-1': 'Tier 1',
  enterprise: 'Enterprise',
  billing: 'Billing',
  pending: 'Pending',
  'policy-violations': 'Policy Violations',
  coaching: 'Coaching',
  'saved-views': 'Saved Views',
  insights: 'Insights',
  trends: 'Insights Hub',
  topics: 'Topics',
  accounts: 'Accounts',
  digest: 'Digest',
  'evidence-board': 'Evidence Board',
  themes: 'Themes',
  collections: 'Collections',
}

// ── Static breadcrumb map ─────────────────────────────────────────────────────

type Crumb = { label: string; href: string | null }

const STATIC_CRUMBS: Record<string, Crumb[]> = {
  '/':                          [{ label: 'Home', href: null }],
  '/search':                    [{ label: 'Calls', href: '/transcripts' }, { label: 'Search', href: null }],
  '/transcripts':               [{ label: 'Calls', href: null }],
  '/collections':               [{ label: 'Insights', href: '/insights/trends' }, { label: 'Collections', href: null }],
  '/themes':                    [{ label: 'Insights', href: '/insights/trends' }, { label: 'Themes', href: null }],
  '/qa/queue':                  [{ label: 'QA', href: null }],
  '/qa/reports':                [{ label: 'QA', href: '/qa/queue' }, { label: 'Reports', href: null }],
  '/qa/rubrics':                [{ label: 'QA', href: '/qa/queue' }, { label: 'Rubrics', href: null }],
  '/qa/monitoring':             [{ label: 'QA', href: '/qa/queue' }, { label: 'Monitoring', href: null }],
  '/qa/low-quality':            [{ label: 'QA', href: '/qa/queue' }, { label: 'Low Quality', href: null }],
  '/qa/escalated':              [{ label: 'QA', href: '/qa/queue' }, { label: 'Escalated', href: null }],
  '/qa/pending':                [{ label: 'QA', href: '/qa/queue' }, { label: 'Pending', href: null }],
  '/qa/policy-violations':      [{ label: 'QA', href: '/qa/queue' }, { label: 'Policy Violations', href: null }],
  '/qa/coaching':               [{ label: 'QA', href: '/qa/queue' }, { label: 'Coaching', href: null }],
  '/qa/saved-views':            [{ label: 'QA', href: '/qa/queue' }, { label: 'Saved Views', href: null }],
  '/qa/teams/tier-1':           [{ label: 'QA', href: '/qa/queue' }, { label: 'Teams', href: null }, { label: 'Tier 1', href: null }],
  '/qa/teams/enterprise':       [{ label: 'QA', href: '/qa/queue' }, { label: 'Teams', href: null }, { label: 'Enterprise', href: null }],
  '/qa/teams/billing':          [{ label: 'QA', href: '/qa/queue' }, { label: 'Teams', href: null }, { label: 'Billing', href: null }],
  '/insights/trends':           [{ label: 'Insights', href: null }],
  '/insights/topics':           [{ label: 'Insights', href: '/insights/trends' }, { label: 'Topics', href: null }],
  '/insights/accounts':         [{ label: 'Insights', href: '/insights/trends' }, { label: 'Accounts', href: null }],
  '/insights/digest':           [{ label: 'Insights', href: '/insights/trends' }, { label: 'Digest', href: null }],
  '/insights/evidence-board':   [{ label: 'Insights', href: '/insights/trends' }, { label: 'Evidence Board', href: null }],
  '/insights/reports':          [{ label: 'Insights', href: '/insights/trends' }, { label: 'Reports', href: null }],
}

// ── Dynamic crumb builder for unrecognised paths ──────────────────────────────

function buildDynamicCrumbs(pathname: string): Crumb[] {
  const segments = pathname.split('/').filter(Boolean)
  const crumbs: Crumb[] = []
  let acc = ''
  for (let i = 0; i < segments.length; i++) {
    acc += `/${segments[i]}`
    const label = LABELS[segments[i]] || segments[i]
    const isLast = i === segments.length - 1
    crumbs.push({ label, href: isLast ? null : acc })
  }
  return crumbs
}

// ── Breadcrumb bar ─────────────────────────────────────────────────────────────

export function BreadcrumbBar() {
  const pathname = usePathname()

  // Transcript detail: /transcripts/[id]
  const transcriptMatch = pathname.match(/^\/transcripts\/(.+)$/)
  const crumbs: Crumb[] = transcriptMatch
    ? [
        { label: 'Calls', href: '/transcripts' },
        { label: `#${transcriptMatch[1]}`, href: null },
      ]
    : (STATIC_CRUMBS[pathname] ?? buildDynamicCrumbs(pathname))

  // Don't render if there's only one crumb (top-level section roots)
  if (crumbs.length <= 1) return null

  return (
    <Flex
      h="32px"
      px={5}
      align="center"
      gap={1}
      bg="var(--chakra-colors-bg-panel)"
      borderBottomWidth="1px"
      borderColor="var(--chakra-colors-border-subtle)"
      flexShrink={0}
    >
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1
        return (
          <Flex key={i} align="center" gap={1}>
            {i > 0 && (
              <Text fontSize="10px" color="var(--chakra-colors-fg-muted)" lineHeight="none" mx={0.5}>
                /
              </Text>
            )}
            {crumb.href && !isLast ? (
              <Link href={crumb.href} style={{ textDecoration: 'none' }}>
                <Text
                  fontSize="xs"
                  color="var(--chakra-colors-fg-muted)"
                  _hover={{ color: 'var(--chakra-colors-fg-default)' }}
                  cursor="pointer"
                  transition="color 0.1s"
                >
                  {crumb.label}
                </Text>
              </Link>
            ) : (
              <Text
                fontSize="xs"
                color={isLast ? 'var(--chakra-colors-fg-default)' : 'var(--chakra-colors-fg-muted)'}
                fontWeight={isLast ? 'medium' : 'normal'}
              >
                {crumb.label}
              </Text>
            )}
          </Flex>
        )
      })}
    </Flex>
  )
}
