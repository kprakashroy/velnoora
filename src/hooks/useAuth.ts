import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { useEffect, useRef } from 'react';

import { createClient, resetSupabaseClient } from '@/lib/supabase-client';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  clearAuth,
  setAuthState,
  setLoading,
  setUserProfile,
  type UserProfile,
} from '@/store/slices/authSlice';

interface UseAuthReturn {
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
}

export function useAuth(): UseAuthReturn {
  const dispatch = useAppDispatch();
  const { user, userProfile, loading, error } = useAppSelector(
    (state) => state.auth,
  );
  const supabase = createClient();
  const hasInitialized = useRef(false);

  // Helper function to load user profile
  const loadUserProfile = async (userId: string) => {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    return profile;
  };

  // Helper function to sync auth state with session
  const syncAuthState = async (session: Session) => {
    console.log('🔄 Syncing auth state for:', session.user.email);

    // Dispatch immediately with best-effort profile from auth metadata to unblock loading
    const optimisticProfile: UserProfile = {
      id: session.user.id,
      email: session.user.email!,
      name:
        session.user.user_metadata?.full_name ||
        session.user.user_metadata?.name ||
        session.user.email?.split('@')[0],
      avatar: session.user.user_metadata?.avatar_url,
      admin: false,
      emailVerified: !!session.user.email_confirmed_at,
      createdAt: session.user.created_at!,
    };

    dispatch(
      setAuthState({
        user: session.user,
        userProfile: optimisticProfile,
      }),
    );

    // Store sync timestamp for cache management
    localStorage.setItem(`auth_sync_${session.user.id}`, Date.now().toString());

    // Then try to hydrate from DB profile without blocking the UI
    try {
      const profile = await loadUserProfile(session.user.id);
      if (profile) {
        const hydratedProfile: UserProfile = {
          id: session.user.id,
          email: session.user.email!,
          name: profile?.name || optimisticProfile.name,
          avatar: profile?.avatar_url || optimisticProfile.avatar,
          admin: profile?.admin || false,
          emailVerified: optimisticProfile.emailVerified,
          createdAt: optimisticProfile.createdAt,
        };
        dispatch(setUserProfile(hydratedProfile));
      }
    } catch (e) {
      // Non-fatal; keep optimistic profile
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
    console.log('🚀 Auth system initializing...');

    // Check for existing session
    const checkSession = async () => {
      try {
        console.log('🔍 Checking for existing session...');
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (sessionError) {
          console.error('❌ Session error:', sessionError);
          dispatch(setLoading(false));
          sessionChecked = true;
          return;
        }

        if (session) {
          console.log('✅ Session found:', session.user.email);
          console.log(
            '📅 Expires:',
            new Date(session.expires_at! * 1000).toLocaleString(),
          );

          await syncAuthState(session);
          dispatch(setLoading(false)); // Ensure loading is set to false after sync
          sessionChecked = true;
        } else {
          console.log('ℹ️ No session found');
          dispatch(setLoading(false));
          sessionChecked = true;
        }
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
    }, 5000); // Reduced from 10 seconds to 5 seconds

    checkSession();

    // Listen for auth state changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        console.log(
          '🔐 Auth event:',
          event,
          session?.user?.email || 'No session',
        );

        if (!mounted) return;

        if (event === 'SIGNED_OUT') {
          console.log('👋 User signed out');
          dispatch(clearAuth());
          return;
        }

        if (session) {
          console.log(
            '📅 Session expires:',
            new Date(session.expires_at! * 1000).toLocaleString(),
          );
          await syncAuthState(session);
        }
      },
    );

    // Handle tab visibility - only sync if session is stale
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && mounted) {
        console.log('👁️ Tab visible - checking if session needs refresh...');
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          // Only sync if user data is stale (older than 5 minutes)
          const lastSync = localStorage.getItem(`auth_sync_${session.user.id}`);
          if (!lastSync || Date.now() - parseInt(lastSync) > 5 * 60 * 1000) {
            console.log('🔄 Session data is stale, syncing...');
            await syncAuthState(session);
            localStorage.setItem(
              `auth_sync_${session.user.id}`,
              Date.now().toString(),
            );
          } else {
            console.log('✅ Session data is fresh, no sync needed');
          }
        }
      }
    };

    // Handle window focus - only sync if session is stale
    const handleFocus = async () => {
      if (mounted) {
        console.log('🎯 Window focused - checking if session needs refresh...');
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          // Only sync if user data is stale (older than 5 minutes)
          const lastSync = localStorage.getItem(`auth_sync_${session.user.id}`);
          if (!lastSync || Date.now() - parseInt(lastSync) > 5 * 60 * 1000) {
            console.log('🔄 Session data is stale, syncing...');
            await syncAuthState(session);
            localStorage.setItem(
              `auth_sync_${session.user.id}`,
              Date.now().toString(),
            );
          } else {
            console.log('✅ Session data is fresh, no sync needed');
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    // Keep session alive with periodic refresh
    const keepAliveInterval = setInterval(
      async () => {
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();

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
              const { data, error } = await supabase.auth.refreshSession();
              if (error) {
                console.error('❌ Refresh failed:', error);
              } else if (data.session) {
                console.log('✅ Session refreshed successfully');
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
      subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      // Allow re-initialization after StrictMode intentional unmount/mount cycle
      hasInitialized.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/profile`,
        },
      });

      if (error) {
        console.error('❌ Google sign-in error:', error);
        throw error;
      }

      console.log('✅ Google sign-in initiated');
    } catch (err: any) {
      console.error('❌ Google sign-in failed:', err);
      throw err;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Email sign-in error:', error);
        throw error;
      }

      console.log('✅ Email sign-in successful:', data.user?.email);
      return data;
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: name,
            name,
          },
        },
      });

      if (error) {
        console.error('❌ Email sign-up error:', error);
        throw error;
      }

      console.log('✅ Email sign-up successful:', data.user?.email);

      // Ensure profile is created
      if (data.user) {
        try {
          const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            console.warn('⚠️ Profile not found, creating...');

            const { error: insertError } = await supabase
              .from('user_profiles')
              .insert({
                id: data.user.id,
                email: data.user.email || email,
                name: name || null,
              });

            if (insertError) {
              console.error('❌ Failed to create profile:', insertError);
            } else {
              console.log('✅ Profile created');
            }
          } else if (profile) {
            console.log('✅ Profile exists');
          }
        } catch (profileErr) {
          console.error('❌ Profile creation error:', profileErr);
        }
      }

      return data;
    } catch (err: any) {
      console.error('❌ Email sign-up failed:', err);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Sign-out error:', error);
        throw error;
      }

      console.log('✅ Sign-out successful');

      // Clear Redux state
      dispatch(clearAuth());

      // Reset Supabase client
      resetSupabaseClient();

      // Clear all localStorage items
      if (typeof window !== 'undefined') {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('sb-')) {
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

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('❌ Password reset error:', error);
        throw error;
      }

      console.log('✅ Password reset email sent');
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
  };
}
