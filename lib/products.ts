/**
 * Platform in Action — product screenshots.
 * Add real AGEX screenshots to /public/screens/ and set `src` (e.g. '/screens/customer-booking.png').
 * Screens without `src` render a neutral wireframe placeholder (no data, no metrics).
 * Phone screens: portrait ~9:19.5. Operator screens: landscape 16:10.
 */
export type Screen = { label: string; src?: string; alt?: string };
export type Product = { key: string; name: string; tagline: string; icon: string; frame: 'phone' | 'laptop'; screens: Screen[] };

export const PRODUCTS: Product[] = [
  {
    key: 'customer', name: 'Customer App', tagline: 'Book, pay and move with ease.', icon: 'users', frame: 'phone',
    screens: [{ label: 'Booking' }, { label: 'Live tracking' }, { label: 'Payments' }],
  },
  {
    key: 'driver', name: 'Driver App', tagline: 'Everything for the road ahead.', icon: 'car', frame: 'phone',
    screens: [{ label: 'Job requests' }, { label: 'Navigation' }, { label: 'Earnings' }],
  },
  {
    key: 'operator', name: 'Operator Platform', tagline: 'Control, operate and grow.', icon: 'bars', frame: 'laptop',
    screens: [{ label: 'Dispatch' }, { label: 'Fleet management' }, { label: 'Operational reporting' }],
  },
];
