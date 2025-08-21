"use client";
import React, { useMemo, useEffect, useState, useCallback } from "react";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { urlFor } from "./Client";

interface BlogContentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any[];
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  author: any;
  updatedAt: string;
  readTime: string;
  summary?: string;
}

//BlogContent
const BlogContent: React.FC<BlogContentProps> = ({
  content,
  title,
  author,
  updatedAt,
  readTime,
}) => {
  const date = new Date(updatedAt).toLocaleDateString("en-GB", { 
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const [activeHeading, setActiveHeading] = useState<string | null>(null);
  const [activeHeadingMobile, setActiveHeadingMobile] = useState<string | null>(null);


  // Extract headings from PortableText content
  const headings = useMemo(() => {
    return (
      content
        ?.filter(
          (block) =>
            block._type === "block" &&
            ["h1", "h2", "h3", "h4"].includes(block.style)
        )
        .map((block) => {
          // Safely extract text from children
          const text = block.children?.[0]?.text || "";
          return text;
        })
        .filter(Boolean) ?? []
    );
  }, [content]);

  // Create refs for all headings
  const headingRefs = useMemo(() => {
    const refs: { [key: string]: React.RefObject<HTMLHeadingElement | null> } = {};
    headings.forEach((heading) => {
      refs[heading] = React.createRef<HTMLHeadingElement>();
    });
    return refs;
  }, [headings]);

  //tocRefs
  const tocRefs = useMemo(() => {
    const refs: { [key: string]: React.RefObject<HTMLButtonElement | null> } = {};
    headings.forEach((heading) => {
      refs[heading] = React.createRef<HTMLButtonElement>();
    });
    return refs;
  }, [headings]);

  // Observe headings to highlight TOC (using scroll event for robust behavior)
  useEffect(() => {
    if (!headings.length) return;
    //handleScroll
    const handleScroll = () => {
      const offset = 100; // match your header offset
      let currentActive: string | null = null;
      let minDistance = Number.POSITIVE_INFINITY;

      for (let i = 0; i < headings.length; i++) {
        const heading = headings[i];
        const ref = headingRefs[heading];
        if (ref?.current) {
          const top = ref.current.getBoundingClientRect().top - offset;
          if (top <= 0 && Math.abs(top) < minDistance) {
            minDistance = Math.abs(top);
            currentActive = heading;
          }
        }
      }
      setActiveHeading(currentActive);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [headings, headingRefs]);

  // Auto-scroll TOC when active heading changes
  useEffect(() => {
    if (activeHeading && tocRefs[activeHeading]?.current) {
      const tocContainer = tocRefs[activeHeading].current?.closest('.toc-container');
      if (tocContainer) {
        const buttonElement = tocRefs[activeHeading].current;
        const containerRect = tocContainer.getBoundingClientRect();
        const buttonRect = buttonElement.getBoundingClientRect();
        
        // Check if button is outside the visible area
        if (buttonRect.top < containerRect.top || buttonRect.bottom > containerRect.bottom) {
          buttonElement.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "nearest",
          });
        }
      }
    }
  }, [activeHeading, tocRefs ,]);

  //handleScrollToHeading
  const handleScrollToHeading = useCallback((heading: string) => {
    if (headingRefs[heading]?.current) {
      const headerOffset = 100;
      const elementPosition = headingRefs[heading].current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      setActiveHeading(heading);
    }
  }, [headingRefs]);

  const handleScrollToHeadingWrapper = useCallback((heading: string) => () => {
    handleScrollToHeading(heading);
  }, [handleScrollToHeading]);

  const handleScrollToHeadingMobileWrapper = useCallback((heading: string) => () => {
    handleScrollToHeading(heading);
    setActiveHeadingMobile(heading);
  }, [handleScrollToHeading]);

  const handleScrollToAuthor = useCallback(() => {
    const el = document.getElementById("AuthorBox");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Helper function to safely extract text from children
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getHeadingText = (children: any): string => {
    if (Array.isArray(children)) {
      return children.map(child => {
        if (typeof child === 'string') return child;
        if (child?.props?.children) return getHeadingText(child.props.children);
        return '';
      }).join('');
    }
    if (typeof children === 'string') return children;
    if (children?.props?.children) return getHeadingText(children.props.children);
    return '';
  };

  // PortableText renderers
  const components: PortableTextComponents = {
    types: {
      image: ({ value }) => (
        <div className="my-10 md:w-full h-[30vh] lg:h-[60vh]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="w-full h-full rounded-3xl object-fill"
            src={urlFor(value.asset._ref).width(800).url()}
            alt={value.alt || "Image"}
          />
        </div>
      ),
      code: ({ value }) => (
        <pre className="bg-gray-900 text-white p-4 rounded-md my-4 overflow-auto">
          <code>{value.code}</code>
        </pre>
      ),
      table: ({ value }) => (
        <div className="overflow-x-auto my-4">
          <table className="table-auto w-full text-left border-collapse">
            <tbody>
             
              {value.rows?.map((row: { cells: string[] }) => (
                <tr key={row.cells.join("-")} className="border-b">
                  {row.cells.map((cell: string) => (
                    <td key={cell} className="px-4 py-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    },
    block: {
      h1: ({ children }) => {
        const text = getHeadingText(children);
        return (
          <h1
            ref={headingRefs[text]}
            className="text-4xl font-bold my-10"
          >
            {children}
          </h1>
        );
      },
      h2: ({ children }) => {
        const text = getHeadingText(children);
        return (
          <h2
            ref={headingRefs[text]}
            className="text-3xl font-semibold my-10 text-gray-700"
          >
            {children}
          </h2>
        );
      },
      h3: ({ children }) => {
        const text = getHeadingText(children);
        return (
          <h3
            ref={headingRefs[text]}
            className="text-2xl font-medium my-10 text-gray-700"
          >
            {children}
          </h3>
        );
      },
      h4: ({ children }) => {
        const text = getHeadingText(children);
        return (
          <h4
            ref={headingRefs[text]}
            className="text-xl font-medium my-10 text-gray-700"
          >
            {children}
          </h4>
        );
      },
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-gray-500 pl-4 italic mb-14">
          {children}
        </blockquote>
      ),
      normal: ({ children }) => (
        <p className="my-4 text-[15px] leading-[25px] tracking-wide">
          {children}
        </p>
      ),
    },
    marks: {
      strong: ({ children }) => <strong>{children}</strong>,
      em: ({ children }) => <em>{children}</em>,
      link: ({ value, children }) => (
        <a
          href={value.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#a49dd3] "
        >
          {children}
        </a>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className="list-disc pl-6 my-4 text-[15px]">{children}</ul>
      ),
      number: ({ children }) => (
        <ol className="list-decimal pl-6 my-4 text-[15px]">{children}</ol>
      ),
    },
  };

  return (
    <div>
      {/* Blog header */}
      <div className="flex flex-col items-center gap-6 py-14 text-center">
        <h1 className="text-[#9B98AE] text-[20px] md:text-[40px] lg:text-[48px] font-semibold">
          {title}
        </h1>
        <p className="text-[#9B98AE] text-[13px] md:text-[15px]">
          By{" "}
          <span className="cursor-pointer hover:underline underline-offset-4"
           onClick={handleScrollToAuthor}
          >
            {author?.name}
          </span>{" "}
          | {date} | {readTime}
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-10 my-10">
        {/* TOC */}
        <div className="hidden md:flex md:flex-col md:w-40 lg:w-60 mt-10 relative">
          <div className="md:w-40 lg:w-60 sticky top-32">
            <h2 className="font-medium text-lg gradientText4">
              Table of contents
            </h2>
            <div className="toc-container flex flex-col my-4 py-2 gap-y-4 border-l border-[rgba(0,0,0,0.2)] max-h-[70vh] overflow-y-auto pr-2 scroll-smooth no-scrollbar">
              {headings.map((heading) => (
                <button
                  key={heading}
                  ref={tocRefs[heading]}
                  className={`cursor-pointer text-left text-[15px] rounded-r-[4px] hover:bg-[#f4f1eb] pl-4 py-2 transition-colors duration-200 ${
                    activeHeading === heading ? "bg-[#e2d0e6] text-black" : "text-[#6a6878]"
                  }`}
                  onClick={handleScrollToHeadingWrapper(heading)}
                >
                  <h4>{heading}</h4>
                </button>
              ))}
            </div>
          </div>
        </div>
{/* Table of headings for mobile */}
        <div className="flex md:hidden w-full my-4 relative">
          <div className="w-full sticky top-32">
            <h2 className="font-medium text-lg gradientText4 mb-2">
              Table of Contents
            </h2>
            <div className="flex flex-col my-4 py-2 gap-y-3 border-l border-[#2c293d]">
              {headings?.map((heading:string) => (
                <button
                  key={heading}
                  
                  className={`cursor-pointer text-left text-[15px] rounded-r-md pl-4 py-2 transition-all duration-200 ${
                    activeHeadingMobile === heading ? "bg-[#e2d0e6] text-black" : "text-[#9B98AE]"
                          }`}
                  onClick={handleScrollToHeadingMobileWrapper(heading)}
                >
                  <span>{heading}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog content */}
        <div className="prose lg:prose-xl">
          <PortableText value={content} components={components} />
        </div>
      </div>

      {/* Author section */}
      <div
        id="AuthorBox"
        className="scroll-mt-24 flex-col justify-center items-center  border border-[rgba(0,0,0,0.2)] py-10 rounded-[8px] my-16"
      >
        
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="size-16 rounded-full mx-auto mb-2"
          src={`${urlFor(author?.image?.asset?._ref).width(100).url()}`}
          alt={author?.name}
        />
        <h4 className="text-[18px] font-medium text-center mb-5">
          {author?.name}
        </h4>
        <p className="text-center w-[80%] mx-auto  text-[15px]">
          {author?.bio?.[0]?.children?.[0]?.text}
        </p>
      </div>
    </div>
  );
};

export default BlogContent;
