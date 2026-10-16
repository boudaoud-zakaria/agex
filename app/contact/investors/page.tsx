import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ContactLayout from '@/components/contact/ContactLayout';
import InquiryForm from '@/components/contact/InquiryForm';
import GlobeArcs from '@/components/visuals/GlobeArcs';
import { countryNames } from '@/lib/countries';

export const metadata: Metadata = {
  title: 'Investors & partners',
  description: 'We partner with investors and strategic partners to scale the next generation of mobility businesses in key markets.',
  alternates: { canonical: '/contact/investors' },
};

export default function InvestorsPage() {
  return (
    <>
      <SiteHeader current="contact" ctaHref="/contact" />
      <ContactLayout
        title={[{ text: 'Explore what’s', tone: 'muted' }, { text: 'possible with AGEX.' }]}
        lede="We partner with investors and strategic partners to scale the next generation of mobility businesses in key markets."
        steps={[
          { icon: 'bars', t: 'Understand the opportunity', d: 'Learn about our strategy, markets and growth plans.' },
          { icon: 'users', t: 'Explore partnership models', d: 'Investment, co-building, or strategic collaboration.' },
          { icon: 'globe', t: 'Start a conversation', d: 'Our team will get back to you for a follow-up discussion.' },
        ]}
        switchLink={{ href: '/contact', label: 'Building a mobility business?', cta: 'Talk to our team' }}
        art={<GlobeArcs />}
      >
        <InquiryForm kind="investor" countries={countryNames()} />
      </ContactLayout>
      <SiteFooter cta={false} />
    </>
  );
}
