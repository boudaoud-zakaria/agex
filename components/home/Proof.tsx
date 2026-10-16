import Icon from '@/components/Icon';
import SplitHeading from '@/components/SplitHeading';
import DeployMap from '@/components/visuals/DeployMap';
import { MARKETS } from '@/lib/markets';

export default function Proof() {
  return (
    <section className="proof section-dark" id="deployments" data-theme="dark" data-label="Deployments">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow eyebrow-line reveal">Deployments</p>
          <SplitHeading className="display" lines={[{ text: 'Built through', tone: 'muted' }, { text: 'real operations.' }]} />
        </div>
        <div className="proof-grid">
          <div className="metrics">
            <div className="metric reveal">
              <span className="metric-ico"><Icon name="car" size={22} /></span>
              <div>
                <p className="metric-num"><span data-count="520456">0</span>+</p>
                <p className="metric-label">Completed trips</p>
              </div>
            </div>
            <div className="metric reveal">
              <span className="metric-ico"><Icon name="database" size={22} /></span>
              <div>
                <p className="metric-num">$<span data-count="16348770">0</span>+</p>
                <p className="metric-label">Transaction value</p>
              </div>
            </div>
          </div>
          <DeployMap />
        </div>
        <div className="markets">
          {MARKETS.map(m => (
            <div key={m.name} className="market reveal-card">
              <span className={`lg lg-${m.cls}`} />
              <div><h3>{m.name}</h3><p className="label">{m.meta}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
