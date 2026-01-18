import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import type { Database } from './database.types';

// Singleton instance to ensure we always use the same client
let supabaseInstance: ReturnType<typeof createServerClient<Database>> | null =
  null;

export function createSupabaseClient(): ReturnType<
  typeof createServerClient<Database>
> {
  // Return existing instance if available
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      'Missing Supabase environment variables. Please check your .env.local file.',
    );
    console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
    console.error(
      'NEXT_PUBLIC_SUPABASE_ANON_KEY:',
      supabaseAnonKey ? 'Set' : 'Missing',
    );
    throw new Error(
      'Missing Supabase environment variables. Please check your .env.local file.',
    );
  }

  const cookieStore = cookies();

  // Create singleton instance
  supabaseInstance = createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      db: {
        schema: 'app', // Use app schema instead of default public schema
      },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Enhanced cookie options for indefinite session persistence
              const enhancedOptions = {
                ...options,
                // Set secure cookies in production
                secure: process.env.NODE_ENV === 'production',
                // Use httpOnly for security (prevents XSS)
                httpOnly: true,
                // Set sameSite for CSRF protection
                sameSite: 'lax' as const,
                // Set indefinite expiration if not specified
                maxAge: options?.maxAge || 31536000 * 100, // 100 years
              };
              cookieStore.set(name, value, enhancedOptions);
            });
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );

  return supabaseInstance;
}

// Export function to reset the singleton (useful for testing)
export function resetSupabaseClient(): void {
  supabaseInstance = null;
}

// Helper function to create Supabase client with access token
export function createSupabaseClientWithToken(
  accessToken: string,
): ReturnType<typeof createServerClient<Database>> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    db: {
      schema: 'app',
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    cookies: {
      getAll() {
        return [];
      },
      setAll() {
        // No-op for token-based client
      },
    },
  });
}
