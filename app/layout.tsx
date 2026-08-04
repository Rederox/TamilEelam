import type { Metadata, Viewport } from 'next'
import './globals.css'
import { LanguageProvider } from '@/context/LanguageContext'
import { ThemeProvider, themeBootScript } from '@/context/ThemeContext'

export const metadata: Metadata = {
  title: 'Tamil Eelam — தமிழீழம் | La Veillée',
  description:
    "Une expérience immersive dédiée à l'histoire, la souffrance et la mémoire du peuple tamoul d'Eelam — pour que nos générations, et les suivantes, la portent plus loin.",
  openGraph: {
    title: 'Tamil Eelam — La Veillée · விழிப்பு',
    description: 'Une histoire qu\'on a essayé d\'effacer. Celle-ci refuse.',
    locale: 'fr_FR',
  },
}

export const viewport: Viewport = {
  themeColor: '#070605',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..600&family=JetBrains+Mono:wght@400;500&family=Noto+Serif+Tamil:ital,wght@0,300..700;1,300..700&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body>
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
