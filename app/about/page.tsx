import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import Company from '@/components/home/Company';
import NextLayer from '@/components/home/NextLayer';

export const metadata: Metadata = {
  title: 'About',
  description: 'AGEX TECH develops reusable mobility technology for independent operators and selected AGEX-powered brands.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader adaptive theme="light" current="about" />
      <main id="main">
        <Company />
        <NextLayer />
      </main>
      <SiteFooter />
    </>
  );
}
