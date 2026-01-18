'use client';

import React from 'react';

import Accordion from '@/components/Accordion';
import { faqsData } from '@/data/content';
import Heading from '@/shared/Heading/Heading';

const page = () => {
  return (
    <div className="container mb-32 mt-16">
      <Heading
        className="mx-auto mb-10 max-w-3xl"
        desc={faqsData.description}
        isCenter
        isMain
      >
        {faqsData.heading}
      </Heading>

      <div className="grid gap-20">
        {faqsData.faqs.map((item) => (
          <div key={item.category}>
            <Heading className="mb-5" isCenter>
              {item.category}
            </Heading>
            <div className="grid gap-5 lg:grid-cols-2">
              {item.data.map((itemData) => (
                <Accordion {...itemData} key={itemData.question} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
