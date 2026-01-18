import { useEffect, useState } from 'react';

import type { UserProfile, UserProfileUpdate } from '@/lib/database.types';
import { createClient } from '@/lib/supabase-client';

export function useUserProfile(userId?: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

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

        const { data, error: fetchError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            // Profile doesn't exist, try to create it
            console.log('Profile not found, attempting to create one...');

            // Get user info from auth
            const {
              data: { user },
              error: userError,
            } = await supabase.auth.getUser();

            if (userError || !user) {
              console.error('Error getting user info:', userError);
              setError('User not found');
              return;
            }

            // Create profile
            const { data: newProfile, error: createError } = await supabase
              .from('user_profiles')
              .insert({
                id: user.id,
                email: user.email || '',
                name:
                  user.user_metadata?.full_name ||
                  user.user_metadata?.name ||
                  null,
              })
              .select()
              .single();

            if (createError) {
              console.error('Error creating profile:', createError);
              if (isMounted) setError(createError.message);
            } else {
              console.log('✅ Profile created successfully:', newProfile);
              if (isMounted) {
                setProfile(newProfile);
                // Store the fetch timestamp for cache management
                localStorage.setItem(
                  `profile_fetch_${userId}`,
                  Date.now().toString(),
                );
              }
            }
          } else {
            console.error('Error fetching profile:', fetchError);
            if (isMounted) setError(fetchError.message);
          }
        } else {
          console.log('✅ Profile fetched successfully');
          if (isMounted) {
            setProfile(data);
            // Store the fetch timestamp for cache management
            localStorage.setItem(
              `profile_fetch_${userId}`,
              Date.now().toString(),
            );
          }
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
  }, [userId]); // Only depend on userId, not supabase client

  const updateProfile = async (updates: UserProfileUpdate) => {
    if (!userId) {
      throw new Error('User ID is required to update profile');
    }

    try {
      setError(null);

      const { data, error: updateError } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating profile:', updateError);
        throw updateError;
      }

      setProfile(data);
      return data;
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

      const { data, error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          id: profileData.id,
          email: profileData.email,
          name: profileData.name || null,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating profile:', insertError);
        throw insertError;
      }

      setProfile(data);
      return data;
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
