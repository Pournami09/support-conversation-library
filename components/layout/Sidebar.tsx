'use client'

import { useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { Badge, Box, Flex, Stack, Text } from '@chakra-ui/react'
import Link from 'next/link'

// ── Icon helpers ──────────────────────────────────────────────────────────

function Rail({ d }: { d: string }) {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  )
}

function Sub({ d }: { d: string }) {
  return (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  )
}

// ── Rail icon paths ───────────────────────────────────────────────────────

const PATHS = {
  // Rail
  home:       "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  transcripts:"M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4",
  reviews:    "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  analytics:  "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  customers:  "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  settings:   "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  help:       "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  // Sub-items
  grid:       "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
  clock:      "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  star:       "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  phone:      "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
  flag:       "M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9",
  archive:    "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4",
  listCheck:  "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
  users:      "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  checkCircle:"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  trendUp:    "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  userCheck:  "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
  building:   "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  sliders:    "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4",
  tag:        "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z",
  plug:       "M12 18h.01M8 21l4-4 4 4M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",
  trendDown:  "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6",
  bookmark:   "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z",
  billing:    "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
  shield:     "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  rocket:     "M13 10V3L4 14h7v7l9-11h-7z",
  eye:           "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8M12 9a3 3 0 100 6 3 3 0 000-6",
  fileText:      "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  alertTriangle: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01",
  arrowUpRight:  "M7 17L17 7M7 7h10v10",
  hash:          "M4 9h16M4 15h16M10 3L8 21M16 3l-2 18",
}

// ── Nav structure ─────────────────────────────────────────────────────────

interface SubItem {
  label: string
  href: string
  icon?: string           // left icon key (omit when using dot)
  count?: number          // right badge count
  countPalette?: string   // badge color palette
  dot?: string            // colored dot: 'red' | 'yellow' | 'orange' | 'gray'
  rightIcon?: string      // right icon key (Surfacing Now style)
  rightIconColor?: string // 'red' | 'orange'
}
interface SubGroup { label: string; items: SubItem[] }
interface Section {
  id: string; label: string; icon: string
  panelTitle?: string   // custom header label
  panelIcon?: string    // custom header icon key
  groups?: SubGroup[]   // grouped layout; overrides flat items when present
  items: SubItem[]
}

