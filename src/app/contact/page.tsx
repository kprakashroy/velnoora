import Link from 'next/link';
import React from 'react';

import { contactSection } from '@/data/content';
import ButtonCircle3 from '@/shared/Button/ButtonCircle3';
import Heading from '@/shared/Heading/Heading';

import ContactForm from './ContactForm';

const page = () => {
  return (
    <div className="container">
      <div className="mt-20">
        <Heading desc={contactSection.description} isMain isCenter>
          {contactSection.heading}
        </Heading>
      </div>

      <div className="mb-32">
        <div className="grid gap-10 lg:grid-cols-3">
          {contactSection.directContactInfo.map((info) => (
            <div
              key={info.title}
              className="flex flex-col items-center justify-center gap-2"
            >
              <ButtonCircle3 className="text-primary" size="w-10 h-10">
                {info.icon}
              </ButtonCircle3>

              <h2 className="text-2xl font-medium">{info.title}</h2>
              <Link href={info.contactLink.href}>{info.contactLink.title}</Link>
            </div>
          ))}
        </div>

        <div className="mx-auto my-20 max-w-3xl rounded-3xl p-5 md:p-10 lg:p-16">
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default page;
