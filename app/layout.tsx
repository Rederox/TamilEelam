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
  // ThemeProvider rewrites this when the reader turns the leaf over
  themeColor: '#000000',
  colorScheme: 'dark light',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/*
          Only the cuts the vigil actually sets. Measured against the page:
          Fraunces is never heavier than 400, Newsreader is only ever 400,
          and no Tamil on the site is italic. Asking for the full 300..700
          ranges cost 653 kB of font, two thirds of the whole page.
        */}
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..400;1,9..144,300..400&family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400&family=JetBrains+Mono:wght@400;500&family=Noto+Serif+Tamil:wght@400..700&display=swap"
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
