import { Suspense } from 'react'
import { SearchResults } from '@/components/search/SearchResults'

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params.q ?? ''
  return (
    <Suspense>
      <SearchResults initialQuery={query} />
    </Suspense>
  )
}
