import { NextResponse } from 'next/server';

import { createSupabaseClient } from '@/lib/supabase';

export async function POST() {
  try {
    const supabase = createSupabaseClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Sign out error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Sign out API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
