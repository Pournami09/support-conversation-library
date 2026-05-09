export type { Transcript, TranscriptLine, TranscriptWithLines } from '@/lib/types'

// ── Static lookup tables ───────────────────────────────────────────────────

const AGENTS = [
  'Sarah Mitchell', 'James Rodriguez', 'Emily Chen', 'Marcus Thompson',
  'Priya Patel', 'Tyler Brooks', 'Aisha Johnson', 'Noah Williams',
  'Sofia Garcia', 'Liam Anderson',
]

const CUSTOMERS = [
  'David Kim', 'Rachel Turner', 'Michael Brown', 'Jessica Lee',
  'Carlos Mendez', 'Amanda Walsh', 'Robert Singh', 'Lauren Parker',
  'Kevin Nguyen', 'Stephanie Adams', 'Daniel Wilson', 'Michelle Davis',
  'Christopher Moore', 'Ashley Taylor', 'Jonathan Martinez',
  'Melissa Jackson', 'Andrew White', 'Rebecca Harris', 'Joshua Martin',
  'Elizabeth Thompson', 'Brian Scott', 'Natalie Rivera', 'Sean Murphy',
  'Diana Foster', 'Eric Coleman',
]

const ACCOUNTS = [
  'Acme Corp', 'TechVentures Inc', 'Global Solutions Ltd', 'Pinnacle Systems',
  'Horizon Dynamics', 'Nexus Partners', 'Apex Industries', 'Zenith Holdings',
  'Catalyst Group', 'Momentum LLC', 'Summit Technologies', 'Eclipse Solutions',
  'Vertex Corp', 'Paradigm Inc', 'Synergy Enterprises', 'Keystone Analytics',
  'Beacon Logistics', 'Orbit Media', 'Crestline Finance', 'Atlas Software',
]

const REGIONS = ['North', 'South', 'East', 'West', 'Central']

const ALL_TAGS = [
  'billing', 'technical', 'complaint', 'inquiry', 'escalation',
  'refund', 'onboarding', 'cancellation', 'renewal', 'feedback',
]

// ── Conversation templates ─────────────────────────────────────────────────

type RawLine = { timestamp: string; speaker: 'Agent' | 'Customer'; text: string }

