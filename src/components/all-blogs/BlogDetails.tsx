import React from "react";
import BlogContent from "./sub-components/BlogContent";
import LatestBlog from "./sub-components/LatestBlog";

interface SingleBlogProps {
  blog: {
    title: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    author: { name: string; image?: any };
    publishedAt:string;
    readTime:string;
    summary?: string;
  };
  blogs: 
  {
    _id: string;
    title: string;
    publishedAt:string;
    readTime:string;
    slug: { current: string };
    mainImage: { asset: { _ref: string } };
    tags: { title: string }[];
    author: {
      _id: string;
      name: string;
      image?: {
        asset: {
          _ref?: string;
        };
      };
    };
  }[];
}

//BlogDetails
const BlogDetails = ({ blog , blogs}: SingleBlogProps) => {
  

  return (
    <div className="px-[10%] md:px-[8%] lg:px-[10%] 2xl:px-[13.5%] ">
     

      <BlogContent
        content={blog.body}
        title={blog.title}
        author={blog.author}
        updatedAt={blog.publishedAt}
        readTime={blog.readTime ?? ""}
        summary={blog.summary ?? ""}
      />

      <div className="  w-full ">
          <LatestBlog blogs={blogs} />
      </div>
    </div>
  );
};




export default BlogDetails;
