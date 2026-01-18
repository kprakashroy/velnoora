import Link from 'next/link';
import React from 'react';
import { BsLinkedin, BsSpotify, BsTwitter } from 'react-icons/bs';
import { MdCopyright } from 'react-icons/md';

import { footerData } from '@/data/content';

import Subscribe from './Subscribe';

const Footer: React.FC = () => {
  return (
    <div>
      <div className="container mb-5">
        <div className="rounded-3xl bg-black text-white">
          <div className="grid gap-10 divide-x divide-neutral-500 lg:grid-cols-2 lg:gap-0">
            <div className="grid gap-y-10 px-10 pb-5 pt-16 md:grid-cols-3">
              {footerData.footerLinks.map((item) => (
                <div key={item.title} className="space-y-5">
                  <h4 className="text-2xl font-medium">{item.title}</h4>
                  {item.links.map((link) => (
                    <div key={link.name}>
                      <Link href={link.href}>{link.name}</Link>
                    </div>
                  ))}
                </div>
              ))}
              <div className="flex items-center gap-5">
                <BsTwitter className="text-2xl" />
                <BsSpotify className="text-2xl" />
                <BsLinkedin className="text-2xl" />
              </div>
            </div>
            <div className="flex flex-col justify-center p-5 md:p-20">
              <Subscribe />
            </div>
          </div>
          <div className="h-px w-full bg-neutral-500" />
          <div className="flex flex-col items-center justify-between gap-3 px-10 py-5 md:flex-row md:gap-0">
            <div className="flex items-center gap-1 text-sm md:text-base">
              <MdCopyright /> <span>2023 LuxLoom. All rights reserved</span>
            </div>

            <div className="flex items-center gap-5">
              <Link href="/">Terms of service</Link>
              <Link href="/">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
