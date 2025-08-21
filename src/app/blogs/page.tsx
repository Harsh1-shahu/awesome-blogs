
import AllBlogs from "@/components/all-blogs/AllBlogs";
import { client } from "@/components/all-blogs/sub-components/Client";

import { Metadata } from "next";
import { use } from "react";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    tag?: string;
    search?: string;
  }>;
}
//generateMetadata
export const generateMetadata = async ({
  searchParams,
}: PageProps): Promise<Metadata> => {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || "1", 10);
  const tag = resolvedSearchParams.tag || "All Blogs";
  const search = resolvedSearchParams.search || "";

  // Build canonical path (Next.js will prepend metadataBase)
  const canonicalPath =
    currentPage > 1 || tag !== "All Blogs" || search
      ? `/blogs?${new URLSearchParams({
          ...(currentPage > 1 && { page: currentPage.toString() }),
          ...(tag !== "All Blogs" && { tag }),
          ...(search && { search }),
        }).toString()}`
      : "/blogs";

  return {
    title:
      tag === "All Blogs" && !search && currentPage === 1
        ? "Texturly Blog – AI Texture Tips, Tutorials & Use Cases"
        : `${tag}${search ? `: "${search}"` : ""} – Page ${currentPage} | Blog`,
    description:
      tag === "All Blogs" && !search
        ? "Read articles and updates on AI texture generation, seamless design workflows, and the future of digital content with Texturly."
        : `Browse ${tag}${
            search ? ` blogs matching "${search}"` : " blogs"
          }${currentPage > 1 ? ` - Page ${currentPage}` : ""}.`,
    alternates: {
      canonical: canonicalPath, // ✅ relative path
    },
  };
};

//BlogPage
export default function BlogPage({ searchParams }: PageProps) {
  const resolvedSearchParams = use(searchParams);

  const page = parseInt(resolvedSearchParams.page || "1");
  const limit = 8; // adjust per page limit
  const start = (page - 1) * limit;

  const tag = resolvedSearchParams.tag;
  const search = resolvedSearchParams.search || null;

  // Build GROQ query
  let query = `*[_type == "post"`;
  if (tag && tag !== "All Blogs") {
    query += ` && "${tag}" in tags[]->title`;
  }
  if (search) {
    query += ` && title match "${search}*"`;
  }
  query += `] | order(publishedAt desc) [${start}...${start + limit}]{
    _id,
    title,
    slug,
    mainImage,
    tags[]->{
      title
    },
    author->{
      name,
      image
    },
    publishedAt,
    readTime,
    summary
  }`;

  const blogs = use(client.fetch(query));

  // Total count for pagination
  let countQuery = `count(*[_type == "post"`;
  if (tag && tag !== "All Blogs") {
    countQuery += ` && "${tag}" in tags[]->title`;
  }
  if (search) {
    countQuery += ` && title match "${search}*"`;
  }
  countQuery += `])`;

  const totalCount = use(client.fetch(countQuery));
  const totalPages = Math.ceil(totalCount / limit);

  // Fetch all tags
  const allTags = use(client.fetch(`*[_type == "tag"]{_id, title}`));

  return (
    <AllBlogs
      blogs={blogs}
      currentPage={page}
      totalPages={totalPages}
      selectedTag={tag}
      allTags={allTags}
    />
  );
}
