import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ContactLayout from '@/components/contact/ContactLayout';
import InquiryForm from '@/components/contact/InquiryForm';
import LightRoads from '@/components/visuals/LightRoads';
import { countryNames } from '@/lib/countries';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Tell us about your market, your business or the opportunity you see. Let’s explore what we can make possible with AGEX.',
  alternates: { canonical: '/contact' },
  openGraph: { title: 'Contact | AGEX TECH', description: 'What could we build together?' },
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader current="contact" ctaHref="#inquiry" />
      <ContactLayout
        title={[{ text: 'What could we', tone: 'muted' }, { text: 'build together?' }]}
        lede="Tell us about your market, your business or the opportunity you see. Let’s explore what we can make possible with AGEX."
        steps={[
          { icon: 'chat', t: 'Tell us what you’re looking to build.' },
          { icon: 'bars', t: 'We’ll explore your market and opportunity together.' },
          { icon: 'gear', t: 'Let’s discuss how AGEX can help you move forward.' },
        ]}
        switchLink={{ href: '/contact/investors', label: 'Investor or strategic partner?', cta: 'Start a partner inquiry' }}
        variant="customer"
        art={<LightRoads variant="highway" lanes={7} />}
      >
        <InquiryForm kind="customer" countries={countryNames()} />
      </ContactLayout>
      <SiteFooter cta={false} />
    </>
  );
}
