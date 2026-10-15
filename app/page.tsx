import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ScrollRuler from '@/components/ScrollRuler';
import Hero from '@/components/home/Hero';
import Idea from '@/components/home/Idea';
import EngineStack from '@/components/home/EngineStack';
import EngineLayers from '@/components/home/EngineLayers';
import Solutions from '@/components/home/Solutions';
import HowItWorks from '@/components/home/HowItWorks';
import Proof from '@/components/home/Proof';
import NextLayer from '@/components/home/NextLayer';
import Company from '@/components/home/Company';
import FinalCta from '@/components/home/FinalCta';
import Reveals from '@/components/home/Reveals';
import { SITE_DESCRIPTION, SITE_URL } from '@/lib/site';

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'AGEX TECH',
  alternateName: 'AGEX',
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/agex-logo.png`,
  description: SITE_DESCRIPTION,
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <SiteHeader home />
      <ScrollRuler />
      <main id="main">
        <Hero />
        <Idea />
        <EngineStack />
        <EngineLayers />
        <Solutions />
        <HowItWorks />
        <Proof />
        <NextLayer />
        <Company />
        <FinalCta />
      </main>
      <SiteFooter />
      <Reveals />
    </>
  );
}
