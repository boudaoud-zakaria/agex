import Link from 'next/link';
import type { ReactNode } from 'react';
import Icon from '@/components/Icon';
import SplitHeading from '@/components/SplitHeading';
import ContactMotion from '@/components/contact/ContactMotion';
import type { Line } from '@/lib/solutions';

type Props = {
  title: Line[];
  lede: string;
  steps: Array<{ icon: string; t: string; d?: string }>;
  switchLink: { href: string; label: string; cta: string };
  art: ReactNode;
  variant: 'customer' | 'investor';
  children: ReactNode;
};

export default function ContactLayout({ title, lede, steps, switchLink, art, variant, children }: Props) {
  return (
    <main id="main" className={`contact contact-${variant} section-dark deep`} data-theme="dark">
      <ContactMotion />
      <div className="wrap contact-grid">
        <div className="contact-intro">
          <SplitHeading as="h1" className="display" lines={title} />
          <p className="lede" data-c="text">{lede}</p>
          <ol className="contact-steps">
            {steps.map(s => (
              <li key={s.t} data-c="step">
                <span className="cs-ico" data-c="ico"><Icon name={s.icon} size={24} /></span>
                <span><b>{s.t}</b>{s.d && <span>{s.d}</span>}</span>
              </li>
            ))}
          </ol>
          <p className="contact-switch" data-c="text">{switchLink.label} <Link href={switchLink.href}>{switchLink.cta} <span aria-hidden="true">→</span></Link></p>
          <div className="contact-art" aria-hidden="true" data-c="art">{art}</div>
        </div>
        <div className="form-wrap" id="inquiry" data-c="form">{children}</div>
      </div>
    </main>
  );
}
