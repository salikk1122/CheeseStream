import Link from 'next/link';
import CheeseIcon from './CheeseIcon';

interface LogoProps {
  className?: string;
  showIcon?: boolean;
}

export default function Logo({ className = '', showIcon = true }: LogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 ${className}`}
      aria-label="CheeseStream Home"
    >
      {showIcon && <CheeseIcon className="h-7 w-7 shrink-0" />}
      <span className="font-display text-2xl tracking-wide text-white">
        CheeseStream
      </span>
    </Link>
  );
}
