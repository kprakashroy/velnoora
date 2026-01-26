'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';

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

// Memoize product mapping function to avoid recreation on each render
const mapProductToItem = (p: any): ProductItem => ({
  slug: p.id,
  productName: p.description || 'Product',
  coverImage: p.main_image_url || '/preview.jpg',
  price: Number(p.amount || 0),
  currency: p.currency || 'USD',
  availableColors: p.available_colors || undefined,
  category: p.category || undefined,
});

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

  const defaultCategory = useMemo(
    () => (categories.length > 0 ? categories[0] : ''),
    [categories],
  );

  useEffect(() => {
    if (!selectedCategory && defaultCategory) {
      setSelectedCategory(defaultCategory);
    }
  }, [selectedCategory, defaultCategory]);

  const fetchProducts = useCallback(async (category: string) => {
    if (!category) return;

    setLoading(true);
    try {
      const { products: apiProducts } = await getProducts(
        undefined,
        undefined,
        category,
      );
      const mapped: ProductItem[] = (apiProducts || []).map(mapProductToItem);
      setProducts(mapped);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (
      initialCategory &&
      selectedCategory === initialCategory &&
      initialProducts.length > 0
    ) {
      setProducts(initialProducts);
      return;
    }

    if (selectedCategory && selectedCategory !== initialCategory) {
      fetchProducts(selectedCategory);

      // No cleanup needed (fetch is not abortable here)
      return undefined;
    }

    return undefined;
  }, [selectedCategory, initialCategory, initialProducts, fetchProducts]);

  const countLabel = useMemo(
    () => (loading ? 'Loading…' : `${products.length} items`),
    [loading, products.length],
  );

  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  const categoryButtons = useMemo(
    () =>
      categories.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => handleCategorySelect(cat)}
          className={`w-full rounded-xl border px-4 py-2 text-center transition-colors bg-primary text-white ${
            selectedCategory === cat
              ? 'border-black'
              : 'border-transparent'
          }`}
        >
          {cat}
        </button>
      )),
    [categories, selectedCategory, handleCategorySelect],
  );

  return (
    <div className="space-y-8">
      <div className="hiddenScrollbar grid grid-cols-2 gap-3 overflow-y-hidden sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {categoryButtons}
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
