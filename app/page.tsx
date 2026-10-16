import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import Hero from '@/components/home/Hero';
import Idea from '@/components/home/Idea';
import EngineStack from '@/components/home/EngineStack';
import EngineLayers from '@/components/home/EngineLayers';
import PlatformInAction from '@/components/home/PlatformInAction';
import Solutions from '@/components/home/Solutions';
import HowItWorks from '@/components/home/HowItWorks';
import { HQ, LEGAL_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/site';

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'AGEX TECH',
  legalName: LEGAL_NAME,
  alternateName: 'AGEX',
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/agex-logo.png`,
  description: SITE_DESCRIPTION,
  address: { '@type': 'PostalAddress', streetAddress: HQ.street, postalCode: HQ.postalCode, addressLocality: 'Singapore', addressCountry: HQ.country },
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <SiteHeader home />
      <main id="main">
        <Hero />
        <Idea />
        <EngineStack />
        <EngineLayers />
        <PlatformInAction />
        <Solutions />
        <HowItWorks />
      </main>
      <SiteFooter />
    </>
  );
}