const NAV_SECTIONS: Section[] = [
  {
    id: 'calls', label: 'Calls', icon: 'phone',
    panelTitle: 'Calls', panelIcon: 'phone',
    groups: [
      {
        label: 'Browse',
        items: [
          { label: 'All Calls', href: '/transcripts', icon: 'transcripts' },
        ],
      },
    ],
    items: [],
  },
  {
    id: 'qa', label: 'QA', icon: 'reviews',
    panelTitle: 'QA Workspace', panelIcon: 'reviews',
    groups: [
      {
        label: 'Needs Attention',
        items: [
          { label: 'Low Quality',       href: '/qa/low-quality',       icon: 'alertTriangle', count: 24, countPalette: 'red'    },
          { label: 'Escalated',         href: '/qa/escalated',         icon: 'arrowUpRight',  count: 12, countPalette: 'red'    },
          { label: 'Pending >48h',      href: '/qa/pending',           icon: 'clock',         count: 15, countPalette: 'yellow' },
          { label: 'Policy Violations', href: '/qa/policy-violations', icon: 'flag',          count: 7,  countPalette: 'gray'   },
        ],
      },
      {
        label: 'QA Workspace',
        items: [
          { label: 'Scoring Queue', href: '/qa/queue',       icon: 'listCheck' },
          { label: 'Rubrics',       href: '/qa/rubrics',     icon: 'reviews'   },
          { label: 'Monitoring',    href: '/qa/monitoring',  icon: 'eye'       },
          { label: 'Pinned Views',   href: '/qa/saved-views', icon: 'bookmark'  },
          { label: 'Reports',       href: '/qa/reports',     icon: 'fileText'  },
        ],
      },
      {
        label: 'Coaching',
        items: [
          { label: 'Coaching Queue', href: '/qa/coaching', icon: 'userCheck', count: 19, countPalette: 'gray' },
        ],
      },
      {
        label: 'My Teams',
        items: [
          { label: 'Tier 1 Support',      href: '/qa/teams/tier-1',     icon: 'users' },
          { label: 'Billing Specialists', href: '/qa/teams/billing',    icon: 'users' },
          { label: 'Enterprise',          href: '/qa/teams/enterprise', icon: 'users' },
        ],
      },
    ],
    items: [],
  },
  {
    id: 'insights', label: 'Insights', icon: 'analytics',
    panelTitle: 'Insights', panelIcon: 'analytics',
    groups: [
      {
        label: 'Surfacing Now',
        items: [
          { label: 'SSO spike +34%',       href: '/themes?theme=sso-login-failures',    dot: 'red',    rightIcon: 'trendUp',      rightIconColor: 'red'    },
          { label: '2 high-risk accounts', href: '/search?q=churn+risk',               dot: 'red',    rightIcon: 'alertTriangle', rightIconColor: 'orange' },
          { label: 'Billing rising +18%',  href: '/themes?theme=billing-confusion',    dot: 'yellow', rightIcon: 'trendUp',      rightIconColor: 'orange' },
          { label: 'Onboarding friction',  href: '/themes?theme=onboarding-friction',  dot: 'gray'   },
        ],
      },
      {
        label: 'Insights Library',
        items: [
          { label: 'Collections',    href: '/collections',              icon: 'archive'   },
          { label: 'Insights Hub',   href: '/insights/trends',          icon: 'trendUp'   },
          { label: 'Evidence Board', href: '/insights/evidence-board',  icon: 'flag'      },
          { label: 'Reports',        href: '/insights/reports',         icon: 'fileText'  },
        ],
      },
      {
        label: 'Pinned Views',
        items: [
          { label: 'SSO issues — Enterprise', href: '/search?q=sso',        icon: 'bookmark' },
          { label: 'Billing Q1 trends',       href: '/search?q=billing',    icon: 'bookmark' },
          { label: 'At-risk accounts',        href: '/search?q=churn+risk', icon: 'bookmark' },
        ],
      },
      {
        label: 'Browse By',
        items: [
          { label: 'Topics',   href: '/insights/topics',   icon: 'hash'     },
          { label: 'Accounts', href: '/insights/accounts', icon: 'building' },
        ],
      },
    ],
    items: [],
  },
]

const FOOTER_SECTIONS: Section[] = [
  {
    id: 'settings', label: 'Settings', icon: 'settings',
    items: [
      { label: 'General',      href: '/settings',              icon: 'sliders'  },
      { label: 'Scorecards',   href: '/settings/scorecards',   icon: 'listCheck'},
      { label: 'Tags & Labels',href: '/settings/tags',         icon: 'tag'      },
      { label: 'Team',         href: '/settings/team',         icon: 'users'    },
      { label: 'Integrations', href: '/settings/integrations', icon: 'plug'     },
    ],
  },
]

// ── Rail tooltip ──────────────────────────────────────────────────────────
// Uses position:fixed so it escapes any overflow:hidden container.
// 0ms delay, ease-out on opacity + slight slide from the left.

