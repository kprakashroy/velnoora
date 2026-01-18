import Image from 'next/image';
import React from 'react';
import { FaStarOfLife } from 'react-icons/fa';

import { promoSection } from '@/data/content';
import woman from '@/images/black_woman.png';
import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import ButtonSecondary from '@/shared/Button/ButtonSecondary';
import Heading from '@/shared/Heading/Heading';

const SectionStyle = () => {
  return (
    <div className="container">
      <Heading className="mb-5 max-w-3xl" showDash>
        {promoSection.heading}
      </Heading>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="items-stretch gap-5 md:flex">
          <div className="basis-2/5 space-y-16">
            <ButtonPrimary href="/products">Shop Now</ButtonPrimary>

            <div className="relative w-full">
              <Image
                src={promoSection.photo}
                alt="photo"
                className="w-full rounded-2xl"
                width={1000}
                height={1000}
              />
            </div>
          </div>
          <div className="basis-3/5">
            <div className="h-5 w-full md:h-[250px]" />

            <div className="space-y-5 rounded-2xl bg-primary p-5 text-white">
              <ButtonSecondary className="border-2 border-white bg-transparent">
                2023 LogBook
              </ButtonSecondary>
              <h2 className="text-3xl font-medium">
                {promoSection.promoTitle}
              </h2>
              <span className="text-3xl font-medium text-secondary">
                #Festival
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-10 md:pt-40 lg:pt-0">
          <div className="relative flex h-[350px] w-full items-center justify-center rounded-2xl bg-secondary">
            <Image
              src={woman}
              alt="woman"
              className="absolute bottom-0 mx-auto w-4/5 object-cover md:w-3/5"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center md:flex">
              <FaStarOfLife className="text-4xl text-primary" />
              <div className="h-px w-24 bg-primary" />
            </div>
            <div className="space-y-5">
              <p className="text-xl font-medium">{promoSection.review.quote}</p>
              <p className="text-lg font-medium text-primary">
                - {promoSection.review.reviewer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionStyle;
