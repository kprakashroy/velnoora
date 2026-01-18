import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { createSupabaseClientWithToken } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Access token required' },
        { status: 401 },
      );
    }

    const accessToken = authHeader.substring(7);
    const supabase = createSupabaseClientWithToken(accessToken);

    // Get user from token
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');
    const categoryParam = searchParams.get('category');
    const limitNum = limitParam !== null ? parseInt(limitParam, 10) : undefined;
    const offsetNum =
      offsetParam !== null ? parseInt(offsetParam, 10) : undefined;

    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (categoryParam) {
      query = query.eq('category', categoryParam);
    }

    if (typeof limitNum === 'number' && !Number.isNaN(limitNum)) {
      query = query.limit(limitNum);
    }
    if (typeof offsetNum === 'number' && !Number.isNaN(offsetNum)) {
      const effectiveLimit =
        typeof limitNum === 'number' && !Number.isNaN(limitNum) ? limitNum : 10;
      query = query.range(offsetNum, offsetNum + effectiveLimit - 1);
    }

    const { data: products, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Access token required' },
        { status: 401 },
      );
    }

    const accessToken = authHeader.substring(7);
    const supabase = createSupabaseClientWithToken(accessToken);

    // Get user from token
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('admin')
      .eq('id', user.id)
      .single();

    if (!profile?.admin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 },
      );
    }

    const productData = await request.json();

    const { data: product, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ product });
  } catch (error: any) {
    console.error('Product creation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