function RailTooltip({ label, children }: { label: string; children: React.ReactNode }) {
  const [visible, setVisible] = useState(false)
  const [coords, setCoords]   = useState({ top: 0, left: 0 })
  const ref = useRef<HTMLDivElement>(null)

  function show() {
    if (ref.current) {
      const r = ref.current.getBoundingClientRect()
      setCoords({ top: r.top + r.height / 2, left: r.right + 10 })
    }
    setVisible(true)
  }

  return (
    <div ref={ref} onMouseEnter={show} onMouseLeave={() => setVisible(false)}>
      {children}
      <div
        style={{
          position:       'fixed',
          zIndex:         9999,
          pointerEvents:  'none',
          top:            coords.top,
          left:           coords.left,
          transform:      `translateY(-50%) translateX(${visible ? '0px' : '-6px'})`,
          opacity:        visible ? 1 : 0,
          transition:     'opacity 0.15s ease-out, transform 0.15s ease-out',
          background:     '#0f172a',
          color:          '#fff',
          fontSize:       '12px',
          fontWeight:     '500',
          padding:        '5px 10px',
          borderRadius:   '6px',
          whiteSpace:     'nowrap',
          letterSpacing:  '0.01em',
          fontFamily:     'var(--font-geist, system-ui)',
          boxShadow:      '0 4px 12px rgba(0,0,0,0.25)',
        }}
      >
        {label}
      </div>
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────

function getActiveSectionId(pathname: string): string {
  if (pathname === '/')                     return 'home'
  if (pathname.startsWith('/transcripts'))  return 'calls'
  if (pathname.startsWith('/search'))       return 'calls'
  if (pathname.startsWith('/qa'))           return 'qa'
  if (pathname.startsWith('/insights'))     return 'insights'
  if (pathname.startsWith('/collections'))  return 'insights'
  if (pathname.startsWith('/settings'))     return 'settings'
  if (pathname.startsWith('/reviews'))      return 'qa'
  if (pathname.startsWith('/themes'))       return 'insights'
  if (pathname.startsWith('/customers'))    return 'insights'
  return 'calls'
}

function isSubActive(href: string, pathname: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(href + '/')
}

// ── Sub-item ──────────────────────────────────────────────────────────────

function SubNavItem({ item, pathname }: { item: SubItem; pathname: string }) {
  const active = isSubActive(item.href, pathname)
  return (
    <Link href={item.href} style={{ textDecoration: 'none' }}>
      <Box
        display="flex"
        alignItems="center"
        gap={2.5}
        px={3}
        py="7px"
        rounded="sm"
        bg={active ? 'var(--chakra-colors-blue-50)' : 'transparent'}
        color={active ? 'var(--chakra-colors-blue-700)' : 'var(--chakra-colors-fg-default)'}
        _hover={{ bg: 'var(--chakra-colors-blue-50)', color: 'var(--chakra-colors-blue-700)' }}
        transition="background-color 0.15s ease, color 0.15s ease"
      >
        {/* Left: colored dot OR icon */}
        {item.dot ? (
          <Box
            w="7px" h="7px" rounded="full" flexShrink={0}
            bg={
              item.dot === 'red'    ? 'var(--chakra-colors-red-500)'    :
              item.dot === 'yellow' ? 'var(--chakra-colors-yellow-400)' :
              item.dot === 'orange' ? 'var(--chakra-colors-orange-400)' :
                                     'var(--chakra-colors-gray-400)'
            }
          />
        ) : item.icon ? (
          <Box
            flexShrink={0}
            color={active ? 'var(--chakra-colors-blue-500)' : 'var(--chakra-colors-fg-muted)'}
            display="flex" alignItems="center"
          >
            <Sub d={PATHS[item.icon as keyof typeof PATHS] ?? PATHS.grid} />
          </Box>
        ) : null}

        {/* Label */}
        <Text fontSize="sm" fontWeight={active ? 'medium' : 'normal'} lineHeight="none" flex={1}>
          {item.label}
        </Text>

        {/* Right: count badge OR trend icon */}
        {item.count !== undefined && (
          <Badge
            colorPalette={item.countPalette ?? 'gray'}
            variant="subtle" size="xs" rounded="sm" flexShrink={0}
          >
            {item.count}
          </Badge>
        )}
        {item.rightIcon && (
          <Box
            flexShrink={0} display="flex" alignItems="center"
            color={
              item.rightIconColor === 'red'    ? 'var(--chakra-colors-red-500)'    :
              item.rightIconColor === 'orange' ? 'var(--chakra-colors-orange-500)' :
                                                 'var(--chakra-colors-fg-muted)'
            }
          >
            <Sub d={PATHS[item.rightIcon as keyof typeof PATHS] ?? PATHS.grid} />
          </Box>
        )}
      </Box>
    </Link>
  )
}

// ── Secondary panel ───────────────────────────────────────────────────────
// Fixed-width inner box prevents content reflow during the width transition.

function SecondaryPanel({
  section,
  isOpen,
  pathname,
}: {
  section: Section | undefined
  isOpen: boolean
  pathname: string
}) {
  return (
    <Box
      h="100vh"
      w={isOpen ? '216px' : '0px'}
      overflow="hidden"
      transition="width 0.2s cubic-bezier(0.215, 0.61, 0.355, 1)"
      flexShrink={0}
      borderRightWidth="1px"
      borderColor="var(--chakra-colors-border-subtle)"
      bg="var(--chakra-colors-bg-panel)"
    >
      <Box w="216px" h="full" display="flex" flexDirection="column" overflowY="auto">
        {section && (section.groups ? (
          // ── Grouped layout (QA, Insights) ────────────────────────────────
          <>
            <Flex align="center" gap={2} px={4} pt={5} pb={3} flexShrink={0}>
              <Box color="var(--chakra-colors-fg-muted)" display="flex" alignItems="center">
                <Sub d={PATHS[(section.panelIcon ?? section.icon) as keyof typeof PATHS] ?? PATHS.grid} />
              </Box>
              <Text fontSize="sm" fontWeight="semibold" color="var(--chakra-colors-fg-default)">
                {section.panelTitle ?? section.label}
              </Text>
            </Flex>

            {section.groups.map((group, gi) => {
              const isAttention = group.label === 'Needs Attention' || group.label === 'Surfacing Now'
              return (
              <Box
                key={group.label}
                bg={isAttention ? 'var(--chakra-colors-bg-subtle)' : 'transparent'}
                mx={isAttention ? 2 : 0}
                rounded={isAttention ? 'md' : 'none'}
                mb={isAttention ? 1 : 0}
              >
                {gi > 0 && !isAttention && (
                  <Box h="1px" w="full" bg="var(--chakra-colors-border-subtle)" mt={2} />
                )}
                {gi > 0 && isAttention && (
                  <Box h="1px" w="full" bg="var(--chakra-colors-border-subtle)" mt={2} mb={0} mx={-2} />
                )}
                <Text
                  fontSize="10px" fontWeight="semibold"
                  color="var(--chakra-colors-fg-muted)"
                  letterSpacing="wider" textTransform="uppercase"
                  px={3} pt={gi > 0 ? 3 : 3} pb={1}
                >
                  {group.label}
                </Text>
                <Stack gap={0.5} px={2} pb={isAttention ? 1.5 : 0}>
                  {group.items.map(item => (
                    <SubNavItem key={item.href} item={item} pathname={pathname} />
                  ))}
                </Stack>
              </Box>
              )
            })}
            <Box pb={4} />
          </>
        ) : (
          // ── Flat layout (Settings) ────────────────────────────────────────
          <>
            <Text
              fontSize="xs" fontWeight="semibold"
              color="var(--chakra-colors-fg-muted)"
              letterSpacing="wider" textTransform="uppercase"
              px={3} pt={5} mb={2}
            >
              {section.label}
            </Text>
            <Stack gap={0.5} px={2} flex={1} pb={4}>
              {section.items.map(item => (
                <SubNavItem key={item.href} item={item} pathname={pathname} />
              ))}
            </Stack>
          </>
        ))}
      </Box>
    </Box>
  )
}

// ── Rail item ─────────────────────────────────────────────────────────────

function RailItem({
  id, label, iconKey, isActive, onClick,
}: {
  id: string
  label: string
  iconKey: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <RailTooltip label={label}>
      <Box
        as="button"
        aria-label={label}
        onClick={onClick}
        display="flex"
        alignItems="center"
        justifyContent="center"
        w="40px"
        h="40px"
        rounded="sm"
        cursor="pointer"
        border="none"
        bg={isActive ? 'var(--chakra-colors-blue-100)' : 'transparent'}
        color={isActive ? 'var(--chakra-colors-blue-600)' : 'var(--chakra-colors-fg-muted)'}
        _hover={{ bg: 'var(--chakra-colors-blue-50)', color: 'var(--chakra-colors-blue-600)' }}
        transition="background-color 0.15s ease, color 0.15s ease"
      >
        <Rail d={PATHS[iconKey as keyof typeof PATHS] ?? PATHS.home} />
      </Box>
    </RailTooltip>
  )
}

// ── Sidebar ───────────────────────────────────────────────────────────────

export function Sidebar() {
  const pathname = usePathname()
  const [activeId, setActiveId]   = useState(() => getActiveSectionId(pathname))
  const [panelOpen, setPanelOpen] = useState(() => getActiveSectionId(pathname) !== 'home')

  const allSections = [...NAV_SECTIONS, ...FOOTER_SECTIONS]

  function handleRailClick(id: string) {
    if (id === activeId) {
      setPanelOpen(prev => !prev)
    } else {
      setActiveId(id)
      setPanelOpen(true)
    }
  }

  const activeSection = allSections.find(s => s.id === activeId)

  return (
    <Flex h="100vh" flexShrink={0} as="nav">
      {/* ── Icon rail ──────────────────────────────────────────────── */}
      <Flex
        h="100vh"
        w="60px"
        flexShrink={0}
        flexDirection="column"
        alignItems="center"
        bg="var(--chakra-colors-bg-panel)"
        borderRightWidth="1px"
        borderColor="var(--chakra-colors-border-subtle)"
        py={3}
        gap={0}
      >
        {/* Logo */}
        <Box
          w="32px"
          h="32px"
          rounded="sm"
          bg="var(--chakra-colors-blue-600)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          mb={4}
          flexShrink={0}
        >
          <Text fontSize="10px" fontWeight="bold" color="white" letterSpacing="tight">CS</Text>
        </Box>

        {/* Main section icons */}
        <Stack gap={1} flex={1} align="center" justify="flex-start">
          {/* Home — direct link, no secondary panel */}
          <RailTooltip label="Home">
            <Link href="/" aria-label="Home" onClick={() => { setActiveId('home'); setPanelOpen(false) }}>
              <Box
                display="flex" alignItems="center" justifyContent="center"
                w="40px" h="40px" rounded="sm"
                bg={activeId === 'home' ? 'var(--chakra-colors-blue-100)' : 'transparent'}
                color={activeId === 'home' ? 'var(--chakra-colors-blue-600)' : 'var(--chakra-colors-fg-muted)'}
                _hover={{ bg: 'var(--chakra-colors-blue-50)', color: 'var(--chakra-colors-blue-600)' }}
                transition="background-color 0.15s ease, color 0.15s ease"
              >
                <Rail d={PATHS.home} />
              </Box>
            </Link>
          </RailTooltip>

          {NAV_SECTIONS.map(s => (
            <RailItem
              key={s.id}
              id={s.id}
              label={s.label}
              iconKey={s.icon}
              isActive={activeId === s.id && panelOpen}
              onClick={() => handleRailClick(s.id)}
            />
          ))}
        </Stack>

        {/* Footer icons */}
        <Stack gap={1} align="center">
          <RailTooltip label="Help">
            <Link href="/help" aria-label="Help">
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                w="40px"
                h="40px"
                rounded="sm"
                color="var(--chakra-colors-fg-muted)"
                _hover={{ bg: 'var(--chakra-colors-blue-50)', color: 'var(--chakra-colors-blue-600)' }}
                transition="background-color 0.15s ease, color 0.15s ease"
              >
                <Rail d={PATHS.help} />
              </Box>
            </Link>
          </RailTooltip>

          {FOOTER_SECTIONS.map(s => (
            <RailItem
              key={s.id}
              id={s.id}
              label={s.label}
              iconKey={s.icon}
              isActive={activeId === s.id && panelOpen}
              onClick={() => handleRailClick(s.id)}
            />
          ))}

          {/* Profile avatar */}
          <RailTooltip label="Profile">
            <Link href="/profile" aria-label="Profile">
              <Box
                w="32px"
                h="32px"
                rounded="full"
                bg="var(--chakra-colors-blue-700)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mt={1}
                flexShrink={0}
                _hover={{ opacity: 0.85 }}
                transition="opacity 0.15s ease"
              >
                <Text fontSize="10px" fontWeight="bold" color="white">PP</Text>
              </Box>
            </Link>
          </RailTooltip>
        </Stack>
      </Flex>

      {/* ── Secondary panel ────────────────────────────────────────── */}
      <SecondaryPanel
        section={activeSection}
        isOpen={panelOpen}
        pathname={pathname}
      />
    </Flex>
  )
}
