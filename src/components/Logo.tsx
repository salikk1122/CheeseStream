import Link from 'next/link';
import CheeseIcon from './CheeseIcon';

interface LogoProps {
  className?: string;
  showIcon?: boolean;
  /** When true, hides the wordmark and shows only the cheese icon */
  compact?: boolean;
}

export default function Logo({
  className = '',
  showIcon = true,
  compact = false,
}: LogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center overflow-hidden transition-all duration-300 ease-out ${
        compact ? 'gap-0' : 'gap-2'
      } ${className}`}
      aria-label="CheeseStream Home"
    >
      {showIcon && (
        <CheeseIcon
          className={`shrink-0 transition-all duration-300 ease-out ${
            compact ? 'h-9 w-9' : 'h-7 w-7'
          }`}
        />
      )}
      <span
        className={`font-display whitespace-nowrap tracking-wide text-white transition-all duration-300 ease-out text-xl sm:text-2xl ${
          compact
            ? 'max-w-0 translate-x-2 overflow-hidden opacity-0'
            : 'max-w-[12rem] translate-x-0 opacity-100'
        }`}
        aria-hidden={compact}
      >
        CheeseStream
      </span>
    </Link>
  );
}
