import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import LegalPage from '@/components/legal/LegalPage';
import { TERMS } from '@/lib/legal';

export const metadata: Metadata = {
  title: TERMS.title,
  description: TERMS.description,
  alternates: { canonical: '/terms' },
};

export default function Page() {
  return (
    <>
      <SiteHeader adaptive theme="light" />
      <main id="main" className="legal-page">
        <LegalPage doc={TERMS} />
      </main>
      <SiteFooter cta={false} />
    </>
  );
}
