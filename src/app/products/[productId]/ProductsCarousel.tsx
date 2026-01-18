'use client';

import React from 'react';

import ProductCard from '@/components/ProductCard';
import Heading from '@/shared/Heading/Heading';
import Slider from '@/shared/Slider/Slider';

type Product = {
  slug: string;
  productName: string;
  coverImage: string;
  price: number;
  currency?: string;
  availableColors?: string[];
};

interface ProductsCarouselProps {
  products: Product[];
}

const ProductsCarousel = ({ products }: ProductsCarouselProps) => {
  return (
    <div>
      <Slider
        data={products}
        renderSectionHeading={({ onClickPrev, onClickNext, showNext, showPrev }) => (
          <div className="mb-10 flex items-center justify-between">
            <Heading className="mb-0">Featured Products</Heading>
            {products.length > 3 && (
              <div className="flex items-center gap-2">
                {showPrev && (
                  <button
                    type="button"
                    onClick={onClickPrev}
                    className="rounded-full border border-neutral-300 p-2 transition-colors hover:bg-neutral-100"
                    aria-label="Previous products"
                  >
                    ←
                  </button>
                )}
                {showNext && (
                  <button
                    type="button"
                    onClick={onClickNext}
                    className="rounded-full border border-neutral-300 p-2 transition-colors hover:bg-neutral-100"
                    aria-label="Next products"
                  >
                    →
                  </button>
                )}
              </div>
            )}
          </div>
        )}
        renderItem={(product) => <ProductCard key={product.slug} product={product} />}
        itemPerRow={3}
        className="py-5"
      />
    </div>
  );
};

export default ProductsCarousel;

