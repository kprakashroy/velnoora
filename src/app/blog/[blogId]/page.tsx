import { pathOr } from 'ramda';
import React from 'react';

import BlogCard from '@/components/BlogCard';
import { blogs } from '@/data/content';

import CommentForm from './CommentForm';
import SectionBlogBody from './SectionBlogBody';
import SectionBlogHero from './SectionBlogHero';

type Props = {
  params: { blogId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const getBlogData = async (id: string) => {
  const filteredBlog = blogs.find((item) => item.slug === id);
  return filteredBlog;
};

const SingleBlogPage = async (props: Props) => {
  const selectedBlog = await getBlogData(props.params.blogId);

  return (
    <div className="container">
      <div className="mx-auto max-w-3xl">
        <div className="pt-10">
          <SectionBlogHero
            coverImage={pathOr('', ['coverImage'], selectedBlog)}
            title={pathOr('', ['title'], selectedBlog)}
            brief={pathOr('', ['brief'], selectedBlog)}
          />
        </div>

        <div className="pt-16">
          <SectionBlogBody
            blogData={pathOr(null, ['blogData'], selectedBlog)}
          />
        </div>

        <div className="pb-20">
          <CommentForm tag={pathOr('', ['tag'], selectedBlog)} />
        </div>

        <div className="grid gap-5 pb-24 md:grid-cols-2">
          {blogs.slice(2, 4).map((blog) => (
            <BlogCard {...blog} key={blog.slug} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleBlogPage;
