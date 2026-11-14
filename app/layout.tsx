import type { Metadata, Viewport } from 'next'
import './fonts.css'
import './globals.css'
import { LanguageProvider } from '@/context/LanguageContext'
import { ThemeProvider, themeBootScript } from '@/context/ThemeContext'
import LoadingScreen from '@/components/vigil/LoadingScreen'
import { loadingBootScript } from '@/lib/loading'

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
        {/*
          The typefaces are served from this origin (scripts/fetch-fonts.cjs):
          first paint used to wait on a third-party stylesheet. Only the three
          faces the opening screen is set in are fetched ahead of the CSS.
          Their names carry the release: update them after `npm run fetch:fonts`.
        */}
        {['fraunces-v38-normal-latin', 'fraunces-v38-italic-latin', 'newsreader-v26-normal-latin'].map((font) => (
          <link key={font} rel="preload" as="font" type="font/woff2" crossOrigin="anonymous" href={`/fonts/${font}.woff2`} />
        ))}
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <script dangerouslySetInnerHTML={{ __html: loadingBootScript }} />
      </head>
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <LoadingScreen />
            <div id="vigil-content">{children}</div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
