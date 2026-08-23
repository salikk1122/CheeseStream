export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-6xl text-accent">404</h1>
      <p className="mt-4 text-xl text-white">Page not found</p>
      <p className="mt-2 text-muted">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <a href="/" className="btn-primary mt-8">
        Back to Home
      </a>
    </div>
  );
}
