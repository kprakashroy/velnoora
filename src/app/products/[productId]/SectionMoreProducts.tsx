import React from 'react';

import ProductCard from '@/components/ProductCard';
import { products } from '@/data/content';
import Heading from '@/shared/Heading/Heading';

const SectionMoreProducts = () => {
  return (
    <div>
      <Heading className="mb-0">Featured Products</Heading>

      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {products.slice(0, 3).map((product) => (
          <ProductCard key={product.productName} product={product} />
        ))}
      </div>
    </div>
  );
};

export default SectionMoreProducts;
