import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
}
