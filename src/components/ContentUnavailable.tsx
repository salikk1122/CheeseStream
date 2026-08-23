interface ContentUnavailableProps {
  title?: string;
  message?: string;
}

export default function ContentUnavailable({
  title = 'Content unavailable',
  message = 'We could not load titles from TMDB right now. Check your internet connection and API keys, then refresh the page.',
}: ContentUnavailableProps) {
  return (
    <div className="mx-auto flex min-h-[40vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <p className="font-display text-2xl tracking-wide text-white">{title}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
        {message}
      </p>
      <a
        href="/"
        className="btn-primary mt-6 inline-flex"
      >
        Back to Home
      </a>
    </div>
  );
}
