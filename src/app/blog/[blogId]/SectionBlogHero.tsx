import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import type { FC } from 'react';
import React from 'react';

import Heading from '@/shared/Heading/Heading';

interface SectionBlogHeroProps {
  coverImage: string | StaticImageData;
  title: string;
  brief: string;
}

const SectionBlogHero: FC<SectionBlogHeroProps> = ({
  coverImage,
  title,
  brief,
}) => {
  return (
    <div className="">
      <Heading desc={brief} isCenter className="mx-auto mb-5 max-w-3xl">
        {title}
      </Heading>
      <Image
        src={coverImage}
        alt="cover image"
        className="w-full rounded-2xl"
        width={2000}
        height={1000}
      />
    </div>
  );
};

export default SectionBlogHero;
