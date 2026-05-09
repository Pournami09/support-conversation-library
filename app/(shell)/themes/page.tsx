import { Suspense } from 'react'
import { ThemesList } from '@/components/themes/ThemesList'

export default function ThemesPage() {
  return (
    <Suspense>
      <ThemesList />
    </Suspense>
  )
}
