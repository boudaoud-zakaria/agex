import Link from 'next/link';
import Icon from '@/components/Icon';
import SplitHeading from '@/components/SplitHeading';

const SOLUTIONS = [
  {
    slug: 'ride-hailing', title: 'Ride-hailing', text: 'Launch your own ride-hailing service under your brand, in your market.',
    items: ['On-demand and scheduled rides', 'Multiple vehicle types (economy, premium, limo)', 'Dynamic pricing and promotions', 'Multi-city ready'],
    art: (
      <>
        <path className="draw" d="M14 70 V58 Q14 50 22 48 L44 44 L62 28 Q66 25 72 25 H104 Q111 25 115 30 L128 44 L142 48 Q148 50 148 58 V70 H132" />
        <path className="draw" d="M98 70 H62" /><path className="draw" d="M28 70 H14" />
        <circle className="draw" cx="45" cy="70" r="12" /><circle className="draw" cx="115" cy="70" r="12" />
        <path className="draw" d="M68 44 L76 31 H100 L110 44 Z" /><path className="draw" d="M88 31 V44" />
        <path className="draw dash" d="M6 90 H154" />
      </>
    ),
  },
  {
    slug: 'delivery', title: 'Delivery', text: 'Run courier and on-demand delivery for food, retail and more.',
    items: ['Restaurant and retail delivery', 'Parcel and express', 'Real-time tracking', 'Flexible delivery models'],
    art: (
      <>
        <path className="draw" d="M80 10 L116 27 V65 L80 82 L44 65 V27 Z" /><path className="draw" d="M44 27 L80 44 L116 27" /><path className="draw" d="M80 44 V82" />
        <path className="draw" d="M62 18.5 L98 35.5 V48" />
        <path className="draw dash" d="M6 90 H40" /><path className="draw dash" d="M120 90 H154" />
      </>
    ),
  },
  {
    slug: 'fleet', title: 'Fleet', text: 'Manage and optimize your fleet with full operational control.',
    items: ['Fleet tracking and availability', 'Driver management', 'Maintenance and compliance', 'Cost and performance analytics'],
    art: (
      <>
        <circle className="draw" cx="80" cy="50" r="12" /><circle className="draw" cx="80" cy="50" r="4" />
        <path className="draw" d="M68 50 H34 M92 50 H126 M80 38 V14 M80 62 V86" />
        <rect className="draw" x="16" y="42" width="18" height="16" rx="3" /><rect className="draw" x="126" y="42" width="18" height="16" rx="3" />
        <rect className="draw" x="71" y="2" width="18" height="12" rx="3" /><rect className="draw" x="71" y="86" width="18" height="12" rx="3" />
        <path className="draw dash" d="M34 42 L68 18 M126 42 L92 18 M34 58 L68 82 M126 58 L92 82" />
      </>
    ),
  },
];

export default function Solutions() {
  return (
    <section className="solutions section-light" id="solutions" data-theme="light" data-label="Solutions">
      <div className="wrap">
        <div className="section-head">
          <SplitHeading className="display" lines={[{ text: 'One platform.', tone: 'muted' }, { text: 'Multiple mobility businesses.' }]} />
          <p className="lede reveal">Launch and operate ride-hailing, delivery and fleet services under your own brand.</p>
        </div>
        <div className="sol-grid">
          {SOLUTIONS.map(s => (
            <article key={s.slug} className="sol reveal-card">
              <svg className="sol-icon" viewBox="0 0 160 100" aria-hidden="true">{s.art}</svg>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <ul className="checklist">
                {s.items.map(it => <li key={it}><Icon name="check" size={18} />{it}</li>)}
              </ul>
              <Link className="text-link" href={`/solutions/${s.slug}`}>Explore solution <span aria-hidden="true">→</span></Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
