import React from "react";
import Link from "next/link";

import { urlFor } from "./Client";
import LatestBlogCard from "./cards/LatestBlogCard";


interface Blog {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage: { asset: { _ref: string } };
  tags: { title: string }[];
  publishedAt:string;
  readTime:string;
  author: {
    _id: string;
    name: string;
    image?: {
      asset: {
        _ref?: string;
      };
    };
  };
}
//LatestBlog
const LatestBlog = ({ blogs }: { blogs: Blog[] }) => {
  return (
    <div
      className='flex flex-col items-center gap-10 text-center w-full py-20     bg-cover bg-center'
      data-aos="fade-up"
    >
      <h3 className="gradientText2 text-[20px] md:text-[32px] font-semibold -mt-10 md:-mt-12">
        Latest Blogs
      </h3>

      <div className="w-[85%] m-auto lg:w-full grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-4 lg:gap-10">
        {blogs?.slice(0, 3).map((blog) => (
          <Link key={blog._id} href={`/blogs/${blog.slug.current}`}>
            <LatestBlogCard
              h1={blog.title}
              src={urlFor(blog.mainImage.asset._ref).width(800).url()}
              tag1={blog.tags[0]?.title}
              tag2={blog.tags[1]?.title}
              blog={blog}
              srcAuthor={
                blog?.author?.image?.asset?._ref
                  ? urlFor(blog.author.image.asset._ref).width(100).url()
                  : ""
              }
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LatestBlog;
