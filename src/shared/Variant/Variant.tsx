'use client';

import type { FC } from 'react';
import React from 'react';

import { isHexColor } from '@/constants/colors';

import ButtonCircle2 from '../Button/ButtonCircle2';

interface VariantProps {
  sizes?: string;
  colors?: string[]; // hex colors or tailwind classes
}

const Variant: FC<VariantProps> = ({ sizes = 'w-4 h-4', colors }) => {
  const defaultClasses = [
    'bg-blue-500 ring ring-transparent focus:ring-blue-300',
    'bg-yellow-500 ring ring-transparent focus:ring-yellow-300',
    'bg-green-500 ring ring-transparent focus:ring-green-300',
  ];

  // If colors provided, render using inline background color if hex/rgb/gradient, otherwise pass as className
  const items = (colors && colors.length > 0 ? colors : defaultClasses).slice(
    0,
    6,
  );

  return (
    <div className="flex items-center gap-3">
      {items.map((color, index) => {
        // Check if it's a hex code, rgb, or gradient
        const isColorValue = isHexColor(color);
        const style = isColorValue ? { background: color } : undefined;
        const className = isColorValue
          ? 'ring ring-transparent focus:ring-neutral-300 border border-neutral-200'
          : color;
        return (
          <ButtonCircle2
            key={`${color}-${index}`}
            className={className}
            size={sizes}
            style={style as any}
          />
        );
      })}
    </div>
  );
};

export default Variant;
