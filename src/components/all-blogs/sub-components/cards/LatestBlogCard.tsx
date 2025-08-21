
import Image from "next/image";
import React from "react";

interface Blog {
  _id: string;
  title: string;
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
  publishedAt:string;
  readTime:string;
}


type Props = {
  h1: string;
  src: string;
  tag1: string;
  tag2?: string;
  blog:Blog;
  srcAuthor:string;
};

//LatestBlogCard
const LatestBlogCard = ({ h1, src, tag1, tag2 ,blog, srcAuthor}: Props) => {
  return (
    <div
      className={" border border-[rgba(0,0,0,0.2)] w-[100%] m-auto md:w-[70%] lg:w-full  rounded-[8px]   flex flex-col items-start justify-between p-6 gap-6 md:gap-10 lg:gap-6   xl:h-[450px]"}
    >
      <Image
        src={src}
        alt={"image"}
        width={1000}
        height={1000}
        className="w-full"
      />

      <h3 className="text-left text-[16px] md:text-[10px] lg:text-[16px] xl:text-[16px] ">
        {h1?.length > 65? `${h1.substring(0,65)}...`: h1}
      </h3>

      <div className="flex items-center justify-start text-[8px] md:text-[5px] lg:text-[7px] xl:text-[10px] font-medium gap-1.5 md:gap-2 lg:gap-1.5">
        {tag1 && (
          <h3 className="   rounded-[48px] border border-[rgba(0,0,0,0.2)] my-2 px-4  py-1.5    ">
            {tag1}
          </h3>
        )}

        {tag2 && (
          <h3 className="  rounded-[48px] border border-[rgba(0,0,0,0.2)] my-2  px-4  py-1.5   ">
            {tag2}
          </h3>
        )}
      </div>
       {/* Author */}
       <div className="flex items-center justify-start gap-4 text-[9px] lg:text-[12px]">
                         
           {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
              className="size-10  rounded-full   "
               src={srcAuthor}
               alt={blog.title}
          />
          <div className="flex-col items-start gap-1">
              <h3 className="text-[14px] font-medium text-left" >{blog?.author?.name}</h3>
              <p>
                 {blog?.publishedAt
                   ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
                       month: "short",
                       day: "numeric",
                       year: "numeric",
                     })
                   : ""}
                 {blog?.readTime && ` . ${blog.readTime}`}
              </p>
              
          </div>

       </div>
    </div>
  );
};

export default LatestBlogCard;
