import React from 'react';

import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import Heading from '@/shared/Heading/Heading';

import { templateDetails } from './content';
import ImageScroll from './ImageScroll';

const Header = () => {
  return (
    <div className="">
      <div className="container">
        <Heading
          className="mx-auto mb-10 max-w-3xl"
          desc={templateDetails.description}
          isMain
          isCenter
        >
          {templateDetails.name}
        </Heading>

        <div className="flex items-center justify-center gap-5">
          <ButtonPrimary
            href="https://www.themealchemy.com/products/luxloom"
            className="shadow-md"
            sizeClass="px-6 py-4"
          >
            Buy template
          </ButtonPrimary>
          <ButtonPrimary
            href="/#pages"
            textClassName="text-primary"
            className="border-2 border-primary bg-white text-primary"
            sizeClass="px-6 py-3.5"
          >
            Explore pages
          </ButtonPrimary>
        </div>
      </div>

      <div className="relative mt-16">
        <div className="">
          <ImageScroll />
        </div>
      </div>
    </div>
  );
};

export default Header;
