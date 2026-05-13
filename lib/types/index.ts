// ── Base transcript types ──────────────────────────────────────────────────

export interface TranscriptLine {
  timestamp: string
  speaker: 'Agent' | 'Customer'
  text: string
}

export interface Transcript {
  id: string
  date: string
  time: string
  agentName: string
  customerName: string
  accountName: string
  region: string
  duration: string
  tags: string[]
}

export interface TranscriptWithLines extends Transcript {
  lines: TranscriptLine[]
}

// ── Severity and flags ─────────────────────────────────────────────────────

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low'
export type CallFlag = 'escalation' | 'churn-risk' | 'product-bug' | 'policy-concern' | 'coaching-opportunity'
export type TrendDirection = 'rising' | 'stable' | 'declining'

// ── Search result card ─────────────────────────────────────────────────────

export interface Snippet {
  speaker: 'Agent' | 'Customer'
  text: string
  matchTerms: string[]
}

export interface CallResult {
  id: string
  title: string
  customerName: string
  accountName: string
  agentName: string
  date: string
  time: string
  region: string
  duration: string
  severity: SeverityLevel
  flags: CallFlag[]
  topics: string[]
  aiSummary: string
  whyResult: string
  snippets: Snippet[]
}

// ── Key moment ─────────────────────────────────────────────────────────────

export interface KeyMoment {
  id: string
  timestamp: string
  label: string
  snippet: string
  lineIndex: number
}

// ── Full call detail ───────────────────────────────────────────────────────

export interface CallDetailData extends TranscriptWithLines {
  title: string
  severity: SeverityLevel
  flags: CallFlag[]
  topics: string[]
  issueCategory: string
  productArea: string
  escalationStatus: 'none' | 'escalated' | 'pending'
  churnRisk: 'none' | 'low' | 'medium' | 'high'
  sentiment: 'positive' | 'neutral' | 'negative'
  sentimentScore: { customer: number; agent: number }
  qaStatus: 'unreviewed' | 'reviewed' | 'flagged'
  ticketId?: string
  aiSummary: string
  mainIssue: string
  resolutionOutcome: string
  notableFlags: string[]
  keyMoments: KeyMoment[]
  highlightedLines: number[]
}

// ── Theme ──────────────────────────────────────────────────────────────────

export interface ThemeQuote {
  text: string
  account: string
  date: string
}

export interface ThemeCall {
  id: string
  title: string
  date: string
  account: string
}

export interface Theme {
  id: string
  name: string
  callCount: number
  trend: TrendDirection
  trendPercent: number
  summary: string
  tags: string[]
  evidenceSnippet: string
  evidenceAccount: string
  regions: string[]
  productArea: string
  whyItMatters: string
  commonLanguage: string[]
  representativeQuotes: ThemeQuote[]
  relatedCalls: ThemeCall[]
}

// ── Saved view ─────────────────────────────────────────────────────────────

export interface SavedView {
  id: string
  name: string
  description: string
  query: string
  callCount: number
  lastUpdated: string
  icon: string
}

// ── Filter state ───────────────────────────────────────────────────────────

export interface FilterState {
  dateRange: '7d' | '30d' | '90d' | 'all'
  agents: string[]
  regions: string[]
  issueCategories: string[]
  severity: SeverityLevel[]
  flags: CallFlag[]
  durationRange: 'any' | 'short' | 'medium' | 'long'
  flaggedOnly: boolean
}
