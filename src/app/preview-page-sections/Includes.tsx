'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

import Heading from '@/shared/Heading/Heading';

import {
  includesCardsData,
  templateDetails,
  templateIncludes,
} from './content';

const description = `${templateDetails.name} includes over ${templateIncludes.pages} pages in total, with more than ${templateIncludes.sections} sections and in ${templateIncludes.font} font`;

const SectionIncludes = () => {
  return (
    <div className="container">
      <Heading isCenter desc={description} className="mb-10 max-w-3xl">
        {templateIncludes.heading}
      </Heading>

      <div className="grid gap-5 md:grid-cols-2 md:gap-10 lg:grid-cols-3 lg:gap-12">
        {includesCardsData.map((DATA) => (
          <motion.div
            initial={{ opacity: 0, y: '50%' }}
            whileInView={{ opacity: 1, y: '0%' }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            key={DATA.title}
            className=" overflow-hidden rounded-xl shadow-lg"
          >
            <div className="w-full overflow-hidden">
              <Image
                src={DATA.coverImage}
                alt="cover-image"
                className="w-full object-cover"
              />
            </div>
            <p className="flex w-full items-center justify-center py-6 text-xl font-semibold">
              <span className="text-primary">{DATA.spanText}</span>
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SectionIncludes;
