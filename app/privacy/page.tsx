import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import LegalPage from '@/components/legal/LegalPage';
import { PRIVACY } from '@/lib/legal';

export const metadata: Metadata = {
  title: PRIVACY.title,
  description: PRIVACY.description,
  alternates: { canonical: '/privacy' },
};

export default function Page() {
  return (
    <>
      <SiteHeader adaptive theme="light" />
      <main id="main" className="legal-page">
        <LegalPage doc={PRIVACY} />
      </main>
      <SiteFooter cta={false} />
    </>
  );
}
