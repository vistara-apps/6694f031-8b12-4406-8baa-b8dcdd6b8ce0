'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="text-center max-w-md mx-auto p-6">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Something went wrong!
        </h2>
        <p className="text-text-secondary mb-6">
          We encountered an error while loading SampleSafe. Please try again.
        </p>
        <button
          onClick={reset}
          className="btn-primary"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
