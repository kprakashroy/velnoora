'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import React from 'react';

import { productsCollection } from '@/data/content';
import hero from '@/images/productsHero.jpg';
import ButtonSecondary from '@/shared/Button/ButtonSecondary';
import Heading from '@/shared/Heading/Heading';

interface Props {
  categories: string[];
  selectedCategory: string;
}

const SectionProductsHeader = ({
  categories,
  selectedCategory: initialSelectedCategory,
}: Props) => {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get('category');
  const selectedCategory = urlCategory || initialSelectedCategory;

  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('category', category);
    // Force full page reload to ensure server component re-fetches with new category
    // This ensures the page structure is respected and data is properly reloaded
    window.location.href = `/products?${params.toString()}`;
  };

  return (
    <div className="space-y-10">
      <div className="h-[220px] w-full overflow-hidden rounded-2xl">
        <Image
          src={hero}
          alt="hero products"
          className="size-full object-cover object-center"
          priority
        />
      </div>

      <Heading desc={productsCollection.description} isMain>
        {productsCollection.heading}
      </Heading>
      <div className="hiddenScrollbar grid grid-cols-5 gap-5 overflow-y-hidden">
        {categories.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <ButtonSecondary
              key={category}
              onClick={() => handleCategoryClick(category)}
              type="button"
              // Note: `ButtonSecondary` renders a <button> already; avoid nesting <button> inside <button>
              className={`w-full transition-colors !bg-primary ${
                isActive ? '!border-4 !border-black' : 'border-0'
              }`}
            >
              {category}
            </ButtonSecondary>
          );
        })}
      </div>
    </div>
  );
};

export default SectionProductsHeader;
