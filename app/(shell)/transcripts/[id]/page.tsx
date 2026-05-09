import { getCallDetail } from '@/lib/data/calls'
import { TRANSCRIPTS } from '@/lib/data/transcripts'
import CallDetail from '@/components/calls/CallDetail'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return TRANSCRIPTS.map(t => ({ id: t.id }))
}

export default async function TranscriptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const call = getCallDetail(id)
  if (!call) notFound()
  return <CallDetail call={call} />
}
