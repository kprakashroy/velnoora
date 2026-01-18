import React from 'react';

import SectionCategories from './home/SectionCategories';
import SectionHeader from './home/SectionHeader';
import SectionMidBanner from './home/SectionMidBanner';
import SectionProducts from './home/SectionProducts';
import SectionSlider from './home/SectionSlider';
import SectionStyle from './home/SectionStyle';

const page = () => {
  return (
    <div>
      <div className="my-7">
        <SectionHeader />
      </div>

      <div className="pt-10">
        <SectionSlider />
      </div>

      <div className="py-24">
        <SectionProducts />
      </div>

      <div className="pb-24">
        <SectionCategories />
      </div>

      <div className="pb-24">
        <SectionMidBanner />
      </div>

      <div className="pb-24">
        <SectionStyle />
      </div>
    </div>
  );
};

export default page;
