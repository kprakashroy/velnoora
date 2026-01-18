import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: {
        schema: 'app',
      },
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // Refresh session if expired - required for Server Components
  // This will automatically refresh the token if it's about to expire
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error('Middleware session error:', error);
    // If there's a session error, try to refresh the session
    try {
      const {
        data: { session: refreshedSession },
        error: refreshError,
      } = await supabase.auth.refreshSession();
      if (refreshError) {
        console.error('Middleware refresh error:', refreshError);
      } else if (refreshedSession) {
        console.log(
          'Middleware: Session successfully refreshed for user:',
          refreshedSession.user.email,
        );
      }
    } catch (refreshErr) {
      console.error('Middleware refresh attempt failed:', refreshErr);
    }
  }

  if (session) {
    console.log('Middleware: Active session for user:', session.user.email);

    // Check if token is close to expiry (within 5 minutes) and refresh proactively
    const tokenExpiry = new Date(session.expires_at! * 1000);
    const now = new Date();
    const timeUntilExpiry = tokenExpiry.getTime() - now.getTime();

    if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
      // Less than 5 minutes
      console.log('Middleware: Proactively refreshing token that expires soon');
      try {
        await supabase.auth.refreshSession();
      } catch (refreshErr) {
        console.error('Middleware proactive refresh failed:', refreshErr);
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
