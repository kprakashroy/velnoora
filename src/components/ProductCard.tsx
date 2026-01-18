import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';

import type { ProductType } from '@/data/types';
import { formatPrice } from '@/utils/currency';
import Variant from '@/shared/Variant/Variant';

interface ProductCardProps {
  product: ProductType | DbProductCard;
  className?: string;
}

// Minimal shape for DB-backed product on card view
type DbProductCard = {
  slug: string;
  productName: string;
  coverImage: string;
  price: number;
  currency?: string;
  availableColors?: string[];
};

const ProductCard: FC<ProductCardProps> = ({ product, className }) => {
  const { coverImage } = product as any;
  // Intentionally do not show name/title on cards per requirements
  const { price } = product as any;
  const { currency = 'USD' } = product as any;
  const { slug } = product as any;
  const { availableColors } = product as any;
  return (
    <div className={`relative rounded-xl ${className}`}>
      <div className="relative h-[430px] overflow-hidden rounded-xl">
        <Image
          src={coverImage}
          alt="coverImage"
          className="size-full object-cover object-top"
          width={1000}
          height={1000}
        />
        <Link
          href={`/products/${slug}`}
          className="absolute inset-0 size-full"
        />
      </div>
      <div className="mt-5 space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-2xl font-medium text-secondary">{formatPrice(price, currency)}</p>
          <Variant colors={availableColors} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
