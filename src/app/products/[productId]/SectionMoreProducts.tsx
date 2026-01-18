import React from 'react';

import { createClient as createServerSupabase } from '@/lib/supabase-server';

import ProductsCarousel from './ProductsCarousel';

type DbProduct = {
  id: string;
  amount: number;
  currency: string | null;
  description: string | null;
  main_image_url: string | null;
  available_colors: string[] | null;
  category: string | null;
  created_at: string;
};

interface SectionMoreProductsProps {
  category: string | null;
  currentProductId: string;
}

const SectionMoreProducts = async ({ category, currentProductId }: SectionMoreProductsProps) => {
  // If no category, hide the section
  if (!category) {
    return null;
  }

  const supabase = createServerSupabase();
  
  // Fetch products from the same category, excluding current product, sorted by newest first
  const { data: dbProducts } = await supabase
    .from('products')
    .select('id, amount, currency, description, main_image_url, available_colors, category, created_at')
    .eq('category', category)
    .neq('id', currentProductId)
    .order('created_at', { ascending: false })
    .limit(10);

  // Transform database products to the format expected by ProductCard
  const transformedProducts = (dbProducts || []).map((p: DbProduct) => ({
    slug: p.id,
    productName: p.description || 'Product',
    coverImage: p.main_image_url || '/preview.jpg',
    price: Number(p.amount || 0),
    currency: p.currency || 'USD',
    availableColors: p.available_colors || undefined,
  }));

  // If no related products, hide the section
  if (transformedProducts.length === 0) {
    return null;
  }

  return <ProductsCarousel products={transformedProducts} />;
};

export default SectionMoreProducts;
