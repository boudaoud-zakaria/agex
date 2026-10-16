import Link from 'next/link';
import BackButton from '@/components/BackButton';
import Icon from '@/components/Icon';
import SplitHeading from '@/components/SplitHeading';
import IsoTown from '@/components/visuals/IsoTown';
import LightRoads from '@/components/visuals/LightRoads';
import NetworkGraph from '@/components/visuals/NetworkGraph';
import type { Solution } from '@/lib/solutions';

export default function SolutionPage({ s }: { s: Solution }) {
  const contact = `/contact?building=${encodeURIComponent(s.building)}`;
  return (
    <>
      {/* 1 · Hero */}
      <section className="sp-hero section-light" data-theme="light" data-label={s.name}>
        <div className="sp-art sp-art-right"><IsoTown preset={s.scene} /></div>
        <div className="wrap page-back"><BackButton fallback="/#solutions" className="reveal" /></div>
        <div className="wrap sp-inner">
          <div className="sp-copy">
            <p className="eyebrow eyebrow-line reveal">{s.hero.label}</p>
            <SplitHeading as="h1" className="display" lines={s.hero.title} />
            {s.hero.body.map(p => <p key={p} className="sp-p reveal">{p}</p>)}
            {s.hero.emphasis && <p className="sp-em reveal">{s.hero.emphasis}</p>}
            <Link className="btn btn-solid-dark reveal" href={contact}>{s.hero.cta} <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      {/* 2 · Opportunity */}
      <section className="sp-opp section-dark" data-theme="dark" data-label={s.opportunity.label}>
        <div className="wrap sp-split">
          <div className="sp-copy">
            <p className="eyebrow eyebrow-line reveal">{s.opportunity.label}</p>
            <SplitHeading className="display sp-h2" lines={s.opportunity.title} />
            {s.opportunity.body.map(p => <p key={p} className="sp-p reveal">{p}</p>)}
            <p className="sp-em reveal">{s.opportunity.emphasis}</p>
            {s.opportunity.after?.map(p => <p key={p} className="sp-p reveal">{p}</p>)}
          </div>
          <div className="sp-visual reveal"><NetworkGraph preset={s.scene} /></div>
        </div>
      </section>

      {/* 3 · Guidance (not on every page) */}
      {s.guidance && (
      <section className="sp-guide section-light" data-theme="light" data-label={s.guidance.label}>
        <div className="wrap sp-guide-grid">
          <div className="sp-copy">
            <p className="eyebrow eyebrow-line reveal">{s.guidance.label}</p>
            <SplitHeading className="display sp-h2" lines={s.guidance.title} />
            {s.guidance.intro.map(p => <p key={p} className="sp-p reveal">{p}</p>)}
          </div>
          <ul className="sp-questions reveal-stagger">
            {s.guidance.questions.map(q => (
              <li key={q.q}><span className="sp-q-ico"><Icon name={q.icon} size={20} /></span>{q.q}</li>
            ))}
          </ul>
          <div className="sp-callout reveal">
            <p>{s.guidance.callout}</p>
            {s.guidance.calloutSub?.map(p => <span key={p}>{p}</span>)}
            <i aria-hidden="true" />
          </div>
        </div>
      </section>
      )}

      {/* 4 · Approach */}
      <section className="sp-approach section-light alt" data-theme="light" data-label={s.approach.label}>
        <div className="sp-art sp-art-right sp-art-fade"><LightRoads variant="wide" className="lr-on-light" /></div>
        <div className="wrap sp-inner">
          <p className="eyebrow eyebrow-line reveal">{s.approach.label}</p>
          <SplitHeading className="display sp-h2" lines={s.approach.title} />
          {s.approach.intro?.map(p => <p key={p} className="sp-p reveal">{p}</p>)}
          {s.approach.questions && (
            <ul className="sp-questions sp-questions-inline reveal-stagger">
              {s.approach.questions.map(q => <li key={q.q}><span className="sp-q-ico"><Icon name={q.icon} size={20} /></span>{q.q}</li>)}
            </ul>
          )}
          <p className="sp-p sp-sub reveal">{s.approach.sub}</p>
          <ul className="pillars">
            {s.approach.pillars.map(p => (
              <li key={p.t} className="reveal-card">
                <span className="pillar-ico"><Icon name={p.icon} size={20} /></span>
                <b>{p.t}</b>
                <span>{p.d}</span>
              </li>
            ))}
          </ul>
          {s.approach.closing && <p className="sp-em reveal">{s.approach.closing}</p>}
        </div>
      </section>

      {/* 5 · Next step */}
      <section className="sp-next section-dark deep" data-theme="dark" data-label={s.next.label}>
        <div className="sp-art sp-art-right"><LightRoads variant="band" lanes={7} /></div>
        <div className="wrap sp-inner">
          <div className="sp-copy">
            <p className="eyebrow eyebrow-line reveal">{s.next.label}</p>
            <SplitHeading className="display sp-h2" lines={s.next.title} />
            {s.next.body.map(p => <p key={p} className="sp-p reveal">{p}</p>)}
            <Link className="btn btn-solid btn-lg reveal" href={contact}>{s.next.cta} <span aria-hidden="true">→</span></Link>
            <p className="sp-note reveal">{s.next.note}</p>
          </div>
        </div>
      </section>
    </>
  );
}
