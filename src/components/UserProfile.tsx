'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { useAuthApi } from '@/hooks/useAuthApi';
import type { UserProfile as UserProfileType } from '@/lib/database.types';
import ButtonSecondary from '@/shared/Button/ButtonSecondary';
import type { UserProfile as AuthUserProfile } from '@/store/slices/authSlice';

interface UserProfileProps {
  profile?: UserProfileType | AuthUserProfile | null;
}

const UserProfile = ({ profile: propProfile }: UserProfileProps) => {
  const router = useRouter();
  const { userProfile, signOut, loading } = useAuthApi();

  // Use prop profile if provided, otherwise use hook profile
  const profile = propProfile || userProfile;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-md">
      <div className="text-center">
        <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-primary">
          <span className="text-2xl font-bold text-white">
            {profile.name?.charAt(0).toUpperCase() ||
              profile.email?.charAt(0).toUpperCase()}
          </span>
        </div>

        <h2 className="text-gray-800 mb-2 text-2xl font-bold">
          {profile.name || 'User'}
        </h2>

        <p className="text-gray-600 mb-4">{profile.email}</p>

        <div className="mb-6 space-y-2">
          {'emailVerified' in profile && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">Email Verified:</span>
              <span
                className={`text-sm font-medium ${profile.emailVerified ? 'text-green-600' : 'text-red-600'}`}
              >
                {profile.emailVerified ? '✅ Verified' : '❌ Not Verified'}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-sm">Member Since:</span>
            <span className="text-gray-700 text-sm">
              {new Date(
                'createdAt' in profile ? profile.createdAt : profile.created_at,
              ).toLocaleDateString()}
            </span>
          </div>
        </div>

        <ButtonSecondary onClick={handleSignOut} className="w-full">
          Sign Out
        </ButtonSecondary>
      </div>
    </div>
  );
};

export default UserProfile;
