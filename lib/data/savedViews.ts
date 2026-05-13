import type { SavedView } from '@/lib/types'

export const SAVED_VIEWS: SavedView[] = [
  {
    id: 'escalations-week',
    name: 'Escalations this week',
    description: 'All calls with escalation flags in the last 7 days',
    query: 'escalation',
    callCount: 12,
    lastUpdated: '2025-03-28',
    icon: 'alert',
  },
  {
    id: 'churn-risk',
    name: 'Churn-risk calls',
    description: 'Calls with churn-risk flags or cancellation intent',
    query: 'churn risk cancellation',
    callCount: 41,
    lastUpdated: '2025-03-27',
    icon: 'trend-down',
  },
  {
    id: 'billing-complaints',
    name: 'Billing complaints',
    description: 'Billing disputes, unexpected charges, and refund requests',
    query: 'billing confusion',
    callCount: 28,
    lastUpdated: '2025-03-26',
    icon: 'billing',
  },
  {
    id: 'policy-compliance',
    name: 'Policy compliance review',
    description: 'Calls flagged for policy concerns or missed protocol',
    query: 'policy compliance',
    callCount: 9,
    lastUpdated: '2025-03-25',
    icon: 'shield',
  },
  {
    id: 'onboarding-friction',
    name: 'Onboarding friction',
    description: 'New customer calls with setup or activation issues',
    query: 'onboarding setup',
    callCount: 34,
    lastUpdated: '2025-03-24',
    icon: 'rocket',
  },
]

export const COLLECTIONS = [
  {
    id: 'q2-churn-evidence',
    name: 'Q2 churn evidence',
    callCount: 17,
    lastUpdated: '2025-03-25',
    description: 'Evidence set for Q2 retention review — customer quotes and escalation examples',
  },
  {
    id: 'escalation-examples',
    name: 'Escalation examples',
    callCount: 8,
    lastUpdated: '2025-03-22',
    description: 'Representative escalation calls for agent coaching sessions',
  },
  {
    id: 'coaching-review-set',
    name: 'Coaching review set',
    callCount: 14,
    lastUpdated: '2025-03-20',
    description: "March coaching cohort — calls selected for QA Manager review",
  },
]
