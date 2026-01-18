import Link from 'next/link';
import React from 'react';

const AuthCodeError = () => {
  return (
    <div className="nc-PageAuthError" data-nc-id="PageAuthError">
      <div className="container mb-24 lg:mb-32">
        <div className="mx-auto max-w-md">
          <div className="text-center">
            <h2 className="my-20 text-3xl font-semibold leading-[115%] md:text-5xl md:leading-[115%]">
              Authentication Error
            </h2>
            <p className="mb-8 text-neutral-600">
              There was an error during authentication. Please try again.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-white transition-colors hover:bg-primary/90"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthCodeError;
