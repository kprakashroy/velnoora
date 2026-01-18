'use client';

import React, { useState } from 'react';

import BlogCard from '@/components/BlogCard';
import { blogs } from '@/data/content';
import type { BlogType } from '@/data/types';
import ButtonSecondary from '@/shared/Button/ButtonSecondary';

const tags = ['All', 'Style', 'Trend', 'General', 'Outfit'];

const SectionBlogs = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [filteredBlogs, setFilteredBlogs] = useState<BlogType[]>(blogs);

  const handleClick = (tag: string) => {
    setActiveTab(tag);

    if (tag === 'All') {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter((blog) => blog.tag === tag);
      setFilteredBlogs(filtered);
    }
  };
  return (
    <div className="">
      <div className="mb-16 space-y-2">
        <p className="mb-5 text-center">FILTER BY TAGS</p>
        <div className="flex flex-wrap items-center justify-center gap-5">
          {tags.map((tag) => (
            <ButtonSecondary
              key={tag}
              sizeClass="px-5 py-3"
              onClick={() => handleClick(tag)}
              className={`${
                activeTab === tag
                  ? 'bg-primary text-white'
                  : 'border border-neutral-300'
              }`}
            >
              {tag}
            </ButtonSecondary>
          ))}
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredBlogs?.map((blog) => (
          <BlogCard
            key={blog.slug}
            coverImage={blog.coverImage}
            brief={blog.brief}
            title={blog.title}
            tag={blog.tag}
            date={blog.date}
            slug={blog.slug}
          />
        ))}
      </div>
    </div>
  );
};

export default SectionBlogs;
