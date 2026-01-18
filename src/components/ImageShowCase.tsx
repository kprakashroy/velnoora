'use client';

import Image from 'next/image';
import { pathOr } from 'ramda';
import type { FC } from 'react';
import React, { useState } from 'react';

interface ImageShowCaseProps {
  shots: string[];
}

const ImageShowCase: FC<ImageShowCaseProps> = ({ shots }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div className="space-y-5 rounded-2xl p-2">
      <div className="relative overflow-hidden rounded-2xl md:h-[500px]">
        <Image
          src={pathOr('', [activeImageIndex], shots)}
          alt="shoe image"
          className="size-full object-cover object-top"
          width={1000}
          height={1000}
        />
      </div>
      <div className="grid grid-cols-4 gap-5">
        {shots.map((shot, index) => (
          <div
            key={shot}
            className={`${
              activeImageIndex === index
                ? 'border-4 border-orange-500'
                : 'border border-transparent'
            } h-[100px] overflow-hidden rounded-lg`}
          >
            <button
              className="size-full"
              type="button"
              onClick={() => setActiveImageIndex(index)}
            >
              <Image
                src={shot}
                alt="shoe image"
                className="size-full object-cover object-top"
                width={500}
                height={500}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageShowCase;
