import type { Metadata } from 'next'
import { Provider } from '@/components/ui/provider'

export const metadata: Metadata = {
  title: 'CS Tool',
  description: 'Support conversation library',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
          @keyframes fadeInChip {
            from { opacity: 0; transform: translateY(-4px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes shimmerSlide {
            0%   { transform: translateX(-100%); }
            100% { transform: translateX(250%); }
          }
          @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}</style>
      </head>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
