import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import Proof from '@/components/home/Proof';

export const metadata: Metadata = {
  title: 'Deployments',
  description: 'AGEX technology in live mobility operations: markets, status and traction.',
  alternates: { canonical: '/deployments' },
};

export default function DeploymentsPage() {
  return (
    <>
      <SiteHeader adaptive current="deployments" />
      <main id="main"><Proof /></main>
      <SiteFooter />
    </>
  );
}
