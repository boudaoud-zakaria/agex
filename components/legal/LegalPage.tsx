import Link from 'next/link';
import type { ReactNode } from 'react';
import BackButton from '@/components/BackButton';
import Icon from '@/components/Icon';
import SplitHeading from '@/components/SplitHeading';
import LegalToc from '@/components/legal/LegalToc';
import { LEGAL_DOCS, type LegalBlock, type LegalDoc } from '@/lib/legal';
import { LEGAL_NAME } from '@/lib/site';

const pad = (n: number) => String(n).padStart(2, '0');

/** Plain text with [label](href) links. */
function rich(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)) {
    const [all, label, href] = m;
    out.push(text.slice(last, m.index));
    out.push(href.startsWith('#') ? <a key={m.index} href={href}>{label}</a> : <Link key={m.index} href={href}>{label}</Link>);
    last = m.index + all.length;
  }
  out.push(text.slice(last));
  return out;
}

function Block({ b }: { b: LegalBlock }) {
  if (typeof b === 'string') return <p className="reveal">{rich(b)}</p>;
  if ('address' in b) {
    return (
      <address className="lg-address reveal">
        <Icon name="pin" size={18} />
        <span><b>{b.lead}</b>{b.address.map(l => <span key={l}>{l}</span>)}</span>
      </address>
    );
  }
  return <p className="reveal"><b>{b.lead}</b> {rich(b.text)}</p>;
}

export default function LegalPage({ doc }: { doc: LegalDoc }) {
  const other = LEGAL_DOCS.find(d => d.slug !== doc.slug)!;
  return (
    <>
      <section className="lg-hero section-light" data-theme="light" data-label={doc.shortTitle}>
        <div className="wrap">
          <BackButton fallback="/" className="reveal" />
          <p className="eyebrow eyebrow-line reveal">Legal</p>
          <SplitHeading as="h1" className="display" text={doc.title} />
          <p className="lg-meta reveal"><span>{LEGAL_NAME}</span><span>{doc.version}</span><span>{doc.date}</span></p>
          <nav className="lg-switch reveal" aria-label="Legal documents">
            {LEGAL_DOCS.map(d => (
              <Link key={d.slug} href={`/${d.slug}`} aria-current={d.slug === doc.slug ? 'page' : undefined}>{d.shortTitle}</Link>
            ))}
          </nav>
        </div>
      </section>

      <section className="lg-body section-light" data-theme="light" data-label={doc.shortTitle}>
        <div className="wrap lg-grid">
          <LegalToc items={doc.sections.map((s, i) => ({ id: s.id, n: pad(i + 1), title: s.title }))} />
          <article className="lg-article">
            {doc.sections.map((s, i) => (
              <section key={s.id} id={s.id} className="lg-sec" aria-labelledby={`${s.id}-h`}>
                <h2 id={`${s.id}-h`} className="reveal" tabIndex={-1}><span className="lg-n">{i + 1}.</span>{s.title}</h2>
                {s.body.map((b, j) => <Block key={j} b={b} />)}
              </section>
            ))}
            <div className="lg-end reveal">
              <Link className="text-link" href={`/${other.slug}`}>Read the {other.shortTitle} <span aria-hidden="true">→</span></Link>
              <Link className="btn btn-outline-dark" href="/contact">Contact AGEX <span aria-hidden="true">→</span></Link>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
