/**
 * Platform in action — product screens.
 * Each screen renders a recreated interface (`ui`, see components/platform/Screens.tsx) unless a real
 * screenshot is supplied via `src` (put files in /public/screens/, e.g. '/screens/customer-booking.png').
 * Phone screenshots: portrait ~9:19.5. Operator screenshots: landscape 16:10.
 */
export type Screen = { label: string; ui: string; src?: string; alt?: string };
export type Product = { key: string; name: string; tagline: string; icon: string; frame: 'phone' | 'laptop'; screens: Screen[] };

export const PRODUCTS: Product[] = [
  {
    key: 'customer', name: 'Customer App', tagline: 'Book, pay and move with ease.', icon: 'user', frame: 'phone',
    screens: [
      { label: 'Booking', ui: 'customer-booking' },
      { label: 'Ride options', ui: 'customer-select' },
      { label: 'Live trip', ui: 'customer-trip' },
    ],
  },
  {
    key: 'driver', name: 'Driver App', tagline: 'Everything for the road ahead.', icon: 'car', frame: 'phone',
    screens: [
      { label: 'Navigation', ui: 'driver-pickup' },
      { label: 'Job requests', ui: 'driver-request' },
      { label: 'Earnings', ui: 'driver-earnings' },
    ],
  },
  {
    key: 'operator', name: 'Operator Platform', tagline: 'Control, operate and grow.', icon: 'bars', frame: 'laptop',
    screens: [
      { label: 'Dashboard', ui: 'operator-dashboard' },
      { label: 'Live operations', ui: 'operator-live' },
      { label: 'Reporting', ui: 'operator-reports' },
    ],
  },
];
