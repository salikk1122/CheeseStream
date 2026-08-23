interface CheeseIconProps {
  className?: string;
}

export default function CheeseIcon({ className = 'h-6 w-6' }: CheeseIconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4 24L16 4L28 24H4Z"
        fill="#F5C518"
        stroke="#E0B416"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="18" r="2" fill="#0b0b0d" opacity="0.5" />
      <circle cx="18" cy="14" r="1.5" fill="#0b0b0d" opacity="0.5" />
      <circle cx="22" cy="20" r="2.5" fill="#0b0b0d" opacity="0.5" />
      <circle cx="14" cy="22" r="1" fill="#0b0b0d" opacity="0.5" />
    </svg>
  );
}
