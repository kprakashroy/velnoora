'use client';

import type { Options } from '@splidejs/react-splide';
import { SplideSlide } from '@splidejs/react-splide';
import Image from 'next/image';
import React from 'react';

import { newItemsData } from '@/data/content';
import AutoScrollSlider from '@/shared/AutoScroll/AutoScrollSlider';

const SectionSlider = () => {
  const sliderOptions: Options = {
    autoScroll: {
      speed: 0.7,
    },
    arrows: false,
    perPage: 5,
    type: 'loop',
    drag: 'free',
    pagination: false,
    gap: '50px',
    breakpoints: {
      640: {
        perPage: 2,
        gap: '10px',
      },
      768: {
        perPage: 2,
        gap: '20px',
      },
      1024: {
        perPage: 3,
        gap: '40px',
      },
      1280: {
        perPage: 4,
        gap: '40px',
      },
      1536: {
        perPage: 4,
        gap: '40px',
      },
    },
  };

  return (
    <div className="border-y border-neutral-300 py-10">
      <AutoScrollSlider trigger options={sliderOptions}>
        {newItemsData.map((item) => (
          <SplideSlide key={item.title}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-32 overflow-hidden rounded-lg">
                <Image
                  src={item.coverImage}
                  alt="cover image"
                  width={500}
                  height={500}
                  className="size-full object-cover object-center"
                />
              </div>
              <p className="font-medium">
                {item.title}{' '}
                {item.year !== null ? (
                  <span className="text-neutral-500">{item.year}</span>
                ) : null}
              </p>
            </div>
          </SplideSlide>
        ))}
      </AutoScrollSlider>
    </div>
  );
};

export default SectionSlider;
