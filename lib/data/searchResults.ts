import type { CallResult } from '@/lib/types'

export const SEARCH_RESULTS: CallResult[] = [
  {
    id: '14',
    title: 'Billing confusion — unrecognised storage charge',
    customerName: 'Jessica Lee',
    accountName: 'Keystone Analytics',
    agentName: 'Sarah Mitchell',
    date: '2025-03-24',
    time: '10:12',
    region: 'East',
    duration: '08:41',
    severity: 'high',
    flags: ['churn-risk', 'coaching-opportunity'],
    topics: ['Billing', 'Unauthorised charge', 'Refund request'],
    aiSummary:
      'Customer called about a $340 storage upgrade charge they did not authorise. Agent confirmed the charge, offered a refund pending internal review, and advised 5–7 business days. Customer was frustrated but agreed to follow up after checking internally.',
    whyResult:
      'Matches "billing confusion" via AI topic detection. Customer explicitly questioned an unexpected charge and asked about refund policy.',
    snippets: [
      {
        speaker: 'Customer',
        text: "I didn't authorise any upgrade. This must be a mistake — we never requested additional storage.",
        matchTerms: ['billing', 'unauthorised', 'upgrade'],
      },
      {
        speaker: 'Agent',
        text: "If it turns out to be unauthorised, we can process a refund. I'll note the account and flag it for review.",
        matchTerms: ['refund', 'unauthorised'],
      },
    ],
  },
  {
    id: '2',
    title: 'SSO login failure blocking entire team',
    customerName: 'Rachel Turner',
    accountName: 'TechVentures Inc',
    agentName: 'James Rodriguez',
    date: '2025-03-27',
    time: '09:08',
    region: 'West',
    duration: '11:20',
    severity: 'critical',
    flags: ['product-bug', 'escalation'],
    topics: ['SSO', 'Authentication', 'Access blocked'],
    aiSummary:
      'Entire team locked out due to SSO misconfiguration following a platform security patch. Agent identified the root cause as an auth token expiry issue and guided the customer through a re-authentication fix. Engineering team notified.',
    whyResult:
      'Strong match for "SSO login issues" — customer explicitly reported team-wide access failure traced to authentication error post-patch.',
    snippets: [
      {
        speaker: 'Customer',
        text: "We can't access the dashboard at all. It's been down for over an hour and we have a client presentation in two hours.",
        matchTerms: ['SSO', 'access', 'dashboard'],
      },
      {
        speaker: 'Agent',
        text: "A security patch this morning may have affected your SSO configuration. I can see an authentication error starting at 9:45 AM.",
        matchTerms: ['SSO', 'authentication', 'patch'],
      },
    ],
  },
  {
    id: '32',
    title: 'Cancellation request — budget cuts, churn risk',
    customerName: 'Carlos Mendez',
    accountName: 'Horizon Dynamics',
    agentName: 'Emily Chen',
    date: '2025-03-20',
    time: '14:55',
    region: 'South',
    duration: '14:07',
    severity: 'high',
    flags: ['churn-risk'],
    topics: ['Cancellation', 'Budget', 'Downgrade offer'],
    aiSummary:
      'Customer requested cancellation due to budget constraints. Agent offered a 40% downgrade to the Starter plan. Customer was receptive and agreed to a one-week hold on cancellation to review the lower-tier option.',
    whyResult:
      'Matched "churn intent" cluster. Customer explicitly requested cancellation, and agent attempted a save with a downgrade offer.',
    snippets: [
      {
        speaker: 'Customer',
        text: "We're going through budget cuts and have to reduce our software spend significantly this quarter.",
        matchTerms: ['budget', 'cancellation', 'reduce'],
      },
      {
        speaker: 'Agent',
        text: "Before I process this, we do have a reduced plan at about 40% less. Would that be of interest?",
        matchTerms: ['plan', 'downgrade', 'reduce'],
      },
    ],
  },
  {
    id: '48',
    title: 'Analytics export not working — missing CSV option',
    customerName: 'Lauren Parker',
    accountName: 'Apex Industries',
    agentName: 'Priya Patel',
    date: '2025-03-18',
    time: '11:30',
    region: 'North',
    duration: '06:52',
    severity: 'medium',
    flags: ['product-bug', 'coaching-opportunity'],
    topics: ['Analytics', 'Export', 'Missing feature'],
    aiSummary:
      'Customer reported that the CSV export option disappeared from the Reports tab after a recent update. Agent could not immediately reproduce and escalated to Level 2. Customer expressed frustration at the recurring nature of this issue.',
    whyResult:
      'Matches "analytics export" topic cluster. Customer specifically mentioned missing CSV export functionality after a product update.',
    snippets: [
      {
        speaker: 'Customer',
        text: "The CSV export button has just disappeared from the Reports tab. We rely on this for our Monday morning reports.",
        matchTerms: ['export', 'CSV', 'Reports'],
      },
      {
        speaker: 'Agent',
        text: "I'm sorry about that — I'm not able to reproduce it on my end but I'm escalating this to our Level 2 team right away.",
        matchTerms: ['export', 'escalating'],
      },
    ],
  },
  {
    id: '67',
    title: 'Onboarding confusion — team invite flow unclear',
    customerName: 'Kevin Nguyen',
    accountName: 'Zenith Holdings',
    agentName: 'Tyler Brooks',
    date: '2025-03-22',
    time: '13:20',
    region: 'West',
    duration: '18:35',
    severity: 'medium',
    flags: ['coaching-opportunity'],
    topics: ['Onboarding', 'Team setup', 'Permissions'],
    aiSummary:
      "New admin struggled with the team invite flow and permission assignment. Agent walked through the steps. Customer had expected a more guided in-product onboarding experience and mentioned a competitor's onboarding was simpler.",
    whyResult:
      'Matched "onboarding friction" — customer explicitly described confusion about team setup and mentioned competitor comparison.',
    snippets: [
      {
        speaker: 'Customer',
        text: "I thought there would be a setup wizard or something. Our last tool had a guided tour that walked us through everything on day one.",
        matchTerms: ['onboarding', 'setup', 'guided'],
      },
      {
        speaker: 'Customer',
        text: "How do I set different permission levels for different team members? It's not obvious from the UI.",
        matchTerms: ['permissions', 'setup', 'team'],
      },
    ],
  },
  {
    id: '55',
    title: 'Invoice dispute — double charge on renewal',
    customerName: 'Stephanie Adams',
    accountName: 'Momentum LLC',
    agentName: 'Marcus Thompson',
    date: '2025-03-15',
    time: '15:40',
    region: 'Central',
    duration: '09:14',
    severity: 'high',
    flags: ['churn-risk', 'escalation'],
    topics: ['Billing', 'Duplicate charge', 'Renewal'],
    aiSummary:
      'Customer was charged twice on their annual renewal — both a pro-rated monthly charge and the full annual fee were applied. Agent confirmed the billing error and initiated a refund for the duplicate charge. Customer expressed intent to review their subscription.',
    whyResult:
      'Strong match for "billing confusion". Double-charge on renewal is a clear billing error with churn risk.',
    snippets: [
      {
        speaker: 'Customer',
        text: "I was charged $1,200 for the annual plan and also $120 for April separately. That can't be right.",
        matchTerms: ['charge', 'billing', 'annual'],
      },
      {
        speaker: 'Agent',
        text: "You're correct — I can see the duplicate entry. I'm initiating a refund for the $120 charge now.",
        matchTerms: ['refund', 'duplicate', 'charge'],
      },
    ],
  },
  {
    id: '78',
    title: 'Policy compliance — agent missed escalation protocol',
    customerName: 'Daniel Wilson',
    accountName: 'Summit Technologies',
    agentName: 'Noah Williams',
    date: '2025-03-19',
    time: '10:05',
    region: 'East',
    duration: '22:18',
    severity: 'high',
    flags: ['escalation', 'policy-concern', 'coaching-opportunity'],
    topics: ['Escalation', 'Policy', 'Agent compliance'],
    aiSummary:
      'Customer requested to speak with a manager multiple times during the call. Agent attempted to resolve without escalating for 18 minutes before transferring. Policy requires escalation within 5 minutes of a manager request. This call is a coaching candidate.',
    whyResult:
      'Flagged by QA policy monitor — agent delayed escalation beyond the 5-minute policy window. Customer made 3 explicit manager requests.',
    snippets: [
      {
        speaker: 'Customer',
        text: "I've asked three times now — I want to speak with a manager. Please transfer me immediately.",
        matchTerms: ['manager', 'escalation', 'transfer'],
      },
      {
        speaker: 'Agent',
        text: "I understand, let me try one more thing first before I get my supervisor involved.",
        matchTerms: ['supervisor', 'escalation'],
      },
    ],
  },
  {
    id: '41',
    title: 'Slow response frustration — SLA complaint',
    customerName: 'Michelle Davis',
    accountName: 'Eclipse Solutions',
    agentName: 'Aisha Johnson',
    date: '2025-03-21',
    time: '16:15',
    region: 'North',
    duration: '07:30',
    severity: 'medium',
    flags: ['churn-risk'],
    topics: ['Support SLA', 'Response time', 'Customer satisfaction'],
    aiSummary:
      'Customer called to complain about a 72-hour response time on an open ticket. Agent confirmed the delay and apologised. Customer referenced their SLA entitlement and asked for written acknowledgement of the breach.',
    whyResult:
      'Matched "frustration with response times" topic cluster. Customer explicitly cited SLA breach and ticket number.',
    snippets: [
      {
        speaker: 'Customer',
        text: "We submitted that ticket three days ago. Our contract says 24-hour response and we've heard nothing.",
        matchTerms: ['SLA', 'response time', 'ticket'],
      },
      {
        speaker: 'Customer',
        text: "If this keeps happening, we're going to have to reconsider whether this platform is right for us.",
        matchTerms: ['SLA', 'reconsider'],
      },
    ],
  },
  {
    id: '89',
    title: 'Integration setup failure — Salesforce connector',
    customerName: 'Christopher Moore',
    accountName: 'Vertex Corp',
    agentName: 'Sofia Garcia',
    date: '2025-03-25',
    time: '11:55',
    region: 'West',
    duration: '16:42',
    severity: 'medium',
    flags: ['product-bug'],
    topics: ['Integrations', 'Salesforce', 'Setup failure'],
    aiSummary:
      'Customer was unable to complete Salesforce CRM integration. OAuth flow was returning a 403 error. Agent escalated to the integrations team. Root cause identified as a Salesforce API key scope mismatch. Fix expected within 48 hours.',
    whyResult:
      'Matched "integration setup issues" — customer described a specific OAuth failure with Salesforce connector.',
    snippets: [
      {
        speaker: 'Customer',
        text: "The Salesforce connector keeps failing on the OAuth step. We're getting a 403 forbidden error every time.",
        matchTerms: ['Salesforce', 'OAuth', 'integration'],
      },
      {
        speaker: 'Agent',
        text: "That 403 points to an API scope mismatch. I'm routing this to our integrations team — they should have a fix within 48 hours.",
        matchTerms: ['integration', 'API', 'scope'],
      },
    ],
  },
  {
    id: '23',
    title: 'Permission confusion — admin access for new hire',
    customerName: 'Ashley Taylor',
    accountName: 'Paradigm Inc',
    agentName: 'Liam Anderson',
    date: '2025-03-26',
    time: '09:45',
    region: 'South',
    duration: '05:19',
    severity: 'low',
    flags: [],
    topics: ['Permissions', 'Admin access', 'User management'],
    aiSummary:
      'Customer needed to grant admin access to a new team member but could not find the correct role assignment option. Agent confirmed the user was on a plan without role granularity. Offered upgrade path.',
    whyResult:
      'Matched "permission/access confusion" — customer described a specific admin role assignment issue linked to plan limitations.',
    snippets: [
      {
        speaker: 'Customer',
        text: "I need to make our new IT lead an admin but I can't find anywhere to set custom roles.",
        matchTerms: ['admin', 'permissions', 'roles'],
      },
      {
        speaker: 'Agent',
        text: "Custom role assignment is a feature on our Business plan. Your current plan supports only Owner and Member roles.",
        matchTerms: ['admin', 'roles', 'plan'],
      },
    ],
  },
  {
    id: '61',
    title: 'Churn save — renewal negotiation, multi-year deal',
    customerName: 'Jonathan Martinez',
    accountName: 'Synergy Enterprises',
    agentName: 'Sarah Mitchell',
    date: '2025-03-17',
    time: '13:00',
    region: 'Central',
    duration: '21:03',
    severity: 'high',
    flags: ['churn-risk'],
    topics: ['Renewal', 'Upgrade', 'Pricing negotiation'],
    aiSummary:
      "Customer's team grew from 15 to 40 users. Agent identified a plan overage risk and proposed a Business tier upgrade. Customer negotiated a two-year deal at $16.20/user/month. Call ended with a formal quote request.",
    whyResult:
      'Matches churn-risk and renewal themes. Customer explicitly raised plan capacity and pricing concerns.',
    snippets: [
      {
        speaker: 'Customer',
        text: "We've grown quite a bit — we're now at around 40 users, up from 15 last year. Is our plan sufficient?",
        matchTerms: ['renewal', 'upgrade', 'users'],
      },
      {
        speaker: 'Customer',
        text: "Custom reporting is something we've been wanting for months. Can we lock in a two-year rate?",
        matchTerms: ['reporting', 'renewal', 'pricing'],
      },
    ],
  },
  {
    id: '5',
    title: 'Onboarding — Slack integration and team setup',
    customerName: 'Amanda Walsh',
    accountName: 'Nexus Partners',
    agentName: 'Emily Chen',
    date: '2025-03-28',
    time: '10:30',
    region: 'East',
    duration: '12:44',
    severity: 'low',
    flags: [],
    topics: ['Onboarding', 'Slack integration', 'Team setup'],
    aiSummary:
      'New customer completed initial setup with agent assistance. Slack integration connected successfully. Agent sent the quick-start guide and recommended assigning a backup admin. Call ended positively.',
    whyResult:
      'Matched onboarding category. Customer explicitly described first-day setup needs including team invites and Slack integration.',
    snippets: [
      {
        speaker: 'Customer',
        text: "We just signed up and I'm not sure how to get the team set up. Where do we even start?",
        matchTerms: ['onboarding', 'setup', 'team'],
      },
      {
        speaker: 'Customer',
        text: "Connected! This is much easier than I expected. What else should we configure on day one?",
        matchTerms: ['onboarding', 'setup'],
      },
    ],
  },
  {
    id: '93',
    title: 'Reporting feature request — custom date range export',
    customerName: 'Melissa Jackson',
    accountName: 'Atlas Software',
    agentName: 'Marcus Thompson',
    date: '2025-03-14',
    time: '14:22',
    region: 'West',
    duration: '08:05',
    severity: 'low',
    flags: ['coaching-opportunity'],
    topics: ['Reporting', 'Feature request', 'Export'],
    aiSummary:
      'Customer requested custom date range export from the analytics dashboard. Feature does not currently exist. Agent logged the feature request and noted this was the third such request from enterprise accounts this month.',
    whyResult:
      'Matched "analytics export requests" theme. Customer described a missing export capability with a specific enterprise use case.',
    snippets: [
      {
        speaker: 'Customer',
        text: "We need to export usage data for a custom date range — say, fiscal quarter — not just the preset monthly view.",
        matchTerms: ['export', 'date range', 'analytics'],
      },
      {
        speaker: 'Agent',
        text: "That's not available yet, but I'll log it as a feature request. You're actually the third enterprise account to ask for this this month.",
        matchTerms: ['export', 'feature request', 'analytics'],
      },
    ],
  },
  {
    id: '37',
    title: 'Account access locked — 2FA device lost',
    customerName: 'Andrew White',
    accountName: 'Beacon Logistics',
    agentName: 'Priya Patel',
    date: '2025-03-23',
    time: '08:50',
    region: 'North',
    duration: '13:55',
    severity: 'high',
    flags: ['escalation'],
    topics: ['Account access', '2FA', 'Security'],
    aiSummary:
      'Customer lost their 2FA device and was locked out of their account. Agent followed the account recovery protocol, verified identity via backup email and phone, and temporarily disabled 2FA pending device replacement.',
    whyResult:
      'Matched "access blocked" and "security" topics. High severity due to account lockout with identity verification requirements.',
    snippets: [
      {
        speaker: 'Customer',
        text: "My phone was stolen and I can't get past the two-factor authentication. I'm completely locked out.",
        matchTerms: ['2FA', 'access', 'locked out'],
      },
      {
        speaker: 'Agent',
        text: "I've verified your identity via the backup email and disabled 2FA temporarily. Please re-enable it once you have a new device.",
        matchTerms: ['2FA', 'identity', 'access'],
      },
    ],
  },
  {
    id: '71',
    title: 'Billing — tax exemption not applied to invoice',
    customerName: 'Rebecca Harris',
    accountName: 'Crestline Finance',
    agentName: 'Tyler Brooks',
    date: '2025-03-16',
    time: '15:10',
    region: 'Central',
    duration: '10:28',
    severity: 'medium',
    flags: [],
    topics: ['Billing', 'Tax exemption', 'Invoice correction'],
    aiSummary:
      'Customer reported that their state tax exemption certificate was on file but tax was still being charged on their latest invoice. Agent confirmed the certificate was uploaded but not activated by the billing team. Credit memo issued.',
    whyResult:
      'Matched "billing confusion" — incorrect tax application despite valid exemption certificate on file.',
    snippets: [
      {
        speaker: 'Customer',
        text: "We submitted our tax exemption certificate weeks ago but we're still being charged state sales tax on every invoice.",
        matchTerms: ['tax', 'billing', 'invoice'],
      },
      {
        speaker: 'Agent',
        text: "I can see the certificate is uploaded but it wasn't marked as active. I'm applying it now and will issue a credit memo for the overcharged tax.",
        matchTerms: ['tax', 'billing', 'invoice', 'credit'],
      },
    ],
  },
]

// ── Filter helpers ─────────────────────────────────────────────────────────

export const ISSUE_CATEGORIES = [
  'Billing',
  'Authentication / SSO',
  'Onboarding',
  'Integrations',
  'Analytics / Reporting',
  'Permissions / Access',
  'Cancellation / Churn',
  'Policy Compliance',
  'Support SLA',
  'Feature Request',
]

export const AGENTS = [
  'Sarah Mitchell',
  'James Rodriguez',
  'Emily Chen',
  'Marcus Thompson',
  'Priya Patel',
  'Tyler Brooks',
  'Aisha Johnson',
  'Noah Williams',
  'Sofia Garcia',
  'Liam Anderson',
]

export const REGIONS = ['North', 'South', 'East', 'West', 'Central']

export const RECENT_SEARCHES = [
  'billing confusion',
  'SSO login failures',
  'churn risk calls',
  'onboarding setup',
]

export const SUGGESTED_SEARCHES = [
  'escalation this week',
  'cancellation intent',
  'analytics export',
  'integration failures',
  'policy compliance gaps',
  'slow response complaints',
]