const TEMPLATES: RawLine[][] = [
  // 1 — Billing dispute
  [
    { timestamp: '00:00', speaker: 'Agent',    text: "Thank you for calling support, this is {agent}. How can I help you today?" },
    { timestamp: '00:08', speaker: 'Customer', text: "Hi, I have a question about my recent invoice. There's an extra charge I don't recognise." },
    { timestamp: '00:18', speaker: 'Agent',    text: "I'd be happy to help. Can I get the account name or email on file?" },
    { timestamp: '00:26', speaker: 'Customer', text: "Sure, the account is {account}." },
    { timestamp: '00:33', speaker: 'Agent',    text: "Got it. I can see the charge — that was for the additional storage upgrade applied on the 15th." },
    { timestamp: '00:47', speaker: 'Customer', text: "I didn't authorise any upgrade. This must be a mistake." },
    { timestamp: '00:54', speaker: 'Agent',    text: "Completely understandable. Did anyone else on your team have admin access?" },
    { timestamp: '01:03', speaker: 'Customer', text: "It's possible. Let me check internally and get back to you." },
    { timestamp: '01:10', speaker: 'Agent',    text: "No problem. If it turns out to be unauthorised, we can process a refund. I'll note the account." },
    { timestamp: '01:21', speaker: 'Customer', text: "How long does a refund take?" },
    { timestamp: '01:26', speaker: 'Agent',    text: "Typically 5 to 7 business days to appear on your statement." },
    { timestamp: '01:35', speaker: 'Customer', text: "Perfect. I'll follow up after I check with my team." },
    { timestamp: '01:41', speaker: 'Agent',    text: "Sounds good. Anything else I can help with today?" },
    { timestamp: '01:47', speaker: 'Customer', text: "No, that's all. Thank you." },
    { timestamp: '01:52', speaker: 'Agent',    text: "You're welcome. Have a great day!" },
  ],
  // 2 — Technical / SSO issue
  [
    { timestamp: '00:00', speaker: 'Agent',    text: "Support line, this is {agent}. What can I help you with today?" },
    { timestamp: '00:08', speaker: 'Customer', text: "Hi, we can't access the dashboard. It's been down for about an hour." },
    { timestamp: '00:17', speaker: 'Agent',    text: "I'm sorry to hear that. Let me check the system status for your account right away." },
    { timestamp: '00:25', speaker: 'Customer', text: "This is really urgent — we have a presentation in two hours." },
    { timestamp: '00:32', speaker: 'Agent',    text: "I understand. I can see account {account}. The logs show an authentication error starting at 9:45 AM." },
    { timestamp: '00:46', speaker: 'Customer', text: "Yes, that's exactly when it started. We haven't changed anything on our end." },
    { timestamp: '00:54', speaker: 'Agent',    text: "A security patch this morning may have affected your SSO config. Let me walk you through a quick fix." },
    { timestamp: '01:05', speaker: 'Customer', text: "Please go ahead." },
    { timestamp: '01:09', speaker: 'Agent',    text: "Go to Settings → Security → Single Sign-On and click Re-authenticate." },
    { timestamp: '01:20', speaker: 'Customer', text: "Done. The dashboard is loading!" },
    { timestamp: '01:26', speaker: 'Agent',    text: "Great. I'll flag this for our engineering team so the patch notes get updated." },
    { timestamp: '01:35', speaker: 'Customer', text: "Thank you so much. That was very quick." },
    { timestamp: '01:41', speaker: 'Agent',    text: "Happy to help. Good luck with the presentation!" },
    { timestamp: '01:47', speaker: 'Customer', text: "Thanks, appreciate it. Bye." },
    { timestamp: '01:50', speaker: 'Agent',    text: "Take care!" },
  ],
  // 3 — Cancellation / save attempt
  [
    { timestamp: '00:00', speaker: 'Agent',    text: "Hello, thank you for calling. This is {agent}. How can I help?" },
    { timestamp: '00:09', speaker: 'Customer', text: "I'd like to cancel my subscription, please." },
    { timestamp: '00:14', speaker: 'Agent',    text: "I'm sorry to hear that. May I ask what's driving the decision?" },
    { timestamp: '00:22', speaker: 'Customer', text: "We're going through budget cuts and have to reduce software spend." },
    { timestamp: '00:30', speaker: 'Agent',    text: "I understand. Your account is {account}, currently on the Professional plan." },
    { timestamp: '00:40', speaker: 'Customer', text: "That's right. We've been happy — it's purely a budget issue." },
    { timestamp: '00:48', speaker: 'Agent',    text: "Before I process this, we do have a reduced plan at about 40% less. Would that interest you?" },
    { timestamp: '01:00', speaker: 'Customer', text: "Possibly. What features would we lose?" },
    { timestamp: '01:07', speaker: 'Agent',    text: "You'd move to 10 seats and limited advanced analytics, but all core workflows stay intact." },
    { timestamp: '01:18', speaker: 'Customer', text: "We only have 7 users, so seats aren't a problem. Can you send me the details?" },
    { timestamp: '01:26', speaker: 'Agent',    text: "Absolutely. I'll email a comparison to the address on file. Shall I hold the cancellation while you review?" },
    { timestamp: '01:36', speaker: 'Customer', text: "Yes, hold it for a week." },
    { timestamp: '01:41', speaker: 'Agent',    text: "Done. One-week hold noted. Anything else I can help with?" },
    { timestamp: '01:48', speaker: 'Customer', text: "No, that's everything. Thanks." },
    { timestamp: '01:53', speaker: 'Agent',    text: "Of course. Talk soon!" },
  ],
  // 4 — Onboarding assistance
  [
    { timestamp: '00:00', speaker: 'Agent',    text: "Welcome to support, this is {agent}. How can I help?" },
    { timestamp: '00:07', speaker: 'Customer', text: "Hi, we just signed up for {account} and I'm not sure how to get the team set up." },
    { timestamp: '00:17', speaker: 'Agent',    text: "Congratulations on joining! I'd be glad to walk you through the onboarding steps." },
    { timestamp: '00:24', speaker: 'Customer', text: "That would be great. Where do we start?" },
    { timestamp: '00:29', speaker: 'Agent',    text: "First, head to the Admin panel and invite your team members by email under Team Management." },
    { timestamp: '00:40', speaker: 'Customer', text: "Okay, I can see that. Do I need to assign roles right away?" },
    { timestamp: '00:47', speaker: 'Agent',    text: "Not immediately, but we recommend setting at least one other admin in case you're unavailable." },
    { timestamp: '00:56', speaker: 'Customer', text: "Makes sense. What about integrations? We use Slack heavily." },
    { timestamp: '01:04', speaker: 'Agent',    text: "The Slack integration is under Integrations → Communication. It's a one-click setup with OAuth." },
    { timestamp: '01:15', speaker: 'Customer', text: "I see it. Connecting now..." },
    { timestamp: '01:20', speaker: 'Agent',    text: "Once connected, you can configure which channels receive notifications." },
    { timestamp: '01:28', speaker: 'Customer', text: "Connected! This is much easier than I expected." },
    { timestamp: '01:34', speaker: 'Agent',    text: "Glad to hear it. I'll also send over our quick-start guide — it covers the top 10 things new teams set up." },
    { timestamp: '01:44', speaker: 'Customer', text: "That would be really helpful. Thank you, {agent}." },
    { timestamp: '01:50', speaker: 'Agent',    text: "Anytime. Don't hesitate to call back if you hit any snags!" },
  ],
  // 5 — Renewal / upgrade
  [
    { timestamp: '00:00', speaker: 'Agent',    text: "Thanks for calling, this is {agent}. How can I assist you today?" },
    { timestamp: '00:08', speaker: 'Customer', text: "Hi, our contract is up next month and I want to discuss renewal options." },
    { timestamp: '00:16', speaker: 'Agent',    text: "Happy to help. I'm pulling up {account} now." },
    { timestamp: '00:23', speaker: 'Customer', text: "We've grown quite a bit — we're now at around 40 users, up from 15 last year." },
    { timestamp: '00:32', speaker: 'Agent',    text: "That's great growth! Your current plan caps at 25 users, so you'd benefit from our Business tier." },
    { timestamp: '00:43', speaker: 'Customer', text: "What does the Business tier include that we don't currently have?" },
    { timestamp: '00:50', speaker: 'Agent',    text: "Unlimited seats, priority support, custom reporting, and SSO are the main additions." },
    { timestamp: '01:02', speaker: 'Customer', text: "Custom reporting is something we've actually been wanting. What's the price difference?" },
    { timestamp: '01:10', speaker: 'Agent',    text: "The Business tier is $18 per user per month, compared to $12 on your current plan." },
    { timestamp: '01:20', speaker: 'Customer', text: "Given the growth, that makes sense. Can we lock in a two-year rate?" },
    { timestamp: '01:28', speaker: 'Agent',    text: "Yes, a two-year commitment gives you an additional 10% discount, bringing it to $16.20 per user." },
    { timestamp: '01:40', speaker: 'Customer', text: "That sounds very reasonable. Can you send me a formal quote?" },
    { timestamp: '01:47', speaker: 'Agent',    text: "Absolutely, I'll have that over to you within the hour. Anything else?" },
    { timestamp: '01:54', speaker: 'Customer', text: "No, that's all. Thanks for the quick info." },
    { timestamp: '01:59', speaker: 'Agent',    text: "My pleasure. Looking forward to the renewal!" },
  ],
]

