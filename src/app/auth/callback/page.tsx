'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useAuthApi } from '@/hooks/useAuthApi';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { accessToken } = useAuthApi();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const next = searchParams.get('next') || '/profile';

        if (error) {
          setError(`Authentication error: ${error}`);
          setLoading(false);
          return;
        }

        if (code) {
          // Handle OAuth callback
          // The session should be automatically set by the server-side middleware
          // We just need to wait for the auth state to be updated

          // Wait for access token to be available
          let attempts = 0;
          const maxAttempts = 30; // 3 seconds max wait

          while (!accessToken && attempts < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            attempts++;
          }

          if (accessToken) {
            router.push(next);
          } else {
            setError('Authentication failed - no access token received');
            setLoading(false);
          }
        } else {
          // No code parameter, redirect to home
          router.push('/');
        }
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError('Authentication failed');
        setLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, router, accessToken]);

  if (loading) {
    return (
      <div className="container flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="text-lg">Completing authentication...</div>
          <div className="text-gray-500 text-sm">
            Please wait while we sign you in.
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Authentication Error
          </h1>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return null;
}
