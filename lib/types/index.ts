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
