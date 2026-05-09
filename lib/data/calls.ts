import type { CallDetailData } from '@/lib/types'
import { getTranscript, TRANSCRIPTS } from './transcripts'

// ── Per-ID enrichment data ─────────────────────────────────────────────────
// For transcripts that have a richer search result, we provide detailed metadata.
// Other transcripts get sensible defaults.

type Enrichment = Omit<CallDetailData,
  | 'id' | 'date' | 'time' | 'agentName' | 'customerName'
  | 'accountName' | 'region' | 'duration' | 'tags' | 'lines'
>

const ENRICHMENTS: Record<string, Partial<Enrichment>> = {
  '2': {
    title: 'SSO login failure blocking entire team',
    severity: 'critical',
    flags: ['product-bug', 'escalation'],
    topics: ['SSO', 'Authentication', 'Access blocked'],
    issueCategory: 'Authentication / SSO',
    productArea: 'Identity & Access',
    escalationStatus: 'escalated',
    churnRisk: 'medium',
    sentiment: 'negative',
    sentimentScore: { customer: 38, agent: 82 },
    qaStatus: 'flagged',
    ticketId: 'TKT-10482',
    aiSummary: 'Entire team locked out of the platform following a security patch. Authentication error traced to SSO token expiry. Agent identified root cause, walked customer through re-authentication fix, and escalated to engineering. Issue resolved on the call.',
    mainIssue: 'Team-wide SSO authentication failure after platform security patch on 2025-03-20',
    resolutionOutcome: 'Resolved — re-authentication completed on call. Engineering team notified for patch notes update.',
    notableFlags: ['Full team access outage', 'Engineering escalation required', 'Customer had time-sensitive presentation'],
    keyMoments: [
      { id: 'km1', timestamp: '00:17', label: 'Customer reports access outage', snippet: '"We can\'t access the dashboard at all. It\'s been down for over an hour."', lineIndex: 2 },
      { id: 'km2', timestamp: '00:25', label: 'Urgency escalated', snippet: '"This is really urgent — we have a presentation in two hours."', lineIndex: 3 },
      { id: 'km3', timestamp: '00:32', label: 'Root cause identified', snippet: '"The logs show an authentication error starting at 9:45 AM."', lineIndex: 4 },
      { id: 'km4', timestamp: '00:54', label: 'Cause confirmed — security patch', snippet: '"A security patch this morning may have affected your SSO config."', lineIndex: 6 },
      { id: 'km5', timestamp: '01:20', label: 'Issue resolved on call', snippet: '"Done. The dashboard is loading!"', lineIndex: 9 },
    ],
    highlightedLines: [2, 3, 4, 6, 9],
  },
  '14': {
    title: 'Billing confusion — unrecognised storage charge',
    severity: 'high',
    flags: ['churn-risk', 'coaching-opportunity'],
    topics: ['Billing', 'Unauthorised charge', 'Refund request'],
    issueCategory: 'Billing',
    productArea: 'Billing & Subscriptions',
    escalationStatus: 'pending',
    churnRisk: 'medium',
    sentiment: 'neutral',
    sentimentScore: { customer: 52, agent: 85 },
    qaStatus: 'reviewed',
    ticketId: 'TKT-10541',
    aiSummary: 'Customer disputed a storage upgrade charge they did not authorise. Agent confirmed the charge and offered a refund pending internal review. Customer agreed to check internally whether someone on their team authorised the upgrade. Follow-up action assigned.',
    mainIssue: 'Unrecognised $340 storage upgrade charge on most recent invoice',
    resolutionOutcome: 'Partial — account flagged for refund review. Customer to confirm internally and call back within 5 days.',
    notableFlags: ['Potential unauthorised upgrade', 'Refund pending verification', 'Agent coaching: proactively offer ticket reference'],
    keyMoments: [
      { id: 'km1', timestamp: '00:08', label: 'Customer raises billing question', snippet: '"There\'s an extra charge I don\'t recognise."', lineIndex: 1 },
      { id: 'km2', timestamp: '00:47', label: 'Customer disputes the charge', snippet: '"I didn\'t authorise any upgrade. This must be a mistake."', lineIndex: 5 },
      { id: 'km3', timestamp: '01:10', label: 'Refund offer made', snippet: '"If it turns out to be unauthorised, we can process a refund."', lineIndex: 8 },
      { id: 'km4', timestamp: '01:21', label: 'Customer asks about refund timeline', snippet: '"How long does a refund take?"', lineIndex: 9 },
    ],
    highlightedLines: [1, 5, 8, 9],
  },
  '32': {
    title: 'Cancellation request — budget cuts, churn risk',
    severity: 'high',
    flags: ['churn-risk'],
    topics: ['Cancellation', 'Budget', 'Downgrade offer'],
    issueCategory: 'Cancellation / Churn',
    productArea: 'Account Retention',
    escalationStatus: 'none',
    churnRisk: 'high',
    sentiment: 'neutral',
    sentimentScore: { customer: 61, agent: 88 },
    qaStatus: 'reviewed',
    ticketId: 'TKT-10398',
    aiSummary: 'Customer requested account cancellation citing budget constraints. Agent offered a 40% downgrade to the Starter plan. Customer was receptive and agreed to a one-week hold. A plan comparison document will be emailed.',
    mainIssue: 'Budget-driven cancellation request from long-standing account on Professional plan',
    resolutionOutcome: 'Save attempt — one-week cancellation hold applied. Downgrade comparison email sent. Outcome pending.',
    notableFlags: ['Budget constraint signal — may indicate wider mid-market trend', 'Account satisfied with product quality'],
    keyMoments: [
      { id: 'km1', timestamp: '00:09', label: 'Cancellation request made', snippet: '"I\'d like to cancel my subscription, please."', lineIndex: 1 },
      { id: 'km2', timestamp: '00:22', label: 'Budget reason stated', snippet: '"We\'re going through budget cuts and have to reduce software spend."', lineIndex: 3 },
      { id: 'km3', timestamp: '00:48', label: 'Downgrade offer made', snippet: '"We do have a reduced plan at about 40% less. Would that interest you?"', lineIndex: 6 },
      { id: 'km4', timestamp: '01:36', label: 'Cancellation hold agreed', snippet: '"Yes, hold it for a week."', lineIndex: 11 },
    ],
    highlightedLines: [1, 3, 6, 11],
  },
  '5': {
    title: 'Onboarding — Slack integration and team setup',
    severity: 'low',
    flags: [],
    topics: ['Onboarding', 'Slack integration', 'Team setup'],
    issueCategory: 'Onboarding',
    productArea: 'Onboarding / Activation',
    escalationStatus: 'none',
    churnRisk: 'none',
    sentiment: 'positive',
    sentimentScore: { customer: 91, agent: 93 },
    qaStatus: 'reviewed',
    aiSummary: 'New customer successfully completed initial team setup with agent guidance. Slack integration connected on the call. Agent sent quick-start guide and recommended assigning a backup admin. Positive outcome.',
    mainIssue: 'First-day setup assistance — team invites, role assignment, and Slack integration',
    resolutionOutcome: 'Fully resolved — team setup complete, Slack connected, onboarding guide sent.',
    notableFlags: [],
    keyMoments: [
      { id: 'km1', timestamp: '00:29', label: 'Team setup guided', snippet: '"Head to the Admin panel and invite your team members by email."', lineIndex: 4 },
      { id: 'km2', timestamp: '00:56', label: 'Slack integration requested', snippet: '"We use Slack heavily — how do we connect it?"', lineIndex: 6 },
      { id: 'km3', timestamp: '01:28', label: 'Integration success', snippet: '"Connected! This is much easier than I expected."', lineIndex: 11 },
    ],
    highlightedLines: [4, 6, 11],
  },
  '78': {
    title: 'Policy compliance — agent missed escalation protocol',
    severity: 'high',
    flags: ['escalation', 'policy-concern', 'coaching-opportunity'],
    topics: ['Escalation', 'Policy', 'Agent compliance'],
    issueCategory: 'Policy Compliance',
    productArea: 'Support Operations',
    escalationStatus: 'escalated',
    churnRisk: 'medium',
    sentiment: 'negative',
    sentimentScore: { customer: 29, agent: 71 },
    qaStatus: 'flagged',
    ticketId: 'TKT-10612',
    aiSummary: 'Customer made 3 explicit manager requests over 18 minutes. Agent delayed escalation well beyond the 5-minute policy window. Customer was highly frustrated. Call has been flagged for immediate QA review and coaching.',
    mainIssue: 'Agent failed to escalate to manager within required 5-minute policy window',
    resolutionOutcome: 'Escalated — customer eventually transferred to supervisor. QA review and coaching session scheduled.',
    notableFlags: ['Policy breach — escalation delayed 13 minutes beyond policy', 'Customer made 3 manager requests', 'High coaching priority'],
    keyMoments: [
      { id: 'km1', timestamp: '03:10', label: 'First manager request', snippet: '"Can I please speak with a manager?"', lineIndex: 4 },
      { id: 'km2', timestamp: '08:45', label: 'Second manager request', snippet: '"I\'ve asked twice now. Please transfer me to a supervisor."', lineIndex: 8 },
      { id: 'km3', timestamp: '15:20', label: 'Agent delays escalation', snippet: '"Let me try one more thing first before I get my supervisor involved."', lineIndex: 12 },
      { id: 'km4', timestamp: '18:05', label: 'Third request — forced escalation', snippet: '"I\'ve asked three times now — I want to speak with a manager immediately."', lineIndex: 14 },
    ],
    highlightedLines: [4, 8, 12, 14],
  },
}

