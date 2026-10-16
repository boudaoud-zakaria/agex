import Link from 'next/link';
import type { ReactNode } from 'react';
import Icon from '@/components/Icon';
import SplitHeading from '@/components/SplitHeading';
import type { Line } from '@/lib/solutions';

type Props = {
  title: Line[];
  lede: string;
  steps: Array<{ icon: string; t: string; d?: string }>;
  switchLink: { href: string; label: string; cta: string };
  art: ReactNode;
  children: ReactNode;
};

export default function ContactLayout({ title, lede, steps, switchLink, art, children }: Props) {
  return (
    <main id="main" className="contact section-dark deep" data-theme="dark">
      <div className="contact-art" aria-hidden="true">{art}</div>
      <div className="wrap contact-grid">
        <div className="contact-intro">
          <SplitHeading as="h1" className="display" lines={title} />
          <p className="lede reveal">{lede}</p>
          <ol className="contact-steps reveal-stagger">
            {steps.map(s => (
              <li key={s.t}>
                <span className="cs-ico"><Icon name={s.icon} size={22} /></span>
                <span><b>{s.t}</b>{s.d && <span>{s.d}</span>}</span>
              </li>
            ))}
          </ol>
          <p className="contact-switch reveal">{switchLink.label} <Link href={switchLink.href}>{switchLink.cta} <span aria-hidden="true">→</span></Link></p>
        </div>
        <div className="form-wrap reveal" id="inquiry">{children}</div>
      </div>
    </main>
  );
}
