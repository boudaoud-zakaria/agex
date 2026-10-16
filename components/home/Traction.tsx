import Icon from '@/components/Icon';
import DeployMap from '@/components/visuals/DeployMap';

/** Traction strip + deployments map, directly beneath the hero (revision deck, slide 5). */
export default function Traction() {
  return (
    <section className="traction section-dark deep" id="deployments" data-theme="dark" data-label="Deployments" aria-label="Traction and deployments">
      <div className="wrap">
        <div className="tr-strip">
          <div className="tr-metric reveal">
            <span className="tr-ico"><Icon name="car" size={22} /></span>
            <div>
              <p className="tr-num"><span data-count="520456">0</span>+</p>
              <p className="tr-label">Completed trips</p>
            </div>
          </div>
          <span className="tr-sep" aria-hidden="true" />
          <div className="tr-metric reveal">
            <span className="tr-ico"><Icon name="coins" size={22} /></span>
            <div>
              <p className="tr-num">$<span data-count="16348770">0</span>+</p>
              <p className="tr-label">Transaction value</p>
            </div>
          </div>
        </div>
        <div className="tr-map reveal"><DeployMap /></div>
      </div>
    </section>
  );
}
