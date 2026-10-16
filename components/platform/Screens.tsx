/**
 * Product interface screens for "Real products. Real operations." — recreated from the approved
 * "Website view revision" reference (slide 14). Values shown are illustrative sample data;
 * replace with real screenshots via `src` in lib/products.ts when available.
 * Phone screens are laid out on a 30em-wide grid, desktop screens on 100em (see .ui in globals.css).
 */
import type { ReactNode } from 'react';
import Icon from '@/components/Icon';

/* ---------- shared bits ---------- */
function Status({ light = false }: { light?: boolean }) {
  return (
    <div className={`ui-status${light ? ' is-light' : ''}`}>
      <b>9:41</b>
      <span className="ui-status-icons" aria-hidden="true">
        <svg viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx=".6" /><rect x="5" y="5.5" width="3" height="6.5" rx=".6" /><rect x="10" y="3" width="3" height="9" rx=".6" /><rect x="15" y="0" width="3" height="12" rx=".6" /></svg>
        <svg viewBox="0 0 16 12"><path d="M8 11.5 1 4.3a10 10 0 0 1 14 0L8 11.5Z" /></svg>
        <svg viewBox="0 0 26 12"><rect x=".5" y=".5" width="22" height="11" rx="3" fill="none" stroke="currentColor" /><rect x="2.5" y="2.5" width="17" height="7" rx="1.6" /><rect x="23.5" y="4" width="2" height="4" rx="1" /></svg>
      </span>
    </div>
  );
}

const STREETS = [
  'M-10 60 C 60 70, 120 40, 310 52', 'M-10 150 C 80 140, 170 170, 310 160', 'M-10 250 C 90 240, 200 268, 310 250', 'M-10 340 C 100 330, 200 360, 310 345',
  'M40 -10 C 50 120, 30 260, 52 440', 'M120 -10 C 112 140, 132 280, 118 440', 'M205 -10 C 214 100, 196 260, 210 440', 'M275 -10 C 268 150, 284 300, 270 440',
  'M-10 400 L 160 210 L 310 110', 'M-10 20 L 140 120 L 310 300', 'M60 440 C 120 380, 200 330, 310 210', 'M160 -10 C 170 60, 230 90, 310 96',
];
const MINOR = [
  'M-10 105 H310', 'M-10 200 H310', 'M-10 298 H310', 'M-10 385 H310', 'M85 -10 V440', 'M165 -10 V440', 'M240 -10 V440',
  'M0 230 L90 300', 'M190 20 L300 140', 'M20 330 L120 260', 'M210 380 L300 300',
];