// ── Default enrichment for unenriched transcripts ──────────────────────────

const ISSUE_CATEGORIES = [
  'Billing', 'Authentication / SSO', 'Onboarding', 'Integrations',
  'Analytics / Reporting', 'Permissions / Access', 'General Inquiry',
]
const PRODUCT_AREAS = [
  'Billing & Subscriptions', 'Identity & Access', 'Onboarding / Activation',
  'Analytics / Reporting', 'Integrations', 'User Management', 'Core Platform',
]

function defaultEnrichment(index: number): Enrichment {
  const templateIndex = index % 5
  const baseFlags: Enrichment['flags'] = templateIndex === 0
    ? ['churn-risk']
    : templateIndex === 1
    ? ['product-bug']
    : templateIndex === 2
    ? ['churn-risk']
    : []

  return {
    title: [
      'Billing inquiry — invoice question',
      'Technical issue — login problem',
      'Account review — plan discussion',
      'Onboarding assistance',
      'Renewal and upgrade discussion',
    ][templateIndex],
    severity: (['medium', 'high', 'high', 'low', 'medium'] as const)[templateIndex],
    flags: baseFlags,
    topics: [
      ['Billing', 'Invoice'],
      ['Authentication', 'Access'],
      ['Cancellation', 'Plan'],
      ['Onboarding', 'Setup'],
      ['Renewal', 'Pricing'],
    ][templateIndex],
    issueCategory: ISSUE_CATEGORIES[index % ISSUE_CATEGORIES.length],
    productArea: PRODUCT_AREAS[index % PRODUCT_AREAS.length],
    escalationStatus: index % 8 === 0 ? 'escalated' : 'none',
    churnRisk: (['none', 'low', 'medium', 'high'] as const)[index % 4],
    sentiment: (['positive', 'neutral', 'negative'] as const)[index % 3],
    sentimentScore: {
      customer: 40 + (index * 7) % 50,
      agent: 70 + (index * 3) % 25,
    },
    qaStatus: (['unreviewed', 'reviewed', 'flagged'] as const)[index % 3],
    ticketId: index % 3 === 0 ? `TKT-${10200 + index}` : undefined,
    aiSummary: [
      'Customer called regarding an invoice discrepancy. Agent reviewed the account, explained the charge, and offered to process a refund if unauthorised. Follow-up scheduled.',
      'Customer reported a technical login issue. Agent identified the problem, walked through a fix, and escalated to engineering for a permanent resolution.',
      'Customer requested cancellation due to budget constraints. Agent offered a downgrade option. Customer agreed to a review period.',
      'New customer needed help with initial setup. Agent guided through team invites and integrations. Call resolved positively.',
      "Customer's contract is up for renewal. Agent presented upgrade options. Customer requested a formal quote for a multi-year deal.",
    ][templateIndex],
    mainIssue: [
      'Invoice charge query — possible billing error',
      'Login or access issue — technical root cause',
      'Cancellation request — budget-driven',
      'First-day setup assistance needed',
      'Renewal discussion — plan capacity and pricing',
    ][templateIndex],
    resolutionOutcome: [
      'Partially resolved — account flagged for billing review',
      'Resolved — fix applied on the call, engineering notified',
      'Save attempt — downgrade hold applied, outcome pending',
      'Fully resolved — onboarding completed',
      'In progress — quote sent, awaiting customer decision',
    ][templateIndex],
    notableFlags: baseFlags.length > 0 ? ['Flag identified — see QA review'] : [],
    keyMoments: [
      { id: 'km1', timestamp: '00:08', label: 'Customer states reason for call', snippet: 'Customer explains the main issue during opening.', lineIndex: 1 },
      { id: 'km2', timestamp: '00:45', label: 'Key issue identified', snippet: 'Core problem surfaced in the conversation.', lineIndex: 5 },
      { id: 'km3', timestamp: '01:20', label: 'Resolution proposed', snippet: 'Agent offers a solution or next step.', lineIndex: 9 },
    ],
    highlightedLines: [1, 5, 9],
  }
}

// ── Public API ─────────────────────────────────────────────────────────────

export function getCallDetail(id: string): CallDetailData | undefined {
  const base = getTranscript(id)
  if (!base) return undefined

  const index = parseInt(id, 10) - 1
  const enrichment = ENRICHMENTS[id] ?? {}
  const defaults = defaultEnrichment(index)

  return {
    ...base,
    ...defaults,
    ...enrichment,
  } as CallDetailData
}

export { TRANSCRIPTS }
