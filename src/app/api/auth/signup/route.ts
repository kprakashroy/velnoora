import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { createSupabaseClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 },
      );
    }

    const supabase = createSupabaseClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
        data: {
          full_name: name,
          name,
        },
      },
    });

    if (error) {
      console.error('Sign up error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

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

    return NextResponse.json({
      user: data.user,
      session: data.session,
    });
  } catch (error: any) {
    console.error('Sign up API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
