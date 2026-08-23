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
  const searchActive = searchOpen || pathname.startsWith('/search');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setSearchOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Top bar */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 safe-top sm:px-4 sm:pt-4 md:px-8 md:pt-5 lg:px-12">
        <div className="pointer-events-auto flex items-center justify-between gap-2 sm:gap-4">
          <Logo
            compact={scrolled}
            className={`origin-left transition-all duration-300 ease-out ${
              scrolled ? 'scale-100 opacity-100' : 'scale-90 opacity-90'
            }`}
          />

          {/* Desktop / tablet: glass pill nav */}
          <nav
            className="glass-pill relative hidden max-w-none items-center gap-1 rounded-full px-2 py-1.5 md:flex"
            aria-label="Main"
          >
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
                <ul className="flex items-center gap-1">
                  {navLinks.map((link) => {
                    const active = isActive(pathname, link.href);
                    const Icon = link.icon;

                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-all duration-200 lg:px-4 ${
                            active
                              ? 'glass-pill-active'
                              : 'text-white/60 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          {active && (
                            <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                          )}
                          <span className="whitespace-nowrap">{link.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                <div
                  className="mx-2 h-5 w-px shrink-0 bg-white/20"
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

      {/* Mobile search sheet — sits above bottom nav */}
      {searchOpen && (
        <div className="pointer-events-auto fixed inset-x-3 bottom-[4.75rem] z-50 md:hidden safe-bottom">
          <div className="glass-pill flex items-center gap-2 rounded-2xl px-3 py-2.5">
            <SearchBar
              className="flex-1 [&_input]:rounded-full [&_input]:border-white/15 [&_input]:bg-black/30 [&_input]:py-2.5 [&_input]:text-sm [&_input]:backdrop-blur-md"
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
        </div>
      )}

      {/* Mobile bottom nav — includes Search */}
      <nav
        className="glass-pill pointer-events-auto fixed inset-x-3 bottom-3 z-50 flex items-center justify-around rounded-full px-1.5 py-2 safe-bottom md:hidden"
        aria-label="Mobile"
      >
        {navLinks.slice(0, 2).map((link) => {
          const active = isActive(pathname, link.href);
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-full px-1.5 py-1.5 text-[10px] font-medium transition-colors ${
                active
                  ? 'bg-white text-black'
                  : 'text-white/65 active:bg-white/10'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" strokeWidth={active ? 2.25 : 2} />
              <span className="truncate">{link.shortLabel}</span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={() => setSearchOpen((open) => !open)}
          className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-full px-1.5 py-1.5 text-[10px] font-medium transition-colors ${
            searchActive
              ? 'bg-white text-black'
              : 'text-white/65 active:bg-white/10'
          }`}
          aria-label="Search"
          aria-pressed={searchOpen}
        >
          <Search className="h-5 w-5 shrink-0" strokeWidth={searchActive ? 2.25 : 2} />
          <span className="truncate">Search</span>
        </button>

        {navLinks.slice(2).map((link) => {
          const active = isActive(pathname, link.href);
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-full px-1.5 py-1.5 text-[10px] font-medium transition-colors ${
                active
                  ? 'bg-white text-black'
                  : 'text-white/65 active:bg-white/10'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" strokeWidth={active ? 2.25 : 2} />
              <span className="truncate">{link.shortLabel}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
