import type { StaticImageData } from 'next/image';

export type ProductType = {
  slug: string;
  productName: string;
  coverImage: StaticImageData | string;
  price: number;
};

export type BlogData = {
  sectionOne: {
    title: string;
    paragraph1: string;
    points: string[];
    paragraph2: string;
  };
  sectionTwo: {
    title: string;
    description: string;
    midImage: string;
  };
  sectionThree: {
    title: string;
    description: string;
  };
  sectionFour: {
    title: string;
    description: string;
    points: string[];
  };
  quote: string;
  sectionFive: {
    title: string;
    description: string;
  }[];
};

export type BlogType = {
  title: string;
  brief: string;
  date: string;
  coverImage: string;
  blogData: BlogData;
  tag: 'Style' | 'Trend' | 'General' | 'Outfit';
  slug: string;
};
