export const site = {
  name: 'Ontario Accident Review',
  shortName: 'OAR',
  tagline: 'A simple first step for Ontario accident situations',
  description:
    'Find out whether your Ontario accident may be worth pursuing. Ontario Accident Review offers a simple, low-pressure first step for accident situations in Ontario.',
  url: 'https://www.ontarioaccidentreview.ca',
  ogImage: '/opengraph-image.png',
  navLinks: [
    { href: '/#how-it-works', label: 'How it works' },
    { href: '/#who-this-is-for', label: 'Who this is for' },
    { href: '/resources', label: 'Resources' },
    { href: '/#faq', label: 'FAQ' }
  ],
  trustItems: [
    'No insurance information required initially',
    'No document uploads in this first stage',
    'Ontario accident situations only',
    'No obligation created by submission'
  ]
};

export const formSteps = [
  { id: 1, label: 'Contact' },
  { id: 2, label: 'Accident basics' },
  { id: 3, label: 'Impact' },
  { id: 4, label: 'Current status' },
  { id: 5, label: 'Consent' }
];
