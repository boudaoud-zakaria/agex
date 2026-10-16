import type { Metadata, Viewport } from 'next';
import { Figtree, JetBrains_Mono } from 'next/font/google';
import LogoSprite from '@/components/LogoSprite';
import ReadyFlag from '@/components/ReadyFlag';
import Reveals from '@/components/Reveals';
import RouteTrail from '@/components/RouteTrail';
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from '@/lib/site';
import './globals.css';

const figtree = Figtree({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-figtree', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-jetbrains', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: 'One engine. Many mobility businesses. Locally operated.',
    images: [{ url: '/og-image.png', width: 1119, height: 264, alt: 'AGEX' }],
  },
  twitter: { card: 'summary_large_image', title: SITE_TITLE, images: ['/og-image.png'] },
};

export const viewport: Viewport = { themeColor: '#0a0a0a', width: 'device-width', initialScale: 1 };

// Runs before paint:
// - adds .js so intro states apply without a flash (removed again if the app never hydrates);
// - on a first desktop visit to the homepage, marks the cinematic film intro as pending (see FilmIntro).
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');
try{if(location.pathname==='/'&&!localStorage.getItem('agex.filmSeen')&&matchMedia('(min-width: 861px)').matches&&!matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('intro-pending')}catch(e){}
setTimeout(function(){if(!window.__agexReady){d.classList.remove('js');d.classList.remove('intro-pending')}},4000)})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${figtree.variable} ${mono.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <LogoSprite />
        <a className="skip-link" href="#main">Skip to content</a>
        {children}
        <Reveals />
        <RouteTrail />
        <ReadyFlag />
      </body>
    </html>
  );
}
