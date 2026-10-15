import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'Privacy & Terms',
  description: 'AGEX TECH privacy policy and terms of use.',
  robots: { index: false },
};

export default function LegalPage() {
  return (
    <>
      <SiteHeader theme="light" />
      <main id="main" className="legal section-light">
        <div className="wrap">
          <p className="eyebrow mono">Legal</p>
          <h1 className="display">Privacy &amp; Terms</h1>
          <p className="draft-note mono">
            Placeholder: final Privacy Policy and Terms of Use to be supplied by AGEX TECH legal counsel, including legal entity details, before publication.
          </p>
          <section id="privacy">
            <h2>Privacy Policy</h2>
            <p>This section will describe what personal data AGEX TECH collects through this website (including contact-form submissions), why it is collected, how long it is kept, who it is shared with, and how to exercise your data rights.</p>
          </section>
          <section id="terms">
            <h2>Terms of Use</h2>
            <p>This section will set out the terms governing use of this website and its content.</p>
          </section>
        </div>
      </main>
      <SiteFooter compact />
    </>
  );
}
