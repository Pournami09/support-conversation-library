import type { Theme } from '@/lib/types'

export const THEMES: Theme[] = [
  {
    id: 'onboarding-friction',
    name: 'Onboarding friction',
    callCount: 89,
    trend: 'rising',
    trendPercent: 23,
    summary:
      'New customers frequently struggle with team setup, permission assignment, and integration configuration during the first week. The lack of an in-product guided tour is the most cited gap.',
    tags: ['Onboarding', 'Team setup', 'Permissions', 'New customer'],
    evidenceSnippet:
      '"I thought there would be a setup wizard. Our last tool had a guided tour that walked us through everything on day one."',
    evidenceAccount: 'Zenith Holdings',
    regions: ['West', 'East', 'North'],
    productArea: 'Onboarding / Activation',
    whyItMatters:
      'Onboarding friction is correlated with higher 90-day churn. 3 accounts in this cluster have already escalated to account managers after struggling with setup. Fixing the first-run experience could reduce inbound support volume by an estimated 18%.',
    commonLanguage: [
      'setup wizard',
      'guided tour',
      'where do I start',
      'how do I invite',
      "can't find the admin panel",
      'not obvious from the UI',
    ],
    representativeQuotes: [
      {
        text: 'I thought there would be a setup wizard or something. Our last tool had a guided tour that walked us through everything.',
        account: 'Zenith Holdings',
        date: '2025-03-22',
      },
      {
        text: "How do I set different permission levels for different team members? It's not obvious from the UI at all.",
        account: 'Paradigm Inc',
        date: '2025-03-19',
      },
      {
        text: "We've been trying to get the team set up for a week. The documentation doesn't match what we see in the product.",
        account: 'Orbit Media',
        date: '2025-03-15',
      },
    ],
    relatedCalls: [
      { id: '67', title: 'Onboarding confusion — team invite flow', date: '2025-03-22', account: 'Zenith Holdings' },
      { id: '5',  title: 'Onboarding — Slack integration and team setup', date: '2025-03-28', account: 'Nexus Partners' },
      { id: '23', title: 'Permission confusion — admin access for new hire', date: '2025-03-26', account: 'Paradigm Inc' },
      { id: '44', title: 'Setup call — integration config confusion', date: '2025-03-18', account: 'Orbit Media' },
    ],
  },
  {
    id: 'billing-confusion',
    name: 'Billing confusion',
    callCount: 124,
    trend: 'stable',
    trendPercent: 2,
    summary:
      'Customers frequently call about unexpected charges, unclear invoice line items, and renewal pricing surprises. Tax exemption processing errors are a recurring sub-issue. Billing confusion is the #1 contact driver this quarter.',
    tags: ['Billing', 'Invoice', 'Refund', 'Charge dispute'],
    evidenceSnippet:
      '"I was charged $1,200 for the annual plan and also $120 for April separately. That can\'t be right."',
    evidenceAccount: 'Momentum LLC',
    regions: ['East', 'Central', 'South'],
    productArea: 'Billing / Finance',
    whyItMatters:
      'Billing confusion drives 28% of all inbound contacts. Customers who call about billing disputes have a 2.3x higher churn probability in the following 60 days. Proactive invoice explainers or better in-product charge descriptions could significantly reduce this volume.',
    commonLanguage: [
      "didn't authorise",
      'unexpected charge',
      'invoice mistake',
      "can't understand this charge",
      'double charged',
      'refund',
    ],
    representativeQuotes: [
      {
        text: "I didn't authorise any upgrade. This must be a mistake — we never requested additional storage.",
        account: 'Keystone Analytics',
        date: '2025-03-24',
      },
      {
        text: "I was charged $1,200 for the annual plan and also $120 for April separately. That can't be right.",
        account: 'Momentum LLC',
        date: '2025-03-15',
      },
      {
        text: "We submitted our tax exemption certificate weeks ago but we're still being charged state sales tax.",
        account: 'Crestline Finance',
        date: '2025-03-16',
      },
    ],
    relatedCalls: [
      { id: '14', title: 'Billing confusion — unrecognised storage charge', date: '2025-03-24', account: 'Keystone Analytics' },
      { id: '55', title: 'Invoice dispute — double charge on renewal', date: '2025-03-15', account: 'Momentum LLC' },
      { id: '71', title: 'Billing — tax exemption not applied', date: '2025-03-16', account: 'Crestline Finance' },
      { id: '82', title: 'Billing confusion — seat overage calculation', date: '2025-03-11', account: 'Apex Industries' },
    ],
  },
  {
    id: 'sso-login-failures',
    name: 'SSO login failures',
    callCount: 67,
    trend: 'rising',
    trendPercent: 41,
    summary:
      'A rising cluster of SSO authentication failures, mostly triggered by a security patch deployed on 2025-03-20. Customers report team-wide lockouts. Engineering has a fix in progress but rollout is incomplete.',
    tags: ['SSO', 'Authentication', 'Login', 'Access blocked'],
    evidenceSnippet:
      '"We can\'t access the dashboard at all. The whole team is locked out — we have a client presentation in two hours."',
    evidenceAccount: 'TechVentures Inc',
    regions: ['West', 'North'],
    productArea: 'Authentication / Identity',
    whyItMatters:
      'SSO failures result in full team lockouts, creating immediate business impact for affected customers. The 41% week-over-week rise is directly tied to the security patch on 3/20. Without a proactive customer notification, support volume will continue to spike. Priority fix.',
    commonLanguage: [
      "can't log in",
      'authentication error',
      'SSO broken',
      'whole team locked out',
      '403 error',
      'dashboard down',
    ],
    representativeQuotes: [
      {
        text: "We can't access the dashboard at all. It's been down for over an hour and we have a client presentation in two hours.",
        account: 'TechVentures Inc',
        date: '2025-03-27',
      },
      {
        text: "After your update last week, nobody on our team can get past the login screen. We're getting an authentication error.",
        account: 'Summit Technologies',
        date: '2025-03-25',
      },
      {
        text: "Is there a known issue with SSO? We've had three people unable to log in this morning.",
        account: 'Vertex Corp',
        date: '2025-03-24',
      },
    ],
    relatedCalls: [
      { id: '2',  title: 'SSO login failure blocking entire team', date: '2025-03-27', account: 'TechVentures Inc' },
      { id: '37', title: 'Account access locked — 2FA device lost', date: '2025-03-23', account: 'Beacon Logistics' },
      { id: '58', title: 'SSO misconfiguration after org rename', date: '2025-03-21', account: 'Synergy Enterprises' },
      { id: '76', title: 'Login loop after security patch', date: '2025-03-22', account: 'Summit Technologies' },
    ],
  },
  {
    id: 'analytics-export-requests',
    name: 'Analytics export requests',
    callCount: 52,
    trend: 'rising',
    trendPercent: 18,
    summary:
      'Enterprise customers frequently request custom date range exports and scheduled report delivery, neither of which is available today. The gap is causing manual workarounds and customer frustration.',
    tags: ['Analytics', 'Export', 'Reporting', 'Feature gap'],
    evidenceSnippet:
      '"We need to export usage data for a custom date range — fiscal quarter — not just the preset monthly view."',
    evidenceAccount: 'Atlas Software',
    regions: ['West', 'North', 'East'],
    productArea: 'Analytics / Reporting',
    whyItMatters:
      'This is the fastest-growing feature request cluster among enterprise accounts (>500 seats). 14 unique enterprise accounts have raised this in the past 30 days. If unaddressed, at least 3 have indicated they may evaluate alternatives with better reporting flexibility.',
    commonLanguage: [
      'custom date range',
      'export to CSV',
      'fiscal quarter report',
      'scheduled reports',
      "can't export",
      'missing export button',
    ],
    representativeQuotes: [
      {
        text: "We need to export usage data for a custom date range — say, fiscal quarter — not just the preset monthly view.",
        account: 'Atlas Software',
        date: '2025-03-14',
      },
      {
        text: "The CSV export button has just disappeared from the Reports tab. We rely on this for our Monday morning reports.",
        account: 'Apex Industries',
        date: '2025-03-18',
      },
      {
        text: "Is there a way to schedule reports to email to my VP automatically? We have to do this manually every week.",
        account: 'Crestline Finance',
        date: '2025-03-12',
      },
    ],
    relatedCalls: [
      { id: '48', title: 'Analytics export not working — missing CSV option', date: '2025-03-18', account: 'Apex Industries' },
      { id: '93', title: 'Reporting feature request — custom date range export', date: '2025-03-14', account: 'Atlas Software' },
      { id: '66', title: 'Scheduled reports not arriving', date: '2025-03-10', account: 'Crestline Finance' },
      { id: '81', title: 'Export format confusion — CSV vs XLSX', date: '2025-03-08', account: 'Keystone Analytics' },
    ],
  },
  {
    id: 'response-time-frustration',
    name: 'Frustration with response times',
    callCount: 38,
    trend: 'declining',
    trendPercent: 12,
    summary:
      'Customers are calling to complain about ticket response times, citing SLA breaches and unacknowledged escalations. The trend is declining following a support staffing increase in early March.',
    tags: ['Support SLA', 'Response time', 'Ticket', 'Customer satisfaction'],
    evidenceSnippet:
      '"We submitted that ticket three days ago. Our contract says 24-hour response and we\'ve heard nothing."',
    evidenceAccount: 'Eclipse Solutions',
    regions: ['North', 'East'],
    productArea: 'Support Operations',
    whyItMatters:
      'While trending down, SLA-related complaints directly correlate with NPS deterioration. 6 of the 38 calls include explicit statements about reconsidering the platform. The SLA breach pattern is concentrated in Tier 2 (technical) tickets.',
    commonLanguage: [
      'no response',
      'SLA breach',
      '24-hour response',
      'waiting three days',
      'ticket ignored',
      'reconsider the platform',
    ],
    representativeQuotes: [
      {
        text: "We submitted that ticket three days ago. Our contract says 24-hour response and we've heard nothing.",
        account: 'Eclipse Solutions',
        date: '2025-03-21',
      },
      {
        text: "If this keeps happening, we're going to have to reconsider whether this platform is right for us.",
        account: 'Eclipse Solutions',
        date: '2025-03-21',
      },
      {
        text: "I opened a P1 ticket on Tuesday. It's Friday and I still haven't had an acknowledgement.",
        account: 'Horizon Dynamics',
        date: '2025-03-14',
      },
    ],
    relatedCalls: [
      { id: '41', title: 'Slow response frustration — SLA complaint', date: '2025-03-21', account: 'Eclipse Solutions' },
      { id: '53', title: 'P1 ticket unacknowledged for 3 days', date: '2025-03-14', account: 'Horizon Dynamics' },
      { id: '69', title: 'Escalation — no response on billing ticket', date: '2025-03-09', account: 'Catalyst Group' },
    ],
  },
  {
    id: 'cancellation-churn-intent',
    name: 'Cancellation / churn intent',
    callCount: 41,
    trend: 'stable',
    trendPercent: 4,
    summary:
      'Calls involving explicit cancellation requests or strong churn signals. Budget constraints are the most cited reason, followed by missing features. Most customers were receptive to downgrade options when offered.',
    tags: ['Cancellation', 'Churn risk', 'Budget', 'Downgrade'],
    evidenceSnippet:
      '"We\'re going through budget cuts and have to reduce our software spend significantly this quarter."',
    evidenceAccount: 'Horizon Dynamics',
    regions: ['South', 'Central', 'West'],
    productArea: 'Retention / Account Management',
    whyItMatters:
      'These 41 calls represent $380K ARR at risk. 17 of the 41 accepted a downgrade or hold; 8 cancelled outright; 16 are still at risk. The budget-cut narrative is increasing across mid-market accounts, suggesting a broader economic sensitivity signal worth flagging to leadership.',
    commonLanguage: [
      'budget cuts',
      'reduce software spend',
      'cancel my subscription',
      'too expensive',
      'evaluating alternatives',
      'not getting the value',
    ],
    representativeQuotes: [
      {
        text: "We're going through budget cuts and have to reduce our software spend significantly this quarter.",
        account: 'Horizon Dynamics',
        date: '2025-03-20',
      },
      {
        text: "We've been happy with the product — it's purely a budget issue. If the price was lower we'd stay.",
        account: 'Horizon Dynamics',
        date: '2025-03-20',
      },
      {
        text: "We're evaluating two alternatives right now. If you can't match their pricing, we'll be moving.",
        account: 'Catalyst Group',
        date: '2025-03-13',
      },
    ],
    relatedCalls: [
      { id: '32', title: 'Cancellation request — budget cuts, churn risk', date: '2025-03-20', account: 'Horizon Dynamics' },
      { id: '61', title: 'Churn save — renewal negotiation', date: '2025-03-17', account: 'Synergy Enterprises' },
      { id: '17', title: 'Cancellation — missing enterprise features', date: '2025-03-12', account: 'Catalyst Group' },
      { id: '85', title: 'Budget review — considering downgrade', date: '2025-03-08', account: 'Paradigm Inc' },
    ],
  },
]
