/** Solution detail pages — copy from the "Website view revision" deck (slides 18–27). */
export type Line = { text: string; tone?: 'muted' | 'strong' };
export type Solution = {
  slug: 'ride-hailing' | 'delivery' | 'fleet';
  name: string;
  scene: 'ride' | 'delivery' | 'fleet';
  building: string; // contact form preset
  headerCta: string;
  meta: { title: string; description: string };
  hero: { label: string; title: Line[]; body: string[]; emphasis?: string; cta: string };
  opportunity: { label: string; title: Line[]; body: string[]; emphasis: string; after?: string[] };
  guidance: { label: string; title: Line[]; intro: string[]; questions: Array<{ icon: string; q: string }>; callout: string; calloutSub?: string[] };
  approach: { label: string; title: Line[]; sub: string; pillars: Array<{ icon: string; t: string; d: string }>; closing?: string };
  next: { label: string; title: Line[]; body: string[]; cta: string; note: string };
};

export const SOLUTIONS: Solution[] = [
  {
    slug: 'ride-hailing', name: 'Ride-hailing', scene: 'ride', building: 'Ride-hailing', headerCta: 'Start your mobility business',
    meta: { title: 'Ride-hailing', description: 'Launch your own ride-hailing business under your brand, in your market, powered by the AGEX engine.' },
    hero: {
      label: 'Ride-hailing',
      title: [{ text: 'You know your market.', tone: 'muted' }, { text: 'Why not lead its mobility future?' }],
      body: [
        'You know how people move in your city. You see what’s missing, what could work better, and where the opportunities are.',
        'Maybe you already have vehicles, drivers, customers or a transport business. Maybe you have the vision, the connections and the ambition to build something new.',
      ],
      emphasis: 'What if you could turn what you know, and what you already have, into your own ride-hailing business?',
      cta: 'Explore your opportunity',
    },
    opportunity: {
      label: 'The opportunity',
      title: [{ text: 'Why should the next big mobility brand in your market', tone: 'muted' }, { text: 'belong to someone else?' }],
      body: [
        'Global platforms have shown what’s possible. They have the technology, the experience and the scale.',
        'But you have something they need to work to build: local knowledge, relationships and an understanding of your market. And now, you don’t have to start from zero.',
      ],
      emphasis: 'You bring the local advantage. We help you turn it into a business.',
    },
    guidance: {
      label: 'Guidance',
      title: [{ text: 'Have the ambition,', tone: 'muted' }, { text: 'but not sure where to start?' }],
      intro: ['That’s exactly where AGEX comes in.'],
      questions: [
        { icon: 'bars', q: 'What business model makes sense for your market?' },
        { icon: 'database', q: 'How much could each trip earn?' },
        { icon: 'calculator', q: 'What will it cost to operate?' },
        { icon: 'users', q: 'How do you attract drivers, acquire customers and grow sustainably?' },
      ],
      callout: 'These are the questions that matter before launching an app. We work through them with you.',
      calloutSub: [
        'From business model design, unit economics and go-to-market strategy to the technology platform, configuration, deployment and ongoing technical operations.',
        'You don’t have to assemble all these pieces alone.',
      ],
    },
    approach: {
      label: 'Our approach',
      title: [{ text: 'Your business.', tone: 'muted' }, { text: 'Our expertise and engine.' }],
      sub: 'From strategy and economics to technology and deployment, we help you build and operate your ride-hailing business.',
      pillars: [
        { icon: 'target', t: 'Build the right business.', d: 'Shape your model, economics and launch strategy around your market.' },
        { icon: 'diamond', t: 'Launch under your brand.', d: 'Your customer app, driver app and operator platform, powered by AGEX.' },
        { icon: 'gear', t: 'Leave the technology complexity to us.', d: 'We handle the agreed platform deployment, hosting, maintenance and technical operations so you can focus on building the business.' },
        { icon: 'bars', t: 'Grow with confidence.', d: 'Develop your customers, drivers and local partnerships while we support the technology behind your operation.' },
      ],
    },
    next: {
      label: 'The next step',
      title: [{ text: 'What could you build', tone: 'muted' }, { text: 'in your market?' }],
      body: [
        'You don’t need to have everything figured out. You need a real opportunity, the ambition to pursue it and the right people beside you.',
        'Let’s discover what your mobility business could become.',
      ],
      cta: 'Let’s build your ride-hailing business',
      note: 'Tell us about your market, your existing operation or your idea. We’ll help you explore the opportunity.',
    },
  },
  {
    slug: 'delivery', name: 'Delivery', scene: 'delivery', building: 'Delivery', headerCta: 'Start your delivery business',
    meta: { title: 'Delivery', description: 'Build your own delivery business: your brand, your merchants, your customers, powered by the AGEX engine.' },
    hero: {
      label: 'Delivery',
      title: [{ text: 'You’re already moving goods.', tone: 'muted' }, { text: 'Why not own the delivery business?' }],
      body: [
        'You know your market. You know the merchants, the customers and what it takes to get things delivered.',
        'Maybe you already have drivers, vehicles or a logistics operation. But what if those same assets could power something bigger?',
      ],
      emphasis: 'Your own delivery service. Your brand. Your customers.',
      cta: 'Let’s build your delivery business',
    },
    opportunity: {
      label: 'The opportunity',
      title: [{ text: 'What if you could connect', tone: 'muted' }, { text: 'your entire local market?' }],
      body: [
        'Restaurants need to reach customers. Retailers need reliable delivery. People want convenience.',
        'You may already have the relationships and operational experience to bring them together. The opportunity isn’t just to deliver more orders.',
      ],
      emphasis: 'It’s to build the local delivery business that connects them.',
    },
    guidance: {
      label: 'Guidance',
      title: [{ text: 'Not sure how to make', tone: 'muted' }, { text: 'the economics work?' }],
      intro: ['That’s where AGEX comes in.'],
      questions: [
        { icon: 'bars', q: 'How should you price deliveries?' },
        { icon: 'database', q: 'What does each order cost?' },
        { icon: 'store', q: 'How do you attract merchants, manage drivers and grow without losing control of your margins?' },
      ],
      callout: 'We help you work through the business model, unit economics and launch strategy.',
      calloutSub: ['Then we bring the technology: delivery applications, dispatch, tracking, operational tools and ongoing technical services.'],
    },
    approach: {
      label: 'Our approach',
      title: [{ text: 'Your business.', tone: 'muted' }, { text: 'Our expertise and engine.' }],
      sub: 'From strategy and economics to technology and deployment, we help you build and operate your delivery business.',
      pillars: [
        { icon: 'target', t: 'Build the right business.', d: 'Shape your model, unit economics and launch strategy around your market.' },
        { icon: 'diamond', t: 'Launch under your brand.', d: 'Your customer app, driver app and merchant platform, powered by AGEX.' },
        { icon: 'gear', t: 'Leave the technology complexity to us.', d: 'We handle the platform deployment, hosting, maintenance and technical operations.' },
        { icon: 'bars', t: 'Grow with confidence.', d: 'Develop your merchants, customers and drivers while we support the technology behind your operation.' },
      ],
      closing: 'You build the business. We help you make it work.',
    },
    next: {
      label: 'The next step',
      title: [{ text: 'Your market is already moving.', tone: 'muted' }, { text: 'Make your move.' }],
      body: ['Turn your existing strengths and local opportunities into a delivery business built around your vision.'],
      cta: 'Let’s build your delivery business',
      note: 'Tell us about your market and what you want to build.',
    },
  },
  {
    slug: 'fleet', name: 'Fleet management', scene: 'fleet', building: 'Fleet management', headerCta: 'Start optimizing your fleet',
    meta: { title: 'Fleet management', description: 'Get more value from the fleet you already operate, with one fleet management platform and AGEX technical services.' },
    hero: {
      label: 'Fleet management',
      title: [{ text: 'You manage the fleet.', tone: 'muted' }, { text: 'But do you see its full potential?' }],
      body: [
        'Every vehicle in your business represents an investment. Every driver, trip, idle hour and operational decision affects your bottom line.',
        'You may already have the vehicles, the people and the demand.',
      ],
      emphasis: 'But how much more value could you create from the fleet you already operate?',
      cta: 'Explore your fleet’s potential',
    },
    opportunity: {
      label: 'The challenge',
      title: [{ text: 'What is your fleet', tone: 'muted' }, { text: 'really costing you?' }],
      body: [
        'Which vehicles are being used effectively? Where is capacity sitting idle? Are your operations becoming more expensive as your business grows?',
        'And most importantly, do you have the visibility to make the right decisions?',
      ],
      emphasis: 'You can’t improve what you can’t clearly see.',
      after: ['The opportunity isn’t simply to manage more vehicles. It’s to make every vehicle work smarter for your business.'],
    },
    guidance: {
      label: 'Guidance',
      title: [{ text: 'What if your fleet could', tone: 'muted' }, { text: 'become a stronger business asset?' }],
      intro: ['That’s where AGEX comes in.', 'We help you look at your fleet from a business perspective first.'],
      questions: [
        { icon: 'bars', q: 'How can you improve utilization?' },
        { icon: 'wallet', q: 'Where can you reduce unnecessary costs?' },
        { icon: 'target', q: 'What operating model makes sense as you expand?' },
      ],
      callout: 'We work with you to understand your operations, identify improvement opportunities and define the right approach.',
    },
    approach: {
      label: 'Our approach',
      title: [{ text: 'You focus on running the business.', tone: 'muted' }, { text: 'We help you get more from the fleet behind it.' }],
      sub: 'We bring the technology to connect vehicles, drivers and daily operations through one fleet management platform, supported by our technical services.',
      pillars: [
        { icon: 'bars', t: 'Increase utilization.', d: 'Make better use of your existing vehicles and drivers.' },
        { icon: 'database', t: 'Reduce operational costs.', d: 'Identify and remove avoidable costs across your operations.' },
        { icon: 'gear', t: 'Gain operational control.', d: 'Get real-time visibility across vehicles, drivers and daily activity.' },
        { icon: 'growth', t: 'Plan and grow with confidence.', d: 'Build the right operating model as your business expands.' },
      ],
    },
    next: {
      label: 'The next step',
      title: [{ text: 'Your fleet is already moving.', tone: 'muted' }, { text: 'Make every move count.' }],
      body: ['Turn better visibility, stronger operational control and smarter decisions into greater value from your existing assets.'],
      cta: 'Let’s optimize your fleet operations',
      note: 'Tell us about your fleet and what you want to improve.',
    },
  },
];

export const getSolution = (slug: string) => SOLUTIONS.find(s => s.slug === slug);
