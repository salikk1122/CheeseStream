'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="font-display text-3xl tracking-wide text-white">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted">
        {error.message.includes('TMDB')
          ? 'We could not reach TMDB. Check your internet connection and API keys, then try again.'
          : 'An unexpected error occurred. Please try again.'}
      </p>
      <button
        type="button"
        onClick={reset}
        className="btn-primary mt-6"
      >
        Try again
      </button>
    </div>
  );
}
