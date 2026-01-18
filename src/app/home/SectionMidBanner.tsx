import Image from 'next/image';
import React from 'react';

import bgPattern from '@/images/background.svg';
import bannerImg from '@/images/banner.png';
import ButtonSecondary from '@/shared/Button/ButtonSecondary';

const SectionMidBanner = () => {
  return (
    <div className="container">
      <div className="relative h-[400px] w-full overflow-hidden rounded-3xl bg-sky-blue md:h-[500px] lg:h-[650px]">
        <Image
          src={bgPattern}
          alt="pattern"
          className="absolute inset-0 z-0 size-full"
        />
        <Image
          src={bannerImg}
          alt="ladies"
          className="relative z-10 mx-auto object-contain md:w-3/5"
        />
        <div className="absolute bottom-7 left-0 flex w-full justify-center">
          <ButtonSecondary
            fontSize="text-xl"
            className="glassmorphism z-20 w-4/5 border-2 border-white text-white md:w-3/5"
          >
            Shop Now
          </ButtonSecondary>
        </div>
      </div>
    </div>
  );
};

export default SectionMidBanner;