// ── Helpers ────────────────────────────────────────────────────────────────

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function pick<T>(arr: T[], index: number): T {
  return arr[index % arr.length]
}

function generateDate(index: number): string {
  const base = new Date('2025-03-28')
  base.setDate(base.getDate() - (index % 90))
  return `${base.getFullYear()}-${pad(base.getMonth() + 1)}-${pad(base.getDate())}`
}

function generateTime(index: number): string {
  const hours = 8 + (index % 10)
  const minutes = (index * 7) % 60
  return `${pad(hours)}:${pad(minutes)}`
}

function generateDuration(index: number): string {
  const minutes = 2 + (index % 23)
  const seconds = (index * 13) % 60
  return `${pad(minutes)}:${pad(seconds)}`
}

function generateTags(index: number): string[] {
  const count = (index % 3) + 0
  const start = index % ALL_TAGS.length
  const result: string[] = []
  for (let i = 0; i < count; i++) {
    result.push(ALL_TAGS[(start + i) % ALL_TAGS.length])
  }
  return result
}

// ── Public API ─────────────────────────────────────────────────────────────

export const TRANSCRIPTS: Transcript[] = Array.from({ length: 100 }, (_, i) => ({
  id: String(i + 1),
  date: generateDate(i),
  time: generateTime(i),
  agentName: pick(AGENTS, i),
  customerName: pick(CUSTOMERS, i),
  accountName: pick(ACCOUNTS, i),
  region: pick(REGIONS, i),
  duration: generateDuration(i),
  tags: generateTags(i),
}))

export function getTranscript(id: string): TranscriptWithLines | undefined {
  const base = TRANSCRIPTS.find(t => t.id === id)
  if (!base) return undefined

  const index = parseInt(id, 10) - 1
  const template = TEMPLATES[index % TEMPLATES.length]

  const lines: TranscriptLine[] = template.map(line => ({
    ...line,
    text: line.text
      .replace('{agent}', base.agentName.split(' ')[0])
      .replace('{account}', base.accountName),
  }))

  return { ...base, lines }
}
