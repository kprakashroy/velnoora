'use client';

import React, { useState } from 'react';

import { sizes as defaultSizes } from '@/data/content';

interface SizeSelectProps {
  sizes?: string[];
}

const SizeSelect = ({ sizes = defaultSizes }: SizeSelectProps) => {
  const [selected, setSelected] = useState(sizes[0] || 'L');
  return (
    <div className="flex flex-wrap items-center gap-3">
      {sizes.map((size) => (
        <button
          key={size}
          type="button"
          onClick={() => setSelected(size)}
          className={`min-w-12 rounded-lg bg-primary px-3 py-2 text-base text-white sm:min-w-14 sm:text-lg md:min-w-16 md:text-2xl ${
            selected === size ? 'ring-2 ring-black/10' : ''
          }`}
        >
          {size}
        </button>
      ))}
      <span className="underline">Size guide</span>
    </div>
  );
};

export default SizeSelect;
