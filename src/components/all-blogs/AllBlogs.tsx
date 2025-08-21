"use client";

import React,{useEffect} from "react";
import Image from "next/image";
import { urlFor } from "./sub-components/Client";
import HeroHeaderBlogs from "./sub-components/HeroHeaderBlogs";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AOS from "aos";
interface Blog {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage: { asset: { _ref: string } };
  tags: { title: string }[];
  author: { name: string; image?: { asset: { _ref: string } } };
  publishedAt: string;
  readTime?: string;
  summary?: string;
}

interface AllBlogsProps {
  blogs: Blog[];
  currentPage: number;
  totalPages: number;
  selectedTag?: string; // 👈 From SSR
  allTags?: { _id: string; title: string }[]; // Add allTags prop
}
//AllBlogs
const AllBlogs = ({
  blogs,
  currentPage,
  totalPages,
  selectedTag = "All Blogs", // Default to "All Blogs" if no tag
  allTags = [], // Add allTags with default empty array
}: AllBlogsProps) => {
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag") || selectedTag;

  // 🔥 Search box submit triggers server reload
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search") as string;

    if (search.trim() === "") {
      window.location.href = "/blogs"; // Reload without search
    } else {
      window.location.href = `/blogs?search=${encodeURIComponent(search)}&page=1`;
    }
  };

  // AOS animations
  useEffect(() => {
    // Dynamically load aos.css
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/aos@2.3.4/dist/aos.css"; // CDN for aos.css
    document.head.appendChild(link);

    AOS.init({
          duration: 800,
          once: false,
          offset: 100,
          delay: 100,
          easing: 'ease-in-out',
          mirror: true
    });

    window.addEventListener("load", AOS.refresh);
    window.addEventListener("scroll", AOS.refresh);
    return () => {
      window.removeEventListener("load", AOS.refresh);
      window.removeEventListener("scroll", AOS.refresh);
      document.head.removeChild(link);
    };
}, []);

  return (
    <div className="px-[10%] md:px-[8%] lg:px-[10%] 2xl:px-[13.5%] ">
      <HeroHeaderBlogs />

     
      <div className="flex flex-col gap-4 " >
         {/* Search and Tags */}
        <div className="flex flex-col  items-center justify-center gap-2 " data-aos="fade-up">
          {/* Search box */}
          <form
            onSubmit={handleSearch}
            className="flex items-center relative  rounded-[48px] border border-[rgba(255,255,255,0.2)] h-10 px-2"
          >
            <input
              name="search"
              type="text"
              defaultValue={searchParams.get("search") || ""}
              className="flex-1 px-4 py-2 pl-10 w-full text-sm tracking-wide rounded-[48px] border-none focus:outline-none focus:ring-0 focus:border-none"
              placeholder="Search blogs..."
              style={{border:"none"}}
            />
            <button
              type="submit"
              className="text-white pl-6 rounded-md absolute -left-2 active:scale-90"
            >
               {/* eslint-disable-next-line @next/next/no-img-element */}
              <Image
                src="/icons/blog/search.svg"
                className="w-4 h-4"
                alt="search"
                loading="eager"
                width={16}
                height={16}
              />
            </button>
          </form>

          {/* Tabs section */}
          <div className="flex flex-wrap gap-4 my-4 py-2 justify-center text-center">
            {[{ title: "All Blogs" }, ...allTags].map((tag) => {
              const tagTitle = typeof tag === "string" ? tag : tag.title;
              const href =
                tagTitle === "All Blogs"
                  ? "/blogs"
                  : `/blogs?tag=${encodeURIComponent(tagTitle)}&page=1`;
              return (
                <Link
                  key={tagTitle}
                  href={href}
                  className={` border ${
                    activeTag === tagTitle ? "text-white  border-[rgba(255,255,255,0.6)]" : "text-[#76738d] border-[rgba(0,0,0,0.2)]"
                  }  w-36 md:w-fit cursor-pointer hover:text-white py-2 md:px-4  rounded-[48px]  text-[12px] bg-[#221F33] font-medium`}
                >
                  {tagTitle}
                </Link>
              );
            })}
          </div>
          
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {blogs.map((blog) => (
            <Link key={blog._id} href={`/blogs/${blog.slug.current}`} data-aos="fade-up">
              <div className="flex flex-col justify-between gap-2 h-full border border-[rgba(0,0,0,0.2)] rounded-[8px] p-6  bg-[#221F33]">
                {blog.mainImage?.asset?._ref && (
                //eslint-disable-next-line @next/next/no-img-element  
                  <img
                    className="w-full h-[20vh] md:h-[20vh] lg:h-[35vh] rounded-xl"
                    src={urlFor(blog.mainImage.asset._ref).width(800).url()}
                    alt={blog.title}
                  />
                )}
                <h2 className="text-md lg:text-lg font-[900] mt-4">
                  {blog.title}
                </h2>
                <div className="flex items-center gap-4 text-[9px] lg:text-[12px]">
                  {blog.tags.slice(0, 2).map((tag) => (
                    <h2
                      key={tag.title}
                      className=" rounded-[48px]   border border-[rgba(0,0,0,0.2)] my-2 px-4 md:px-6 py-1.5"
                    >
                      {tag.title}
                    </h2>
                  ))}
                </div>
                <p className="text-[14px]  mt-2 mb-4">{blog.summary}</p>
                <div className="flex items-center gap-4 text-[14px] mt-2">
                  {blog.author?.image?.asset?._ref && (
                    //eslint-disable-next-line @next/next/no-img-element
                    <img
                      className="size-10 rounded-full"
                      src={urlFor(blog.author.image.asset._ref)
                        .width(100)
                        .url()}
                      alt={blog.author.name}
                    />
                  )}
                  <div>
                    <h4 className="font-medium">{blog.author.name}</h4>
                    <p className="text-[12px] ">
                      {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                      {blog.readTime && ` · ${blog.readTime}`}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* No Blogs */}
        {blogs.length === 0 && (
          <div className="flex flex-col justify-center items-center h-[30vh] gap-4">
            <h3 className="font-bold text-gray-500 text-2xl">No Blogs Found</h3>
            <Link
              href="/blog"
              className="font-bold px-4 py-1.5 bg-indigo-500 text-white rounded-xl"
            >
              View All Blogs
            </Link>
          </div>
        )}

        {/* Pagination */}
        {blogs.length > 0 && (
          <div className="flex justify-center my-10 gap-1 md:gap-1 border border-[rgba(255,255,255,0.2)] p-2.5 rounded-[48px] md:px-4 mx-auto" >
            {currentPage > 1 && (
              <Link
                href={{
                  pathname: "/blogs",
                  query: { tag: activeTag, page: currentPage - 1 },
                }}
                 className="px-2 md:px-4 py-2.5 rounded-full bg-gray-500 text-black hover:bg-gray-400 hover:text-gray-700 md:m-auto border border-white "
              >
                <Image
                src="/icons/blog/left-arrow.svg"
                className="w-4 h-4"
                alt="search"
                width={16}
                height={16}
                />
              </Link>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                return (
                  page <= 2 ||
                  page > totalPages - 2 ||
                  Math.abs(page - currentPage) <= 1
                );
              })
              .reduce<number[]>((acc, page, i, arr) => {
                if (i > 0 && page - arr[i - 1] > 1) {
                  acc.push(-1); // Ellipsis
                }
                acc.push(page);
                return acc;
              }, [])
              .map((page) =>
                page === -1 ? (
                  <span key={`ellipsis-${page}`} className="md:px-3 py-2">
                    ..
                  </span>
                ) : (
                  <Link
                    key={page}
                    href={{
                      pathname: "/blogs",
                      query: { tag: activeTag, page },
                    }}
                    className={`p-2  md:px-4 rounded-full  ${
                      currentPage === page
                        ? "bg-[#221F33] text-white "
                        : " text-white hover:bg-gray-500 hover:text-white"
                    }`}
                  >
                    {page}
                  </Link>
                )
              )}

            {currentPage < totalPages && (
              <Link
                href={{
                  pathname: "/blogs",
                  query: { tag: activeTag, page: currentPage + 1 },
                }}
                className="px-2 md:px-4 py-2.5 rounded-full bg-gray-500 text-black hover:bg-gray-400 hover:text-gray-700 md:m-auto border border-white"
              >
                 <Image
                  src="/icons/blog/right-arrow.svg"
                  className="w-4 h-4"
                  alt="right-arrow"
                  width={16}
                  height={16}
                  />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllBlogs;
