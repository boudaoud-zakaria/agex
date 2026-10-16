import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import AboutPage from '@/components/about/AboutPage';

export const metadata: Metadata = {
  title: 'About',
  description: 'AGEX TECH is a Singapore-headquartered mobility technology company powering independent mobility businesses through its proven Intelligent Mobility Engine.',
  alternates: { canonical: '/about' },
};

export default function Page() {
  return (
    <>
      <SiteHeader adaptive theme="light" current="about" />
      <main id="main"><AboutPage /></main>
      <SiteFooter />
    </>
  );
}
