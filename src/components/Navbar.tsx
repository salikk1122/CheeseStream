'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Clapperboard,
  Home,
  List,
  Search,
  Settings,
  Tv,
  X,
} from 'lucide-react';
import Logo from './Logo';
import SearchBar from './SearchBar';

const navLinks = [
  { href: '/', label: 'Home', shortLabel: 'Home', icon: Home },
  { href: '/movies', label: 'Movies', shortLabel: 'Movies', icon: Clapperboard },
  { href: '/shows', label: 'Shows', shortLabel: 'Shows', icon: Tv },
  { href: '/my-list', label: 'My List', shortLabel: 'List', icon: List },
] as const;

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8 md:pt-5 lg:px-12">
      <div className="pointer-events-auto flex items-start justify-between gap-4">
        <Logo
          compact={scrolled}
          className={`origin-left transition-all duration-300 ease-out ${
            scrolled ? 'scale-100 opacity-100' : 'scale-90 opacity-90'
          }`}
        />

        <nav
          className="glass-pill relative flex max-w-[calc(100vw-2rem)] shrink-0 items-center gap-0.5 overflow-x-auto rounded-full px-1.5 py-1.5 scrollbar-hide sm:max-w-none sm:gap-1 sm:px-2"
          aria-label="Main"
        >
        {/* Top-edge shine */}
        <div
          className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
          aria-hidden="true"
        />

        {searchOpen ? (
          <div className="flex w-[min(90vw,22rem)] items-center gap-2 px-1">
            <SearchBar
              className="flex-1 [&_input]:rounded-full [&_input]:border-white/20 [&_input]:bg-white/5 [&_input]:backdrop-blur-md"
              onClose={() => setSearchOpen(false)}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="glass-icon-btn shrink-0 rounded-full p-2"
              aria-label="Close search"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <ul className="flex items-center gap-0.5 sm:gap-1">
              {navLinks.map((link) => {
                const active = isActive(pathname, link.href);
                const Icon = link.icon;

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-2 text-xs font-medium transition-all duration-200 sm:px-4 sm:text-sm ${
                        active
                          ? 'glass-pill-active'
                          : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {active && (
                        <Icon className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" strokeWidth={2} />
                      )}
                      <span className="whitespace-nowrap sm:hidden">
                        {link.shortLabel}
                      </span>
                      <span className="hidden whitespace-nowrap sm:inline">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div
              className="mx-1 h-5 w-px shrink-0 bg-white/20 sm:mx-2"
              aria-hidden="true"
            />

            <div className="flex shrink-0 items-center gap-0.5 pr-0.5">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="glass-icon-btn rounded-full p-2"
                aria-label="Open search"
              >
                <Search className="h-4 w-4" strokeWidth={2} />
              </button>
              <button
                type="button"
                className="glass-icon-btn rounded-full p-2"
                aria-label="Settings"
              >
                <Settings className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          </>
        )}
        </nav>
      </div>
    </header>
  );
}
