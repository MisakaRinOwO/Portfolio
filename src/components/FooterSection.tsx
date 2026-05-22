import { MotionConfig, motion, useInView } from 'framer-motion';
import { useRef } from 'react';

import type { FooterContact, FooterMeta, NavLink } from '../data/site';
import { aeonEase } from './motion';

interface FooterSectionProps {
  directory: NavLink[];
  meta: FooterMeta;
  policies: string[];
}

export default function FooterSection({ directory, meta, policies }: FooterSectionProps) {
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <MotionConfig reducedMotion="user">
      <motion.footer
        id="site-footer"
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.85, ease: aeonEase }}
        className="bg-footer-bg py-18 sm:py-22"
      >
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid gap-12 md:grid-cols-2 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,0.95fr)_minmax(0,0.8fr)]">
            <div className="max-w-2xl">
              <h2 className="font-display text-xl font-bold uppercase tracking-[0.12em] text-white">{meta.title}</h2>
              <p className="mt-5 max-w-xl text-[1.05rem] leading-8 text-white/58">{meta.description}</p>
            </div>

            <div>
              <h3 className="font-display text-[11px] uppercase tracking-[0.26em] text-white/80">Directory</h3>
              <ul className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                {directory.map((item) => (
                  <li key={item.label}>
                    <a className="text-[1.1rem] text-white/60 transition-colors duration-300 hover:text-accent-blue" href={item.href}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-display text-[11px] uppercase tracking-[0.26em] text-white/80">Contact</h3>
              <ul className="mt-6 space-y-4">
                {meta.contacts.map((contact: FooterContact) => (
                  <li key={contact.href}>
                    <a
                      className="text-[1.05rem] text-white/60 transition-colors duration-300 hover:text-accent-blue"
                      href={contact.href}
                      target={contact.href.startsWith('http') ? '_blank' : undefined}
                      rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {contact.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16 flex flex-col gap-6 border-t border-white/8 pt-8 text-[0.95rem] uppercase tracking-[0.08em] text-white/42 md:flex-row md:items-center md:justify-between">
            <p>© 2026 Peter Xie. All rights reserved.</p>
            <div className="flex flex-wrap gap-6">
              {policies.map((policy) => (
                <span key={policy}>{policy}</span>
              ))}
            </div>
          </div>
        </div>
      </motion.footer>
    </MotionConfig>
  );
}
