import type { Session, User } from '@supabase/supabase-js';
import { useEffect, useRef, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  clearAuth,
  setAuthState,
  setLoading,
  setUserProfile,
  type UserProfile,
} from '@/store/slices/authSlice';

interface UseAuthApiReturn {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<any>;
  signUpWithEmail: (
    email: string,
    password: string,
    name?: string,
  ) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  accessToken: string | null;
}

// Helper function to get access token from localStorage
function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;

  // Try to get from localStorage first
  const stored = localStorage.getItem('supabase_access_token');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.expires_at && parsed.expires_at > Date.now()) {
        return parsed.access_token;
      }
    } catch {
      // Invalid stored token, remove it
      localStorage.removeItem('supabase_access_token');
    }
  }

  return null;
}

// Helper function to store access token
function storeAccessToken(session: Session) {
  if (typeof window === 'undefined') return;

  const tokenData = {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: session.expires_at! * 1000, // Convert to milliseconds
  };

  localStorage.setItem('supabase_access_token', JSON.stringify(tokenData));
}

// Helper function to clear access token
function clearAccessToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('supabase_access_token');
}

// (Removed unused apiCall helper)

export function useAuthApi(): UseAuthApiReturn {
  const dispatch = useAppDispatch();
  const { user, userProfile, loading, error } = useAppSelector(
    (state) => state.auth,
  );
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const hasInitialized = useRef(false);

  // Helper function to load user profile via API
  const loadUserProfile = async (token: string) => {
    try {
      const response = await fetch('/api/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const { profile } = await response.json();
      return profile;
    } catch (error) {
      console.error('Error loading profile:', error);
      return null;
    }
  };

  // Helper function to sync auth state with session
  const syncAuthState = async (session: Session) => {
    console.log('🔄 Syncing auth state for:', session.user.email);

    // Store the access token
    storeAccessToken(session);
    setAccessToken(session.access_token);

    // Dispatch immediately with user but no profile to indicate loading
    dispatch(
      setAuthState({
        user: session.user,
        userProfile: null, // Set to null to indicate profile is loading
      }),
    );

    // Store sync timestamp for cache management
    localStorage.setItem(`auth_sync_${session.user.id}`, Date.now().toString());

    // Then try to hydrate from API profile without blocking the UI
    try {
      const profile = await loadUserProfile(session.access_token);
      if (profile) {
        const hydratedProfile: UserProfile = {
          id: session.user.id,
          email: session.user.email!,
          name:
            profile?.name ||
            session.user.user_metadata?.full_name ||
            session.user.user_metadata?.name ||
            session.user.email?.split('@')[0],
          avatar: profile?.avatar_url || session.user.user_metadata?.avatar_url,
          admin: profile?.admin || false,
          emailVerified: !!session.user.email_confirmed_at,
          createdAt: session.user.created_at!,
        };
        dispatch(setUserProfile(hydratedProfile));
      }
    } catch (e) {
      // Non-fatal; profile will remain null
      console.error('Failed to load user profile:', e);
    }
  };

  useEffect(() => {
    // Prevent duplicate init within the same mount, but allow re-init after StrictMode cleanup
    if (hasInitialized.current) {
      return;
    }
    hasInitialized.current = true;

    let mounted = true;
    let sessionChecked = false;
    console.log('🚀 Auth API system initializing...');

    // Check for existing session via API
    const checkSession = async () => {
      try {
        console.log('🔍 Checking for existing session...');

        // First check if we have a stored token
        const storedToken = getAccessToken();
        if (storedToken) {
          setAccessToken(storedToken);

          // Verify the token is still valid by making an API call
          try {
            const response = await fetch('/api/auth/session', {
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
            });

            if (response.ok) {
              const { session } = await response.json();
              if (session) {
                console.log('✅ Valid session found:', session.user.email);
                await syncAuthState(session);
                dispatch(setLoading(false));
                sessionChecked = true;
                return;
              }
            }
          } catch (error) {
            console.error('❌ Token validation failed:', error);
            clearAccessToken();
            setAccessToken(null);
          }
        }

        if (!mounted) return;

        console.log('ℹ️ No valid session found');
        dispatch(setLoading(false));
        sessionChecked = true;
      } catch (err: any) {
        console.error('❌ Error checking session:', err);
        if (mounted) {
          dispatch(setLoading(false));
          sessionChecked = true;
        }
      }
    };

    // Safety timeout - only trigger if session check hasn't completed
    const timeoutId = setTimeout(() => {
      if (mounted && !sessionChecked) {
        console.log('⏱️ Safety timeout - forcing loading to false');
        dispatch(setLoading(false));
        sessionChecked = true;
      }
    }, 5000);

    checkSession();

    // Handle tab visibility - only sync if session is stale
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && mounted && accessToken) {
        console.log('👁️ Tab visible - checking if session needs refresh...');
        const lastSync = localStorage.getItem(`auth_sync_${user?.id}`);
        if (!lastSync || Date.now() - parseInt(lastSync) > 5 * 60 * 1000) {
          console.log('🔄 Session data is stale, syncing...');
          try {
            const response = await fetch('/api/auth/session', {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
            if (response.ok) {
              const { session } = await response.json();
              if (session) {
                await syncAuthState(session);
              }
            }
          } catch (error) {
            console.error('Error refreshing session:', error);
          }
        } else {
          console.log('✅ Session data is fresh, no sync needed');
        }
      }
    };

    // Handle window focus - only sync if session is stale
    const handleFocus = async () => {
      if (mounted && accessToken) {
        console.log('🎯 Window focused - checking if session needs refresh...');
        const lastSync = localStorage.getItem(`auth_sync_${user?.id}`);
        if (!lastSync || Date.now() - parseInt(lastSync) > 5 * 60 * 1000) {
          console.log('🔄 Session data is stale, syncing...');
          try {
            const response = await fetch('/api/auth/session', {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
            if (response.ok) {
              const { session } = await response.json();
              if (session) {
                await syncAuthState(session);
              }
            }
          } catch (error) {
            console.error('Error refreshing session:', error);
          }
        } else {
          console.log('✅ Session data is fresh, no sync needed');
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    // Keep session alive with periodic refresh
    const keepAliveInterval = setInterval(
      async () => {
        try {
          if (accessToken) {
            const response = await fetch('/api/auth/session', {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });

            if (response.ok) {
              const { session } = await response.json();
              if (session) {
                const expiresAt = session.expires_at!;
                const now = Math.floor(Date.now() / 1000);
                const minutesUntilExpiry = Math.floor((expiresAt - now) / 60);

                console.log(
                  `⏰ Session check - expires in ${minutesUntilExpiry} minutes`,
                );

                // Refresh if expires in less than 10 minutes
                if (minutesUntilExpiry < 10) {
                  console.log('🔄 Refreshing session...');
                  // The session refresh is handled by the server-side middleware
                  await syncAuthState(session);
                }
              }
            }
          }
        } catch (err) {
          console.error('❌ Keep-alive error:', err);
        }
      },
      5 * 60 * 1000,
    ); // Every 5 minutes

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      clearInterval(keepAliveInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      // Allow re-initialization after StrictMode intentional unmount/mount cycle
      hasInitialized.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, accessToken]);

  const signInWithGoogle = async () => {
    try {
      const response = await fetch('/api/auth/oauth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: 'google',
          redirectTo: `${window.location.origin}/auth/callback?next=/profile`,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err: any) {
      console.error('❌ Google sign-in failed:', err);
      throw err;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      const { user: userData, session } = await response.json();

      if (session) {
        await syncAuthState(session);
      }

      console.log('✅ Email sign-in successful:', userData?.email);
      return { user: userData, session };
    } catch (err: any) {
      console.error('❌ Email sign-in failed:', err);
      throw err;
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    name?: string,
  ) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      const { user: userData, session } = await response.json();

      if (session) {
        await syncAuthState(session);
      }

      console.log('✅ Email sign-up successful:', userData?.email);
      return { user: userData, session };
    } catch (err: any) {
      console.error('❌ Email sign-up failed:', err);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      console.log('✅ Sign-out successful');

      // Clear Redux state
      dispatch(clearAuth());

      // Clear access token
      clearAccessToken();
      setAccessToken(null);

      // Clear all localStorage items
      if (typeof window !== 'undefined') {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (
            key &&
            (key.startsWith('sb-') ||
              key.startsWith('auth_sync_') ||
              key.startsWith('profile_fetch_'))
          ) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((key) => localStorage.removeItem(key));
        console.log('🧹 Cleared storage');
      }
    } catch (err: any) {
      console.error('❌ Sign-out failed:', err);
      throw err;
    }
  };

  const resetPassword = async () => {
    try {
      // This would need to be implemented as an API route
      // For now, we'll throw an error indicating it's not implemented
      throw new Error('Password reset not implemented in API mode');
    } catch (err: any) {
      console.error('❌ Password reset failed:', err);
      throw err;
    }
  };

  return {
    user,
    userProfile,
    loading,
    error,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    resetPassword,
    accessToken,
  };
}
