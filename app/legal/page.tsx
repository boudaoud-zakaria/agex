import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { LEGAL_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy, Terms & Cookies',
  description: 'AGEX TECH privacy policy, terms of service and cookie information.',
  robots: { index: false },
};

export default function LegalPage() {
  return (
    <>
      <SiteHeader theme="light" />
      <main id="main" className="legal section-light" data-theme="light">
        <div className="wrap">
          <p className="eyebrow eyebrow-line">Legal</p>
          <h1 className="display">Privacy, Terms &amp; Cookies</h1>
          <p className="draft-note">
            Placeholder: final Privacy Policy, Terms of Service and Cookie Policy to be supplied by {LEGAL_NAME} legal counsel before publication.
          </p>
          <section id="privacy">
            <h2>Privacy Policy</h2>
            <p>This section will describe what personal data AGEX TECH collects through this website (including contact-form submissions), why it is collected, how long it is kept, who it is shared with, and how to exercise your data rights.</p>
          </section>
          <section id="terms">
            <h2>Terms of Service</h2>
            <p>This section will set out the terms governing use of this website and its content.</p>
          </section>
          <section id="cookies">
            <h2>Cookies</h2>
            <p>This website does not currently set advertising or analytics cookies. This section will list any cookies in use and how to manage your preferences.</p>
          </section>
        </div>
      </main>
      <SiteFooter cta={false} />
    </>
  );
}
