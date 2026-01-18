import Image from 'next/image';
import React from 'react';

import { productsCollection } from '@/data/content';
import hero from '@/images/productsHero.jpg';
import ButtonSecondary from '@/shared/Button/ButtonSecondary';
import Heading from '@/shared/Heading/Heading';
// no server code needed here

interface Props {
  categories: string[];
  selectedCategory: string;
}

const SectionProductsHeader = async ({
  categories,
  selectedCategory,
}: Props) => {
  return (
    <div className="space-y-10">
      <div className="h-[220px] w-full overflow-hidden rounded-2xl">
        <Image
          src={hero}
          alt="hero products"
          className="size-full object-cover object-center"
        />
      </div>

      <Heading desc={productsCollection.description} isMain>
        {productsCollection.heading}
      </Heading>
      <div className="hiddenScrollbar grid grid-cols-5 gap-5 overflow-y-hidden">
        {categories.map((category) => {
          const isActive = selectedCategory === category;
          const url = `/products?category=${encodeURIComponent(category)}`;
          return (
            <a
              href={url}
              key={category}
              aria-current={isActive ? 'page' : undefined}
            >
              <ButtonSecondary
                className={`w-full transition-colors ${isActive ? 'border-4 border-orange-500' : ''}`}
              >
                {category}
              </ButtonSecondary>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default SectionProductsHeader;
