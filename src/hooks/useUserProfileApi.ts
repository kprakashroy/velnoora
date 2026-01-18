import { useEffect, useState } from 'react';

import type { UserProfile, UserProfileUpdate } from '@/lib/database.types';

// Helper function to get access token from localStorage
function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem('supabase_access_token');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.expires_at && parsed.expires_at > Date.now()) {
        return parsed.access_token;
      }
    } catch {
      localStorage.removeItem('supabase_access_token');
    }
  }

  return null;
}

export function useUserProfileApi(userId?: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setProfile(null);
      return;
    }

    let isMounted = true;

    // Safety timeout - force loading to false after 10 seconds
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        console.warn('⚠️ Profile fetch timeout, forcing loading to false');
        setLoading(false);
      }
    }, 10000);

    const fetchProfile = async (isInitialLoad = false) => {
      try {
        console.log(
          '👤 Fetching profile for userId:',
          userId,
          isInitialLoad ? '(initial load)' : '(background refresh)',
        );

        if (isMounted) {
          // Only set loading to true for initial load, not background refreshes
          if (isInitialLoad) {
            setLoading(true);
          }
          setError(null);
        }

        const token = getAccessToken();
        if (!token) {
          throw new Error('No access token available');
        }

        const response = await fetch('/api/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch profile');
        }

        const { profile: profileData } = await response.json();

        console.log('✅ Profile fetched successfully');
        if (isMounted) {
          setProfile(profileData);
          // Store the fetch timestamp for cache management
          localStorage.setItem(
            `profile_fetch_${userId}`,
            Date.now().toString(),
          );
        }
      } catch (err: any) {
        console.error('Error in fetchProfile:', err);
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) {
          setLoading(false);
          clearTimeout(timeoutId);
        }
      }
    };

    fetchProfile(true); // Initial load

    // Listen for tab visibility changes - only refresh if profile is stale
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === 'visible' &&
        userId &&
        isMounted &&
        profile
      ) {
        console.log('👁️ Tab visible, checking if profile needs refresh...');
        // Only refetch if profile data is older than 5 minutes
        const lastFetch = localStorage.getItem(`profile_fetch_${userId}`);
        if (!lastFetch || Date.now() - parseInt(lastFetch) > 5 * 60 * 1000) {
          console.log('🔄 Profile is stale, refetching...');
          fetchProfile(false); // Background refresh
        } else {
          console.log('✅ Profile is fresh, no refetch needed');
        }
      }
    };

    // Listen for window focus - only refresh if profile is stale
    const handleFocus = () => {
      if (userId && isMounted && profile) {
        console.log('🎯 Window focused, checking if profile needs refresh...');
        // Only refetch if profile data is older than 5 minutes
        const lastFetch = localStorage.getItem(`profile_fetch_${userId}`);
        if (!lastFetch || Date.now() - parseInt(lastFetch) > 5 * 60 * 1000) {
          console.log('🔄 Profile is stale, refetching...');
          fetchProfile(false); // Background refresh
        } else {
          console.log('✅ Profile is fresh, no refetch needed');
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]); // Only depend on userId

  const updateProfile = async (updates: UserProfileUpdate) => {
    if (!userId) {
      throw new Error('User ID is required to update profile');
    }

    try {
      setError(null);

      const token = getAccessToken();
      if (!token) {
        throw new Error('No access token available');
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const { profile: updatedProfile } = await response.json();
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err: any) {
      console.error('Error in updateProfile:', err);
      setError(err.message);
      throw err;
    }
  };

  const createProfile = async (profileData: {
    id: string;
    email: string;
    name?: string;
  }) => {
    try {
      setError(null);

      const token = getAccessToken();
      if (!token) {
        throw new Error('No access token available');
      }

      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create profile');
      }

      const { profile: newProfile } = await response.json();
      setProfile(newProfile);
      return newProfile;
    } catch (err: any) {
      console.error('Error in createProfile:', err);
      setError(err.message);
      throw err;
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    createProfile,
    refetch: () => {
      if (userId) {
        // Don't set loading to true for manual refetch
        // Trigger useEffect to refetch
        setProfile(null);
      }
    },
  };
}
