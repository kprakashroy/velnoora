import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from './database.types';

// Singleton instance to ensure we always use the same client
let supabaseInstance: SupabaseClient<Database, 'app', 'app'> | null = null;

export function createClient(): SupabaseClient<Database, 'app', 'app'> {
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

  // Create singleton instance with proper cookie and auth configuration
  supabaseInstance = createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      db: {
        schema: 'app', // Use app schema instead of default public schema
      },
      cookies: {
        getAll() {
          if (typeof document === 'undefined') {
            // Running in a server environment; no document cookies available
            return [];
          }
          return document.cookie
            .split('; ')
            .filter((x) => x.length > 0)
            .map((x) => {
              const [name, ...rest] = x.split('=');
              return { name: name || '', value: rest.join('=') };
            })
            .filter((x) => x.name.length > 0); // Filter out any empty names
        },
        setAll(cookiesToSet) {
          if (typeof document === 'undefined') {
            // No-op on the server; middleware/server helpers handle auth cookies there
            return;
          }
          cookiesToSet.forEach(({ name, value, options }) => {
            if (!name) return; // Skip if no name

            let cookie = `${name}=${value}`;

            // Set cookie with indefinite persistence (no max-age for session cookies)
            // Use expires for indefinite cookies (far future date)
            if (options?.maxAge) {
              cookie += `; max-age=${options.maxAge}`;
            } else {
              // Set to year 2100 for indefinite persistence
              cookie += `; expires=Fri, 31 Dec 2100 23:59:59 GMT`;
            }
            cookie += `; path=${options?.path || '/'}`;
            cookie += `; samesite=${options?.sameSite || 'lax'}`;

            if (options?.domain) {
              cookie += `; domain=${options.domain}`;
            }

            // Only set secure in production (HTTPS)
            const isHttps =
              typeof window !== 'undefined' &&
              window.location.protocol === 'https:';
            if (options?.secure || isHttps) {
              cookie += '; secure';
            }

            document.cookie = cookie;
          });
        },
      },
      auth: {
        persistSession: true, // Persist session in cookies/localStorage
        autoRefreshToken: true, // Automatically refresh tokens
        detectSessionInUrl: true, // Detect session from OAuth redirects
        flowType: 'pkce', // Use PKCE flow for better security
        storage:
          typeof window !== 'undefined' ? window.localStorage : undefined,
        // Additional settings for indefinite session persistence
        debug: process.env.NODE_ENV === 'development', // Enable debug in development
      },
      global: {
        headers: {
          'X-Client-Info': 'supabase-js-web',
        },
      },
    },
  );

  return supabaseInstance;
}

// Export function to reset the singleton (useful for testing or logout)
export function resetSupabaseClient(): void {
  supabaseInstance = null;
}