function CarTop({ x, y, r = 0, blue = false }: { x: number; y: number; r?: number; blue?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`} className={blue ? 'ui-car is-blue' : 'ui-car'}>
      <rect x="-5" y="-9" width="10" height="18" rx="3.6" />
      <rect x="-3.6" y="-5" width="7.2" height="4" rx="1.2" className="ui-car-glass" />
      <rect x="-3.6" y="3" width="7.2" height="3" rx="1" className="ui-car-glass" />
    </g>
  );
}

function MapView({ light = false, route, children, id }: { light?: boolean; route?: string; children?: ReactNode; id: string }) {
  return (
    <svg className={`ui-map${light ? ' is-light' : ''}`} viewBox="0 0 300 430" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect className="ui-map-bg" x="0" y="0" width="300" height="430" />
      <path className="ui-park" d="M180 180 C 220 170, 260 190, 262 230 C 262 262, 220 280, 190 262 C 168 250, 160 196, 180 180 Z" />
      {MINOR.map(d => <path key={d} className="ui-street-minor" d={d} />)}
      {STREETS.map(d => <path key={d} className="ui-street" d={d} />)}
      {route && (
        <>
          <path className="ui-route-glow" d={route} />
          <path className="ui-route" d={route} id={id} />
        </>
      )}
      {children}
    </svg>
  );
}

function TabBar({ items, active = 0 }: { items: Array<{ icon: string; label: string; badge?: boolean }>; active?: number }) {
  return (
    <div className="ui-tabs">
      {items.map((t, i) => (
        <span key={t.label} className={i === active ? 'is-on' : undefined}>
          <span className="ui-tab-ico"><Icon name={t.icon} size={18} />{t.badge && <i />}</span>{t.label}
        </span>
      ))}
    </div>
  );
}

function SideCar({ className = '' }: { className?: string }) {
  return (
    <svg className={`ui-sidecar ${className}`} viewBox="0 0 120 44" aria-hidden="true">
      <path className="body" d="M6 30 V24 Q6 19 12 18 L30 15 L44 6 Q48 4 54 4 H78 Q86 4 92 9 L102 16 L112 18 Q116 19 116 24 V30 Q116 33 112 33 H8 Q6 33 6 30 Z" />
      <path className="glass" d="M48 8 H76 Q82 8 86 11 L94 16 H40 Z" />
      <circle className="wheel" cx="30" cy="33" r="8" /><circle className="hub" cx="30" cy="33" r="3.4" />
      <circle className="wheel" cx="94" cy="33" r="8" /><circle className="hub" cx="94" cy="33" r="3.4" />
    </svg>
  );
}

const CUSTOMER_TABS = [{ icon: 'home', label: 'Home' }, { icon: 'utensils', label: 'Food' }, { icon: 'car', label: 'Rent' }, { icon: 'layers', label: 'More' }];
const DRIVER_TABS = [{ icon: 'route', label: 'Trips' }, { icon: 'wallet', label: 'Earnings' }, { icon: 'chat', label: 'Messages', badge: true }, { icon: 'layers', label: 'More' }];

/* ---------- Customer app ---------- */
export function CustomerBooking() {
  const route = 'M86 150 C 100 190, 120 230, 150 262';
  return (
    <div className="ui ui-phone ui-dark">
      <Status />
      <div className="ui-search"><Icon name="target" size={15} /><span>Where to?</span><b>×</b></div>
      <div className="ui-mapwrap">
        <MapView route={route} id="r-cust-a">
          <CarTop x={92} y={62} r={-30} /><CarTop x={238} y={128} r={40} /><CarTop x={232} y={300} r={-12} /><CarTop x={60} y={330} r={70} />
          <g className="ui-pickup"><circle className="ui-ring" cx="86" cy="150" r="14" /><circle className="ui-pin-dot" cx="86" cy="150" r="7" /></g>
          <g transform="translate(150 262)" className="ui-dest"><circle r="13" /><path d="M-5 -4 L0 -7 L5 -4 V2 Q5 6 0 8 Q-5 6 -5 2 Z" /></g>
          <g className="ui-mover" data-route="r-cust-a"><CarTop x={0} y={0} blue /></g>
          <text className="ui-maplabel" x="58" y="128">Pickup</text>
        </MapView>
        <span className="ui-fab"><Icon name="user" size={14} /></span>
      </div>
      <div className="ui-sheet">
        <div className="ui-sheet-row"><div><b className="ui-h">Home</b><span className="ui-sub">5 min away</span></div><SideCar /></div>
        <span className="ui-btn ui-btn-light">Confirm ride</span>
      </div>
      <TabBar items={CUSTOMER_TABS} />
    </div>
  );
}

export function CustomerSelect() {
  const rides = [{ t: 'Standard', m: '2 min · AED 18', sel: true }, { t: 'Comfort', m: '3 min · AED 24' }, { t: 'XL', m: '4 min · AED 32' }];
  return (
    <div className="ui ui-phone ui-light">
      <Status light />
      <div className="ui-search is-light"><span className="ui-dotline" /><span>Home → Dubai Mall</span><b>⋯</b></div>
      <div className="ui-mapwrap is-short">
        <MapView light route="M70 300 C 110 250, 150 220, 210 150" id="r-cust-b">
          <circle className="ui-pin-dot" cx="70" cy="300" r="6" /><circle className="ui-pin-dot" cx="210" cy="150" r="6" />
        </MapView>
      </div>
      <div className="ui-sheet is-light">
        <div className="ui-sheet-head"><b className="ui-h">Select a ride</b><span>⌄</span></div>
        {rides.map(r => (
          <div key={r.t} className={`ui-ride${r.sel ? ' is-sel' : ''}`}>
            <SideCar className="is-thumb" /><div><b>{r.t}</b><span className="ui-sub">{r.m}</span></div>
          </div>
        ))}
        <div className="ui-pay"><Icon name="card" size={14} /><span>Visa •••• 4242</span><b>Change</b></div>
        <span className="ui-btn ui-btn-dark">Confirm ride</span>
      </div>
    </div>
  );
}

export function CustomerTrip() {
  return (
    <div className="ui ui-phone ui-dark">
      <Status />
      <div className="ui-banner"><b>Your driver is arriving</b><span>2 min · Toyota Camry · D 48213</span></div>
      <div className="ui-mapwrap">
        <MapView route="M150 90 C 140 150, 110 200, 96 262" id="r-cust-c">
          <g className="ui-pickup"><circle className="ui-ring" cx="96" cy="262" r="14" /><circle className="ui-pin-dot" cx="96" cy="262" r="7" /></g>
          <g className="ui-mover" data-route="r-cust-c"><CarTop x={0} y={0} blue /></g>
        </MapView>
      </div>
      <div className="ui-sheet">
        <div className="ui-driver">
          <span className="ui-avatar">S</span>
          <div><b>Samir</b><span className="ui-sub">★ 4.9 · 1,240 trips</span></div>
          <span className="ui-iconbtn"><Icon name="phone" size={14} /></span><span className="ui-iconbtn"><Icon name="chat" size={14} /></span>
        </div>
        <div className="ui-pay is-dark"><Icon name="card" size={14} /><span>AED 24 · Visa •••• 4242</span><b>Share trip</b></div>
      </div>
      <TabBar items={CUSTOMER_TABS} />
    </div>
  );
}

/* ---------- Driver app ---------- */
export function DriverPickup() {
  const route = 'M150 40 C 150 120, 168 170, 150 230 C 140 270, 130 300, 128 340';
  return (
    <div className="ui ui-phone ui-dark">
      <Status />
      <div className="ui-navcard">
        <span className="ui-navico"><Icon name="arrow" size={16} /><small>300 m</small></span>
        <div><span className="ui-sub">Pick up in 2 min</span><b>320 m</b></div>
        <b className="ui-x">×</b>
      </div>
      <div className="ui-mapwrap">
        <MapView route={route} id="r-drv-a">
          <CarTop x={150} y={150} blue />
          <g className="ui-mover is-nav" data-route="r-drv-a"><circle r="13" className="ui-navdot" /><path d="M0 -7 L5 5 L0 2 L-5 5 Z" className="ui-navarrow" /></g>
        </MapView>
        <span className="ui-fab is-left"><Icon name="target" size={14} /></span>
      </div>
      <div className="ui-sheet">
        <div className="ui-driver">
          <span className="ui-avatar">A</span>
          <div><b>Ahmed</b><span className="ui-sub">★ 4.9 (120)</span></div>
          <span className="ui-iconbtn"><Icon name="phone" size={14} /></span><span className="ui-iconbtn"><Icon name="chat" size={14} /></span>
        </div>
        <span className="ui-btn ui-btn-blue">Arrived at pickup</span>
      </div>
      <TabBar items={DRIVER_TABS} />
    </div>
  );
}

export function DriverRequest() {
  return (
    <div className="ui ui-phone ui-dark">
      <Status />
      <div className="ui-mapwrap is-dim">
        <MapView route="M70 330 C 120 280, 170 240, 230 120" id="r-drv-b">
          <circle className="ui-pin-dot" cx="70" cy="330" r="6" /><circle className="ui-pin-dot" cx="230" cy="120" r="6" />
        </MapView>
      </div>
      <div className="ui-request">
        <div className="ui-request-head"><b className="ui-h">New ride request</b><span className="ui-count"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15" /><circle cx="18" cy="18" r="15" className="ui-count-bar" /></svg><i>12s</i></span></div>
        <div className="ui-stop"><i className="is-a" /><div><b>Al Wasl Road</b><span className="ui-sub">2.1 km · 4 min away</span></div></div>
        <div className="ui-stop"><i className="is-b" /><div><b>Dubai Marina</b><span className="ui-sub">14 km trip</span></div></div>
        <div className="ui-fare"><span className="ui-sub">Estimated fare</span><b>AED 46</b></div>
        <div className="ui-btnrow"><span className="ui-btn ui-btn-ghost">Decline</span><span className="ui-btn ui-btn-blue">Accept</span></div>
      </div>
      <TabBar items={DRIVER_TABS} />
    </div>
  );
}

export function DriverEarnings() {
  const days = [42, 58, 50, 72, 64, 88, 76];
  return (
    <div className="ui ui-phone ui-dark">
      <Status />
      <div className="ui-pagehead"><b className="ui-h">Earnings</b><span className="ui-chip">Today ⌄</span></div>
      <div className="ui-earn"><span className="ui-sub">Total earned</span><b>AED 486.50</b></div>
      <div className="ui-stats"><span><b>18</b>Trips</span><span><b>7h 40m</b>Online</span><span><b>4.9</b>Rating</span></div>
      <div className="ui-week">{days.map((h, i) => <i key={i} className="ui-bar" style={{ height: `${h}%` }} />)}</div>
      <div className="ui-weeklbl">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <span key={i}>{d}</span>)}</div>
      <div className="ui-list">
        {[['Downtown → Marina', 'AED 46'], ['JLT → Business Bay', 'AED 31'], ['Deira → Airport', 'AED 28']].map(([a, b]) => (
          <div key={a}><span>{a}</span><b>{b}</b></div>
        ))}
      </div>
      <TabBar items={DRIVER_TABS} active={1} />
    </div>
  );
}

/* ---------- Operator platform ---------- */
const NAV = ['Dashboard', 'Operations', 'Fleet', 'Drivers', 'Customers', 'Payments', 'Analytics', 'Support', 'Settings'];
const NAV_ICONS = ['layers', 'route', 'car', 'user', 'users', 'card', 'bars', 'headset', 'gear'];
function DeskShell({ active, children }: { active: number; children: ReactNode }) {
  return (
    <div className="ui ui-desk">
      <aside className="ud-side">
        <svg className="ud-logo" viewBox="0 0 1841 254" aria-hidden="true"><use href="#agex-logo" /></svg>
        {NAV.map((n, i) => (
          <span key={n} className={i === active ? 'is-on' : undefined}><Icon name={NAV_ICONS[i]} size={13} />{n}{i >= 4 && i <= 6 ? <em>›</em> : null}</span>
        ))}
      </aside>
      <div className="ud-main">
        <div className="ud-top"><span className="ud-search"><Icon name="target" size={12} />Search…</span><span className="ud-city"><Icon name="pin" size={12} />Dubai ⌄</span><span className="ud-avatar">AM</span></div>
        {children}
      </div>
    </div>
  );
}

const KPIS = [['Total Rides', '12,428', '+12%'], ['Active Drivers', '1,230', '+8%'], ['Gross Volume', 'AED 284,560', '+15%'], ['Completion Rate', '98.2%', '+2%']];
const RIDES = [22, 30, 26, 38, 34, 44, 40, 50, 46, 56, 52, 62, 58, 66, 60, 70, 64, 74, 70, 80, 76, 86, 80, 92];

function FleetMap({ big = false }: { big?: boolean }) {
  const cars: Array<[number, number, number, boolean]> = big
    ? [[60, 70, 20, false], [150, 60, -40, true], [230, 110, 70, false], [90, 160, 10, true], [180, 190, -20, false], [250, 230, 40, true], [70, 260, -60, false], [150, 300, 30, false], [230, 320, -10, true], [110, 360, 80, false], [200, 380, 0, false], [270, 160, -30, false]]
    : [[70, 120, 20, false], [150, 90, -40, true], [220, 140, 70, false], [110, 220, 10, true], [200, 250, -20, false], [250, 80, 40, false]];
  return (
    <MapView id={big ? 'fm-big' : 'fm'}>
      {cars.map(([x, y, r, b], i) => <g key={i} className="ud-veh"><CarTop x={x} y={y} r={r} blue={b} /></g>)}
      <circle className="ui-pin-dot" cx="150" cy="200" r="6" />
    </MapView>
  );
}

export function OperatorDashboard() {
  return (
    <DeskShell active={0}>
      <div className="ud-kpis">
        {KPIS.map(([t, v, d]) => <div key={t} className="ud-card"><span className="ud-muted">{t}</span><b>{v}</b><em>▲ {d}</em></div>)}
      </div>
      <div className="ud-row">
        <div className="ud-card ud-chart">
          <div className="ud-cardhead"><b>Rides</b><span className="ud-pill">Last 28 days ⌄</span></div>
          <div className="ud-plot">
            <div className="ud-y"><span>1,500</span><span>1,000</span><span>500</span><span>0</span></div>
            <div className="ud-bars">{RIDES.map((h, i) => <i key={i} className="ui-bar" style={{ height: `${h}%` }} />)}</div>
          </div>
          <div className="ud-x"><span>Oct 1</span><span>Oct 7</span><span>Oct 14</span><span>Oct 21</span><span>Oct 28</span></div>
        </div>
        <div className="ud-card ud-fleet"><div className="ud-cardhead"><b>Live Fleet</b></div><div className="ud-mapbox"><FleetMap /></div></div>
      </div>
      <div className="ud-row">
        <div className="ud-card ud-dist">
          <div className="ud-cardhead"><b>Ride Distribution</b></div>
          <div className="ud-distbody">
            <svg viewBox="0 0 42 42" className="ud-donut" aria-hidden="true">
              <circle cx="21" cy="21" r="15.9" className="ud-donut-bg" />
              <circle cx="21" cy="21" r="15.9" className="ud-seg s1" strokeDasharray="68 32" strokeDashoffset="25" />
              <circle cx="21" cy="21" r="15.9" className="ud-seg s2" strokeDasharray="22 78" strokeDashoffset="-43" />
              <circle cx="21" cy="21" r="15.9" className="ud-seg s3" strokeDasharray="8 92" strokeDashoffset="-65" />
              <circle cx="21" cy="21" r="15.9" className="ud-seg s4" strokeDasharray="2 98" strokeDashoffset="-73" />
            </svg>
            <ul>{[['Standard', '68%', 's1'], ['Comfort', '22%', 's2'], ['XL', '8%', 's3'], ['Other', '2%', 's4']].map(([a, b, c]) => <li key={a}><i className={c} />{a}<b>{b}</b></li>)}</ul>
          </div>
        </div>
        <div className="ud-card ud-areas">
          <div className="ud-cardhead"><b>Top Areas</b></div>
          {[['Downtown', 29], ['Marina', 18], ['Business Bay', 18], ['Deira', 6]].map(([a, v]) => (
            <div key={a} className="ud-area"><span>{a}</span><span className="ud-track"><i className="ui-hbar" style={{ width: `${(v as number) * 2.6}%` }} /></span><b>{v}%</b></div>
          ))}
        </div>
      </div>
    </DeskShell>
  );
}

export function OperatorLive() {
  const trips = [['#48213', 'Samir K.', 'En route'], ['#48207', 'Ahmed R.', 'Arrived'], ['#48199', 'Omar T.', 'On trip'], ['#48192', 'Yusuf A.', 'Completed'], ['#48188', 'Karim B.', 'On trip']];
  return (
    <DeskShell active={1}>
      <div className="ud-live">
        <div className="ud-card ud-livemap"><div className="ud-cardhead"><b>Live operations</b><span className="ud-pill is-live">● 128 vehicles online</span></div><div className="ud-mapbox"><FleetMap big /></div></div>
        <div className="ud-card ud-trips">
          <div className="ud-cardhead"><b>Active trips</b></div>
          {trips.map(([id, d, s]) => <div key={id} className="ud-trip"><b>{id}</b><span>{d}</span><em className={`st-${s.split(' ')[0].toLowerCase()}`}>{s}</em></div>)}
        </div>
      </div>
    </DeskShell>
  );
}

export function OperatorReports() {
  const pts = [18, 24, 22, 30, 28, 36, 34, 42, 40, 48, 46, 55, 52, 60];
  const line = pts.map((v, i) => `${(i / (pts.length - 1)) * 100},${70 - v}`).join(' ');
  return (
    <DeskShell active={6}>
      <div className="ud-cardhead ud-pagehead"><b>Performance</b><span className="ud-pill">Last 28 days ⌄</span></div>
      <div className="ud-card ud-line">
        <svg viewBox="0 0 100 70" preserveAspectRatio="none" aria-hidden="true">
          <polygon points={`0,70 ${line} 100,70`} className="ud-area-fill" /><polyline points={line} className="ud-polyline" />
        </svg>
      </div>
      <div className="ud-card ud-table">
        <div className="ud-tr is-head"><span>Area</span><span>Rides</span><span>Revenue</span><span>Rating</span></div>
        {[['Downtown', '3,604', 'AED 82,520', '4.9'], ['Marina', '2,237', 'AED 51,220', '4.8'], ['Business Bay', '2,237', 'AED 49,860', '4.8'], ['Deira', '746', 'AED 15,940', '4.7']].map(r => (
          <div key={r[0]} className="ud-tr">{r.map((c, i) => <span key={i}>{c}</span>)}</div>
        ))}
      </div>
    </DeskShell>
  );
}

export const SCREENS: Record<string, () => ReactNode> = {
  'customer-booking': CustomerBooking, 'customer-select': CustomerSelect, 'customer-trip': CustomerTrip,
  'driver-pickup': DriverPickup, 'driver-request': DriverRequest, 'driver-earnings': DriverEarnings,
  'operator-dashboard': OperatorDashboard, 'operator-live': OperatorLive, 'operator-reports': OperatorReports,
};
