import SplitHeading from '@/components/SplitHeading';

export default function Solutions() {
  return (
    <section className="solutions section-light" id="solutions" data-theme="light" data-label="04 / Solutions">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow mono reveal">04 <span className="sep">/</span> Solutions</p>
          <SplitHeading className="display" text="Built for more than one journey." />
        </div>
        <div className="sol-grid">
          <article className="sol reveal-card">
            <svg className="sol-icon" viewBox="0 0 160 100" aria-hidden="true">
              <path className="draw" d="M14 70 V58 Q14 50 22 48 L44 44 L62 28 Q66 25 72 25 H104 Q111 25 115 30 L128 44 L142 48 Q148 50 148 58 V70 H132" />
              <path className="draw" d="M98 70 H62" /><path className="draw" d="M28 70 H14" />
              <circle className="draw" cx="45" cy="70" r="12" /><circle className="draw" cx="115" cy="70" r="12" />
              <path className="draw" d="M68 44 L76 31 H100 L110 44 Z" /><path className="draw" d="M88 31 V44" />
            </svg>
            <div className="sol-meta mono"><span>01</span><span className="tag tag-live">Live in market</span></div>
            <h3>Ride-hailing</h3>
            <p>Launch branded taxi, private-car and limousine services.</p>
          </article>
          <article className="sol reveal-card">
            <svg className="sol-icon" viewBox="0 0 160 100" aria-hidden="true">
              <path className="draw" d="M80 12 L114 28 V64 L80 80 L46 64 V28 Z" /><path className="draw" d="M46 28 L80 44 L114 28" /><path className="draw" d="M80 44 V80" />
              <path className="draw" d="M63 20 L97 36 V48" />
              <path className="draw dash" d="M8 88 H40" /><path className="draw dash" d="M120 88 H152" />
            </svg>
            <div className="sol-meta mono"><span>02</span><span className="tag">Available module</span></div>
            <h3>Delivery</h3>
            <p>Run courier and on-demand delivery operations.</p>
          </article>
          <article className="sol reveal-card">
            <svg className="sol-icon" viewBox="0 0 160 100" aria-hidden="true">
              <circle className="draw" cx="80" cy="50" r="12" /><circle className="draw" cx="80" cy="50" r="4" />
              <path className="draw" d="M68 50 H34 M92 50 H126 M80 38 V14 M80 62 V86" />
              <rect className="draw" x="18" y="42" width="16" height="16" rx="3" /><rect className="draw" x="126" y="42" width="16" height="16" rx="3" />
              <rect className="draw" x="72" y="2" width="16" height="12" rx="3" /><rect className="draw" x="72" y="86" width="16" height="12" rx="3" />
              <path className="draw dash" d="M34 42 L68 18 M126 42 L92 18 M34 58 L68 82 M126 58 L92 82" />
            </svg>
            <div className="sol-meta mono"><span>03</span><span className="tag">Available module</span></div>
            <h3>Fleet</h3>
            <p>Digitize dispatch, availability and operational control.</p>
          </article>
        </div>
        <div className="sol-foot">
          <p className="micro reveal">One shared technology foundation. Multiple ways to grow.</p>
          <div className="roadmap-chips reveal">
            <span className="tag tag-outline mono">On the roadmap</span>
            <ul className="mono"><li>Vehicle rental</li><li>Bus / train booking</li><li>Parcel pickup &amp; drop-off</li><li>Instant delivery</li></ul>
          </div>
        </div>
      </div>
    </section>
  );
}
