'use client';

import Link from 'next/link';
import React from 'react';

import UserProfile from '@/components/UserProfile';
import { useAuthApi } from '@/hooks/useAuthApi';
import { useUserProfileApi } from '@/hooks/useUserProfileApi';
import ButtonPrimary from '@/shared/Button/ButtonPrimary';

const ProfilePage = () => {
  const { user, loading: authLoading } = useAuthApi();
  const {
    profile,
    loading: profileLoading,
    error: profileError,
    refetch,
  } = useUserProfileApi(user?.id);

  // If auth resolved and we have a user but no profile yet, refetch profile once
  React.useEffect(() => {
    if (!authLoading && user?.id && !profile && !profileLoading) {
      console.log('🔄 Profile missing, triggering refetch...');
      refetch();
    }
  }, [authLoading, user?.id, profile, profileLoading, refetch]);

  // Safety timeout to prevent infinite loading
  React.useEffect(() => {
    if (authLoading || profileLoading) {
      const timeoutId = setTimeout(() => {
        console.warn('⚠️ Loading timeout reached, forcing state update');
        // This will trigger a re-render and hopefully resolve the loading state
      }, 8000); // 8 second timeout

      return () => clearTimeout(timeoutId);
    }
    return undefined; // Explicit return for all code paths
  }, [authLoading, profileLoading]);

  // Debug logging
  React.useEffect(() => {
    console.log('📄 Profile Page State:', {
      user: user?.email || 'null',
      userId: user?.id || 'null',
      authLoading,
      profileLoading,
      hasProfile: !!profile,
    });
  }, [user, authLoading, profileLoading, profile]);

  // Show loading state only for initial load, not for background refreshes
  if (authLoading || (profileLoading && !profile && user?.id)) {
    return (
      <div className="container mb-24 lg:mb-32">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="text-gray-500 mb-2">Loading...</div>
            <div className="text-gray-400 text-sm">
              {authLoading ? 'Authenticating...' : 'Loading profile...'}
            </div>
            <div className="text-gray-300 mt-2 text-xs">
              Debug: auth={authLoading ? 'loading' : 'done'}, profile=
              {profileLoading ? 'loading' : 'done'}, hasUser={!!user}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mb-24 lg:mb-32">
        <div className="py-20 text-center">
          <h1 className="text-gray-800 mb-4 text-3xl font-bold">
            Please Sign In
          </h1>
          <p className="text-gray-600 mb-8">
            You need to be signed in to view your profile.
          </p>
          <div className="space-x-4">
            <Link href="/login">
              <ButtonPrimary>Sign In</ButtonPrimary>
            </Link>
            <Link href="/signup">
              <ButtonPrimary>Sign Up</ButtonPrimary>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="container mb-24 lg:mb-32">
        <div className="py-20 text-center">
          <h1 className="mb-4 text-3xl font-bold text-red-600">
            Profile Error
          </h1>
          <p className="text-gray-600 mb-8">{profileError}</p>
          <div className="space-x-4">
            <Link href="/">
              <ButtonPrimary>Go Home</ButtonPrimary>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mb-24 lg:mb-32">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-center text-3xl font-bold">My Profile</h1>

        <UserProfile profile={profile} />

        <div className="mt-8 text-center">
          <Link href="/" className="text-primary hover:text-primary/80">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
