import Link from 'next/link';
import Icon from '@/components/Icon';
import SplitHeading from '@/components/SplitHeading';
import AboutEngine from '@/components/visuals/AboutEngine';

const TRADITIONAL = [
  { icon: 'clock', t: 'Unproven technology', d: 'Develop and test a new platform before serving real customers.' },
  { icon: 'database', t: 'Long development cycles', d: 'Spend months or years building and integrating the technology before launch.' },
  { icon: 'warning', t: 'High technology investment', d: 'Commit significant capital to development, infrastructure and ongoing technical resources.' },
  { icon: 'gear', t: 'Ongoing technical complexity', d: 'Manage technology development, deployment, maintenance and continuous upgrades independently.' },
];
const ADVANTAGE = [
  { icon: 'rocket', t: 'Proven in real operations', d: 'Technology shaped by actual mobility transactions, not just product development.' },
  { icon: 'bars', t: 'Faster to market', d: 'Launch with an established platform instead of developing one from scratch.' },
  { icon: 'database', t: 'More capital for your business', d: 'Focus investment on customers, drivers, partnerships and market growth rather than rebuilding core technology.' },
  { icon: 'users', t: 'A partner beyond technology', d: 'Access business-model expertise, deployment support and ongoing technology maintenance as your operations evolve.' },
];

export default function AboutPage() {
  return (
    <>
      <section className="ab-hero section-light" id="about" data-theme="light" data-label="About">
        <div className="wrap">
          <div className="ab-grid">
            <div className="ab-copy">
              <p className="eyebrow reveal">About AGEX</p>
              <SplitHeading as="h1" className="display" lines={[{ text: 'Global technology.' }, { text: 'Local mobility.' }]} />
              <p className="sp-p reveal">AGEX TECH is a Singapore-headquartered mobility technology company powering independent mobility businesses through its proven Intelligent Mobility Engine.</p>
              <p className="sp-p reveal">Our engine operates across multiple markets, powering hundreds of thousands of completed trips and millions of dollars in mobility transactions.</p>
              <p className="sp-p reveal">We combine proven technology, operational experience and business expertise to help entrepreneurs and established operators launch, manage and scale mobility services under their own brands.</p>
            </div>
            <div className="ab-visual reveal"><AboutEngine /></div>
          </div>

          <div className="ab-cards">
            <article className="ab-card reveal-card">
              <span className="ab-card-ico"><Icon name="globe" size={30} /></span>
              <div>
                <p className="eyebrow">Our purpose</p>
                <h2>Empowering local{' '}<br />mobility leaders.</h2>
                <div className="ab-card-body">
                  <p>We believe the future of mobility should be shaped by those who understand their markets.</p>
                  <p>Our purpose is to give local entrepreneurs and operators the technology and expertise to build competitive mobility businesses, own their customer relationships and grow under their own brands.</p>
                </div>
              </div>
            </article>
            <article className="ab-card reveal-card">
              <span className="ab-card-ico"><Icon name="network" size={30} /></span>
              <div>
                <p className="eyebrow">Our approach</p>
                <h2>Proven technology.{' '}<br />Real experience.{' '}<br />Shared ambition.</h2>
                <div className="ab-card-body">
                  <p>We bring together a complete mobility technology engine, real-world operating experience and business-building expertise.</p>
                  <p>We work alongside our customers to shape the business model, configure and deploy the technology, and support the platform as their operations grow.</p>
                  <p className="ab-em">You lead your market and operations.{' '}<br />AGEX powers the technology and supports your journey.</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="ab-adv section-light alt" data-theme="light" data-label="The AGEX advantage">
        <div className="wrap">
          <div className="section-head ab-adv-head">
            <p className="eyebrow reveal">The AGEX advantage</p>
            <SplitHeading className="display sp-h2" text="Built on experience. Designed for your growth." />
            <p className="lede reveal">Unlike starting from scratch, AGEX gives mobility businesses access to an established technology engine, shaped by real operations and supported by the expertise to turn market opportunities into sustainable businesses.</p>
          </div>
          <div className="ab-compare">
            <div className="ab-col reveal-card">
              <h3>The traditional path</h3>
              <p className="ab-col-sub">Build, test and maintain everything yourself.</p>
              <ul>
                {TRADITIONAL.map(r => (
                  <li key={r.t}><Icon name={r.icon} size={30} className="ab-row-ico" /><span><b>{r.t}</b><span>{r.d}</span></span></li>
                ))}
              </ul>
            </div>
            <div className="ab-col is-agex reveal-card">
              <h3>The AGEX advantage</h3>
              <p className="ab-col-sub">A faster, smarter and more proven route.</p>
              <ul>
                {ADVANTAGE.map(r => (
                  <li key={r.t}><span className="ab-row-box"><Icon name={r.icon} size={26} /></span><span><b>{r.t}</b><span>{r.d}</span></span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="ab-partners section-light alt" data-theme="light" data-label="Investors & strategic partners">
        <div className="wrap ab-partners-inner">
          <div>
            <p className="eyebrow reveal">Investors &amp; strategic partners</p>
            <SplitHeading className="ab-partners-title" text="Interested in the future of mobility?" />
            <p className="ab-partners-sub reveal">Explore investment and strategic partnership opportunities with AGEX TECH.</p>
          </div>
          <Link className="btn btn-outline-dark btn-lg reveal" href="/contact/investors">Connect with AGEX <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </>
  );
}
