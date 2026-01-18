'use client';

import React, { useEffect, useMemo, useState } from 'react';

import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/lib/api-client';

type ProductItem = {
  slug: string;
  productName: string;
  coverImage: string;
  price: number;
  currency?: string;
  availableColors?: string[] | null;
  category?: string | null;
};

interface Props {
  categories: string[];
  initialCategory: string;
  initialProducts: ProductItem[];
}

const ProductsBrowser = ({
  categories,
  initialCategory,
  initialProducts,
}: Props) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || '',
  );
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      (!selectedCategory || selectedCategory === '') &&
      categories.length > 0
    ) {
      setSelectedCategory(categories[0] as string);
    }
  }, [categories, selectedCategory]);

  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      if (!selectedCategory) return;
      setLoading(true);
      try {
        const { products: apiProducts } = await getProducts(
          undefined,
          undefined,
          selectedCategory,
        );
        const mapped: ProductItem[] = (apiProducts || []).map((p: any) => ({
          slug: p.id,
          productName: p.description || 'Product',
          coverImage: p.main_image_url || '/preview.jpg',
          price: Number(p.amount || 0),
          currency: p.currency || 'USD',
          availableColors: p.available_colors || undefined,
          category: p.category || undefined,
        }));
        if (!ignore) setProducts(mapped);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    if (
      initialCategory &&
      selectedCategory === initialCategory &&
      initialProducts.length > 0
    ) {
      setProducts(initialProducts);
      return;
    }
    fetchData();
    return () => {
      ignore = true;
    };
  }, [selectedCategory, initialCategory, initialProducts]);

  const countLabel = useMemo(
    () => (loading ? 'Loading…' : `${products.length} items`),
    [loading, products.length],
  );

  return (
    <div className="space-y-8">
      <div className="hiddenScrollbar grid grid-cols-2 gap-3 overflow-y-hidden sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`w-full rounded-xl border px-4 py-2 text-center transition-colors ${
              selectedCategory === cat
                ? 'border-primary bg-primary text-white'
                : 'border-neutral-300 bg-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm">{countLabel}</span>
      </div>

      <div className="grid gap-10 sm:grid-cols-2 xl:grid-cols-2 2xl:gap-12">
        {products.map((item) => (
          <ProductCard product={item as any} key={item.slug} />
        ))}
      </div>
    </div>
  );
};

export default ProductsBrowser;
