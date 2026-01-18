import type { FC } from 'react';
import React from 'react';
import { MdStar } from 'react-icons/md';

import ImageShowCase from '@/components/ImageShowCase';
import SizeSelect from '@/components/SizeSelect';
import { formatPrice } from '@/utils/currency';
import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import Heading from '@/shared/Heading/Heading';
import Variant from '@/shared/Variant/Variant';

interface SectionProductHeaderProps {
  shots: string[];
  productName: string;
  price: number;
  currency?: string;
  reviews: number;
  description: string;
  availableSizes?: string[];
  availableColors?: string[];
}

const SectionProductHeader: FC<SectionProductHeaderProps> = ({
  shots,
  productName,
  price,
  currency = 'USD',
  reviews,
  description,
  availableSizes,
  availableColors,
}) => {
  return (
    <div className="items-stretch justify-between space-y-10 lg:flex lg:space-y-0">
      <div className="basis-[47%]">
        <ImageShowCase shots={shots} />
      </div>

      <div className="basis-[48%] space-y-7">
        <Heading className="mb-0" isMain>
          {productName}
        </Heading>
        <p className="text-lg text-neutral-500">{description}</p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-yellow-400">
            <MdStar />
            <MdStar />
            <MdStar />
            <MdStar />
            <MdStar />
          </div>
          <span className="text-sm text-neutral-500">({reviews}k)Reviews</span>
        </div>
        <p className="text-2xl font-semibold text-secondary">{formatPrice(price, currency)}</p>
        <SizeSelect sizes={availableSizes} />

        <div>
          <h4 className="mb-5 font-medium">Colours available</h4>
          <Variant sizes="w-8 h-8" colors={availableColors} />
        </div>

        {/* Buy button temporarily hidden */}
        {false && (
          <div className="mt-5 flex items-center gap-5">
            <ButtonPrimary href="/checkout" className="w-full">
              Buy this product
            </ButtonPrimary>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionProductHeader;
