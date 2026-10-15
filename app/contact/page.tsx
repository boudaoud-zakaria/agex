import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ContactForm from '@/components/contact/ContactForm';
import MiniDial from '@/components/contact/MiniDial';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Launching a new mobility operation or upgrading an existing one? Tell AGEX TECH about your market.',
  alternates: { canonical: '/contact' },
  openGraph: { title: 'Contact | AGEX TECH', description: 'Let’s build your mobility business.' },
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader current="contact" ctaHref="#inquiry" />
      <main id="main" className="contact section-dark deep">
        <div className="wrap contact-grid">
          <div className="contact-intro">
            <p className="eyebrow mono">Contact <span className="sep">/</span> Start your mobility business</p>
            <h1 className="display">Let’s build your mobility business.</h1>
            <p className="lede">Launching a new operation or upgrading an existing one? Tell us about your market.</p>
            <ol className="next-steps mono" aria-label="What happens next">
              <li><span>01</span>Tell us where you want to operate</li>
              <li><span>02</span>We review your market and model</li>
              <li><span>03</span>We explore how AGEX can power your launch</li>
            </ol>
            <MiniDial />
          </div>
          <div className="form-wrap" id="inquiry">
            <ContactForm />
          </div>
        </div>
      </main>
      <SiteFooter compact />
    </>
  );
}
