'use client';

import 'rc-slider/assets/index.css';

import Slider from 'rc-slider';
import React from 'react';

import Checkbox from '@/shared/Checkbox/Checkbox';
import {
  getColorNameFromHex,
  isHexColor,
} from '@/constants/colors';

// Color mapping from color names to Tailwind classes
const colorClassMap: { [key: string]: { bg: string; ring: string } } = {
  blue: { bg: 'bg-blue-500', ring: 'focus:ring-blue-300' },
  red: { bg: 'bg-red-500', ring: 'focus:ring-red-300' },
  yellow: { bg: 'bg-yellow-500', ring: 'focus:ring-yellow-300' },
  pink: { bg: 'bg-pink-500', ring: 'focus:ring-pink-300' },
  orange: { bg: 'bg-orange-500', ring: 'focus:ring-orange-300' },
  green: { bg: 'bg-green-500', ring: 'focus:ring-green-300' },
  black: { bg: 'bg-black', ring: 'focus:ring-black/20' },
  white: { bg: 'bg-white', ring: 'focus:ring-gray-300' },
  gray: { bg: 'bg-gray-500', ring: 'focus:ring-gray-300' },
  slate: { bg: 'bg-slate-500', ring: 'focus:ring-slate-300' },
  purple: { bg: 'bg-purple-500', ring: 'focus:ring-purple-300' },
  brown: { bg: 'bg-amber-700', ring: 'focus:ring-amber-300' },
  navy: { bg: 'bg-blue-900', ring: 'focus:ring-blue-300' },
  beige: { bg: 'bg-amber-100', ring: 'focus:ring-amber-300' },
  khaki: { bg: 'bg-yellow-200', ring: 'focus:ring-yellow-300' },
  maroon: { bg: 'bg-red-900', ring: 'focus:ring-red-300' },
  burgundy: { bg: 'bg-red-800', ring: 'focus:ring-red-300' },
  olive: { bg: 'bg-yellow-600', ring: 'focus:ring-yellow-300' },
  teal: { bg: 'bg-teal-500', ring: 'focus:ring-teal-300' },
  turquoise: { bg: 'bg-cyan-400', ring: 'focus:ring-cyan-300' },
  coral: { bg: 'bg-orange-300', ring: 'focus:ring-orange-300' },
  gold: { bg: 'bg-yellow-400', ring: 'focus:ring-yellow-300' },
  silver: { bg: 'bg-gray-300', ring: 'focus:ring-gray-300' },
};

const getColorClass = (colorValue: string) => {
  // If it's a hex code, convert to color name first
  let colorName = colorValue;
  if (isHexColor(colorValue)) {
    colorName = getColorNameFromHex(colorValue);
  }
  
  const normalized = colorName.toLowerCase().trim();
  return (
    colorClassMap[normalized] || {
      bg: 'bg-gray-400',
      ring: 'focus:ring-gray-300',
    }
  );
};

const getColorDisplayValue = (colorValue: string) => {
  // If it's a hex code, convert to color name for display
  if (isHexColor(colorValue)) {
    return getColorNameFromHex(colorValue);
  }
  return colorValue;
};

interface SidebarFiltersProps {
  availableSizes: string[];
  availableColors: string[];
  priceRange: [number, number];
  selectedSizes: string[];
  selectedColors: string[];
  priceFilter: [number, number];
  onSizeChange: (size: string, checked: boolean) => void;
  onColorChange: (color: string) => void;
  onPriceChange: (range: [number, number]) => void;
}

const SidebarFilters: React.FC<SidebarFiltersProps> = ({
  availableSizes,
  availableColors,
  priceRange,
  selectedSizes,
  selectedColors,
  priceFilter,
  onSizeChange,
  onColorChange,
  onPriceChange,
}) => {
  const renderSizes = () => {
    if (availableSizes.length === 0) return null;
    
    return (
      <div className="relative flex flex-col space-y-4 pb-8">
        <h3 className="mb-2.5 font-medium">Sizes</h3>
        <div className="grid gap-4">
          {availableSizes.map((size) => (
            <div key={size} className="">
              <Checkbox
                name={size}
                label={size}
                sizeClassName="w-5 h-5"
                labelClassName="text-sm font-normal"
                checked={selectedSizes.includes(size)}
                onChange={(checked) => onSizeChange(size, checked)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderColors = () => {
    if (availableColors.length === 0) return null;
    
    return (
      <div className="relative flex flex-col space-y-4 pb-8">
        <h3 className="mb-2.5 font-medium">Colors</h3>
        <div className="grid grid-cols-6 gap-2">
          {availableColors.map((colorValue) => {
            const colorClass = getColorClass(colorValue);
            const isSelected = selectedColors.includes(colorValue);
            const displayName = getColorDisplayValue(colorValue);
            const isHex = isHexColor(colorValue);
            const style = isHex ? { backgroundColor: colorValue } : undefined;
            
            return (
              <button
                type="button"
                key={colorValue}
                onClick={() => onColorChange(colorValue)}
                className={`${isHex ? '' : colorClass.bg} h-5 w-full rounded-md ring-2 ${
                  isSelected
                    ? 'ring-primary ring-offset-2'
                    : 'ring-transparent'
                } ${isHex ? '' : colorClass.ring} transition-all border border-neutral-200`}
                style={style}
                title={displayName}
              />
            );
          })}
        </div>
      </div>
    );
  };

  const renderTabsPriceRage = () => {
    return (
      <div className="relative flex flex-col space-y-5 py-8 pr-3">
        <div className="space-y-5">
          <span className="font-medium">Price</span>
          <Slider
            range
            min={priceRange[0]}
            max={priceRange[1]}
            step={1}
            value={[priceFilter[0], priceFilter[1]]}
            allowCross={false}
            onChange={(_input: number | number[]) => {
              const range = _input as number[];
              if (range.length >= 2 && typeof range[0] === 'number' && typeof range[1] === 'number') {
                onPriceChange([range[0], range[1]]);
              }
            }}
          />
        </div>

        <div className="flex justify-between space-x-5">
          <div>
            <div className="block text-sm font-medium">Min price</div>
            <div className="relative mt-1 rounded-md">
              <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-neutral-500 sm:text-sm">
                $
              </span>
              <input
                type="text"
                name="minPrice"
                disabled
                id="minPrice"
                className="block w-32 rounded-full border-neutral-300 bg-transparent pl-4 pr-10 sm:text-sm"
                value={priceFilter[0].toFixed(0)}
              />
            </div>
          </div>
          <div>
            <div className="block text-sm font-medium">Max price</div>
            <div className="relative mt-1 rounded-md">
              <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-neutral-500 sm:text-sm">
                $
              </span>
              <input
                type="text"
                disabled
                name="maxPrice"
                id="maxPrice"
                className="block w-32 rounded-full border-neutral-300 bg-transparent pl-4 pr-10 sm:text-sm"
                value={priceFilter[1].toFixed(0)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="top-28 lg:sticky">
      <div className="divide-y divide-neutral-300">
        {renderTabsPriceRage()}
        {renderColors()}
        {renderSizes()}
      </div>
    </div>
  );
};

export default SidebarFilters;
