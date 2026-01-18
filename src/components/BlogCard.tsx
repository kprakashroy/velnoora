'use client';

import { motion } from 'framer-motion';
import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';

interface BlogCardProps {
  title: string;
  brief: string;
  date: string;
  coverImage: string | StaticImageData;
  tag: 'Style' | 'Trend' | 'General' | 'Outfit';
  slug: string;
}

const BlogCard: FC<BlogCardProps> = ({
  title,
  brief,
  date,
  coverImage,
  tag,
  slug,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: '50%' }}
      whileInView={{ opacity: 1, y: '0%' }}
      transition={{ duration: 0.5, delay: 0.3 }}
      viewport={{ once: true }}
      className="relative h-[400px] overflow-hidden rounded-xl text-white shadow-md"
    >
      <Link
        href={`/blog/${slug}`}
        className="overlay absolute inset-0 z-20 size-full"
      />
      <div className="size-full overflow-hidden rounded-xl">
        <Image
          src={coverImage}
          alt="blog cover"
          className="size-full object-cover object-center"
          width={1000}
          height={1000}
        />
      </div>

      <div className="absolute bottom-5 left-0 z-40 w-full px-5">
        <p className="text-sm text-neutral-100">
          {date} - {tag}
        </p>
        <Link
          href={`/blog/${slug}`}
          className="card-title text-2xl font-semibold"
        >
          {title}
        </Link>
        <p className="mt-5 text-neutral-100">{brief}</p>
      </div>
    </motion.div>
  );
};

export default BlogCard;
