const base = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');

export interface NavLink {
  href: string;
  label: string;
}

export interface FooterContact {
  label: string;
  href: string;
}

export interface FooterMeta {
  title: string;
  description: string;
  contacts: FooterContact[];
}

export const siteNav: NavLink[] = [
  { label: 'Home', href: `${base}/` },
  { label: 'Philosophy', href: `${base}/philosophy/` },
  { label: 'Projects', href: `${base}/projects/` },
  { label: 'Resume', href: `${base}/resume/` },
  { label: 'Contact', href: `${base}/contact/` },
];

export const footerDirectory: NavLink[] = [...siteNav];

export const footerPolicies: string[] = [];

export const footerMeta: FooterMeta = {
  title: 'Peter Xie',
  description:
    'Gameplay Programmer with a focus on technical systems design, simulation, modular systems, and player-driven emergence. Specialising in grid systems, modular game architecture, deterministic simulations, and rhythm game judgement mechanics — in UE5 and Unity.',
  contacts: [
    { label: 'ruilinx.peter@gmail.com', href: 'mailto:ruilinx.peter@gmail.com' },
    { label: 'GitHub', href: 'https://github.com/MisakaRinOwO' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ruilin-xie-a926aa249/' },
  ],
};
