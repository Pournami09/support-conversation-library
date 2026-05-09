import { getTranscript, TRANSCRIPTS } from '@/lib/data/transcripts'
import TranscriptDetail from '@/components/transcripts/TranscriptDetail'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return TRANSCRIPTS.map(t => ({ id: t.id }))
}

export default async function TranscriptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const transcript = getTranscript(id)
  if (!transcript) notFound()
  return <TranscriptDetail transcript={transcript} />
}
