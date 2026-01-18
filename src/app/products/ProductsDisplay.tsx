'use client';

import React, { useEffect, useMemo } from 'react';

import ProductCard from '@/components/ProductCard';
import SidebarFilters from '@/components/SideBarFilter';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setPriceFilter,
  setPriceRange,
  toggleSize,
  toggleColor,
} from '@/store/slices/filterSlice';

type ProductItem = {
  slug: string;
  productName: string;
  coverImage: string;
  price: number;
  currency: string;
  availableColors?: string[];
  availableSizes?: string[];
  category?: string;
};

interface ProductsDisplayProps {
  initialProducts: ProductItem[];
  availableSizes: string[];
  availableColors: string[];
  priceRange: [number, number];
}

const ProductsDisplay: React.FC<ProductsDisplayProps> = ({
  initialProducts,
  availableSizes,
  availableColors,
  priceRange,
}) => {
  const dispatch = useAppDispatch();
  const { selectedSizes, selectedColors, priceFilter } = useAppSelector(
    (state) => state.filter,
  );

  // Initialize price range when it changes (e.g., category change)
  useEffect(() => {
    dispatch(setPriceRange(priceRange));
    // If priceFilter is not set, initialize it with the new price range
    // If it's already set, keep the user's selection (it will be clamped by the slider)
    if (!priceFilter) {
      dispatch(setPriceFilter(priceRange));
    } else {
      // Clamp the existing price filter to the new range if needed
      const clampedMin = Math.max(priceFilter[0], priceRange[0]);
      const clampedMax = Math.min(priceFilter[1], priceRange[1]);
      if (
        clampedMin !== priceFilter[0] ||
        clampedMax !== priceFilter[1]
      ) {
        dispatch(setPriceFilter([clampedMin, clampedMax]));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, priceRange]);

  // Get the current price filter, fallback to priceRange if not set
  const currentPriceFilter: [number, number] =
    priceFilter || priceRange;

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Price filter
      if (
        product.price < currentPriceFilter[0] ||
        product.price > currentPriceFilter[1]
      ) {
        return false;
      }

      // Size filter
      if (selectedSizes.length > 0) {
        const productSizes = product.availableSizes || [];
        const hasMatchingSize = selectedSizes.some((size) =>
          productSizes.includes(size),
        );
        if (!hasMatchingSize) {
          return false;
        }
      }

      // Color filter
      if (selectedColors.length > 0) {
        const productColors = product.availableColors || [];
        const hasMatchingColor = selectedColors.some((color) =>
          productColors.includes(color),
        );
        if (!hasMatchingColor) {
          return false;
        }
      }

      return true;
    });
  }, [initialProducts, currentPriceFilter, selectedSizes, selectedColors]);

  const handleSizeChange = (size: string, checked: boolean) => {
    dispatch(toggleSize(size));
  };

  const handleColorChange = (color: string) => {
    dispatch(toggleColor(color));
  };

  const handlePriceChange = (range: [number, number]) => {
    dispatch(setPriceFilter(range));
  };

  return (
    <div className="relative flex flex-col lg:flex-row" id="body">
      <div className="pr-4 lg:basis-1/3 xl:basis-1/4">
        <SidebarFilters
          availableSizes={availableSizes}
          availableColors={availableColors}
          priceRange={priceRange}
          selectedSizes={selectedSizes}
          selectedColors={selectedColors}
          priceFilter={currentPriceFilter}
          onSizeChange={handleSizeChange}
          onColorChange={handleColorChange}
          onPriceChange={handlePriceChange}
        />
      </div>
      <div className="mb-10 shrink-0 border-t lg:mx-4 lg:mb-0 lg:border-t-0" />
      <div className="relative flex-1">
        <div className="mb-5 flex items-center justify-end">
          <span className="text-sm">{filteredProducts.length} items</span>
        </div>
        <div className="grid flex-1 gap-10 sm:grid-cols-2 xl:grid-cols-2 2xl:gap-12 ">
          {filteredProducts.map((item) => (
            <ProductCard product={item} key={item.slug} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsDisplay;

