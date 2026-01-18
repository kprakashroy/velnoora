import Image from 'next/image';
import React from 'react';
import { BsArrowUpRight } from 'react-icons/bs';
import { FaPlay } from 'react-icons/fa';

import { profilesPhotos } from '@/data/content';
import ButtonCircle from '@/shared/Button/ButtonCircle';
import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import ButtonSecondary from '@/shared/Button/ButtonSecondary';

const SectionCategories = () => {
  return (
    <div className="container">
      <div className="grid gap-5 text-white md:h-[530px] md:grid-cols-2 lg:h-[500px]">
        <div className='relative h-[400px] w-full rounded-2xl bg-[url("/bgCollection1.avif")] bg-cover bg-center bg-no-repeat md:h-full'>
          <div className="absolute bottom-5 left-0 w-full space-y-3 px-5">
            <h3 className="text-2xl font-medium">New Release</h3>
            <p className="text-neutral-100">Presenting new trends of 2023</p>
            <div className="items-center gap-5 space-y-5 lg:flex lg:space-y-0">
              <ButtonPrimary className="w-full lg:w-auto">
                2023 LookBook
              </ButtonPrimary>
              <ButtonSecondary className="flex w-full items-center gap-1 text-white lg:w-auto">
                <FaPlay /> Watch Trending
              </ButtonSecondary>
            </div>
          </div>
        </div>

        <div>
          <div className="flex h-[650px] flex-col gap-5 md:h-full">
            <div className="h-[63%] w-full rounded-2xl bg-[url('/bgCollection2.avif')] bg-cover bg-bottom bg-no-repeat p-5">
              <div className="flex size-full flex-col justify-between rounded-2xl border-2 border-white p-5">
                <div>
                  <ButtonSecondary className="flex items-center gap-1 text-white">
                    <FaPlay /> Watch Trending
                  </ButtonSecondary>
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-medium">Trending Fashion</h3>
                  <p className="text-neutral-100">
                    New in town - Winter fashion
                  </p>
                </div>
              </div>
            </div>
            <div className="flex h-[35%] w-full flex-col justify-between rounded-2xl bg-primary p-5">
              <div className="flex items-center justify-between">
                <ButtonSecondary className="border-2 border-white bg-transparent uppercase text-black">
                  subscribe
                </ButtonSecondary>

                <div className="flex items-center -space-x-2">
                  {profilesPhotos.map((profile) => (
                    <div className="size-10" key={profile}>
                      <Image
                        width={300}
                        height={300}
                        className="size-full rounded-full object-cover object-center"
                        src={profile}
                        alt="profile"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p
                  className="basis-4/5 text-2xl font-medium"
                  style={{ lineHeight: '1em' }}
                >
                  Subscribe to newsletter and get news deals and offers
                </p>
                <ButtonCircle size="bg-secondary w-10 h-10">
                  <BsArrowUpRight className="text-2xl" />
                </ButtonCircle>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionCategories;
