import React from 'react';

import Heading from '@/shared/Heading/Heading';

import SectionBlogs from './SectionBlogs';

const page = () => {
  return (
    <div className="container pb-20 pt-10">
      <Heading isMain isCenter className="mb-0">
        Fashion Journal
      </Heading>

      <div className="pb-24">
        <SectionBlogs />
      </div>
    </div>
  );
};

export default page;
