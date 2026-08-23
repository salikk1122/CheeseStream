import Link from 'next/link';
import { Github, Mail } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-white/10 bg-surface/50 px-4 py-10 pb-28 sm:mt-16 sm:py-12 md:px-8 md:pb-12 lg:px-12">
      <div className="mx-auto flex max-w-[1920px] flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-lg text-sm leading-relaxed text-muted sm:text-base">
            The website is under construction. The content will be available
            soon. Sorry for the inconvenience.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full p-2 text-muted transition-colors hover:bg-white/10 hover:text-white"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href="mailto:hello@cheesestream.app"
            className="rounded-full p-2 text-muted transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Contact"
          >
            <Mail className="h-5 w-5" />
          </a>
          <Link
            href="mailto:hello@cheesestream.app"
            className="text-sm text-muted transition-colors hover:text-accent"
          >
            Contact
          </Link>
        </div>
      </div>

      <p className="mx-auto mt-8 max-w-[1920px] text-center text-xs text-muted/60">
        &copy; {new Date().getFullYear()} CheeseStream
      </p>
    </footer>
  );
}
