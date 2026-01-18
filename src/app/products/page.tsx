import React from 'react';

import { createClient as createServerSupabase } from '@/lib/supabase-server';

import ProductsDisplay from './ProductsDisplay';
import SectionProductsHeader from './SectionProductsHeader';

type DbProduct = {
  id: string;
  amount: number;
  currency: string | null;
  description: string | null;
  main_image_url: string | null;
  images: string[] | null;
  available_sizes: string[] | null;
  available_colors: string[] | null;
  category: string | null;
};

const page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const supabase = createServerSupabase();
  const { data: categoryRows } = await supabase
    .from('products')
    .select('category')
    .not('category', 'is', null)
    .order('category');

  const categories: string[] = Array.from(
    new Set((categoryRows || []).map((c: any) => c.category as string)),
  );
  const urlCategory =
    (typeof searchParams?.category === 'string'
      ? searchParams.category
      : undefined) || undefined;
  const selectedCategory = urlCategory ?? (categories[0] || '');

  const { data: dbProducts } = await supabase
    .from('products')
    .select(
      'id, amount, currency, description, main_image_url, images, available_sizes, available_colors, category',
    )
    .eq('category', selectedCategory)
    .order('created_at', { ascending: false });

  const merged = (dbProducts || []).map((p: DbProduct) => ({
    slug: p.id,
    productName: p.description || 'Product',
    coverImage: p.main_image_url || '/preview.jpg',
    price: Number(p.amount || 0),
    currency: p.currency || 'USD',
    availableColors: p.available_colors || undefined,
    availableSizes: p.available_sizes || undefined,
    category: p.category || undefined,
  }));

  // Extract unique sizes from all products
  const allSizes = new Set<string>();
  (dbProducts || []).forEach((p) => {
    if (p.available_sizes) {
      p.available_sizes.forEach((size: string) => allSizes.add(size));
    }
  });
  const availableSizes = Array.from(allSizes).sort();

  // Extract unique colors from all products
  // Colors are stored as hex codes in the database
  const allColors = new Set<string>();
  (dbProducts || []).forEach((p) => {
    if (p.available_colors && Array.isArray(p.available_colors)) {
      p.available_colors.forEach((color: string) => {
        if (color) {
          allColors.add(color);
        }
      });
    }
  });
  const availableColors = Array.from(allColors).sort();

  // Calculate price range from products
  const prices = merged.map((p) => p.price);
  const minPrice = prices.length > 0 ? Math.floor(Math.min(...prices)) : 0;
  const maxPrice = prices.length > 0 ? Math.ceil(Math.max(...prices)) : 500;
  const priceRange: [number, number] = [minPrice, maxPrice];

  return (
    <div className="container mb-20">
      <div className="mb-10">
        <SectionProductsHeader
          categories={categories}
          selectedCategory={selectedCategory}
        />
      </div>
      <ProductsDisplay
        initialProducts={merged}
        availableSizes={availableSizes}
        availableColors={availableColors}
        priceRange={priceRange}
      />
    </div>
  );
};

export default page;
