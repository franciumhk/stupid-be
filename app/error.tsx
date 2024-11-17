// app/error.tsx
'use client';

import Link from 'next/link';

export default function Error({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <div className="container-xxl py-5 wow fadeInUp" data-wow-delay="0.1s">
      <div className="container text-center">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <i className="bi bi-exclamation-triangle display-1 text-primary"></i>
            <h1 className="display-1">Error</h1>
            <h1 className="mb-4">Something went wrong!</h1>
            <p className="mb-4">
              We are sorry, but there was an error processing your request.
              Please try again or return to the homepage.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <button
                onClick={reset}
                className="btn btn-primary py-3 px-5"
              >
                Try Again
              </button>
              <Link 
                href="/" 
                className="btn btn-outline-primary py-3 px-5"
              >
                Go Back To Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
