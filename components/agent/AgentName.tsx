'use client'

import { useAgentPanel } from '@/lib/context/agent-panel'

interface AgentNameProps {
  name: string
  /** Show the initials avatar alongside the name */
  showAvatar?: boolean
  /** Font size class passed as inline style fontSize */
  size?: 'xs' | 'sm'
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
}

export function AgentName({ name, showAvatar = false, size = 'sm' }: AgentNameProps) {
  const { openAgent } = useAgentPanel()
  const fontSize = size === 'xs' ? '0.75rem' : '0.875rem'

  return (
    <button
      onClick={e => { e.stopPropagation(); e.preventDefault(); openAgent(name) }}
      style={{
        display:    'inline-flex',
        alignItems: 'center',
        gap:        '6px',
        background: 'none',
        border:     'none',
        padding:    0,
        cursor:     'pointer',
        textAlign:  'left',
      }}
    >
      {showAvatar && (
        <span style={{
          display:         'inline-flex',
          alignItems:      'center',
          justifyContent:  'center',
          width:           '22px',
          height:          '22px',
          borderRadius:    '50%',
          background:      'var(--chakra-colors-blue-200)',
          color:           'var(--chakra-colors-blue-800)',
          fontSize:        '9px',
          fontWeight:      '700',
          flexShrink:      0,
        }}>
          {initials(name)}
        </span>
      )}
      <span style={{
        fontSize,
        color:          'var(--chakra-colors-blue-600)',
        fontWeight:     '500',
        textDecoration: 'none',
      }}
        onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
        onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
      >
        {name}
      </span>
    </button>
  )
}
