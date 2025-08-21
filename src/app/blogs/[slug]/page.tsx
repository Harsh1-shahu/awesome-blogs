
import type { Metadata } from "next";
import { client } from "@/components/all-blogs/sub-components/Client";
import BlogDetails from "@/components/all-blogs/BlogDetails";

type PageProps = {
  params: Promise<{
    slug?: string;
   
  }>;
  searchParams: Promise<{
    page?: string;
    tag?: string;
    search?: string;
  }>;
};

// SEO metadata
export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const resolvedParams = await params;
  const query = `*[_type == "post" && slug.current == $slug][0]{
    title,
    metaDescription
  }`;

  const blog = await client.fetch(query, { slug: resolvedParams.slug });

  return {
    title: blog?.title || "Blogs | Visual Commerce",
    description:
      blog?.metaDescription ||
      "Read detailed blog content about AI textures and workflows.",
    alternates: {
      canonical: `/blogs/${resolvedParams.slug}`,
    },
  };
};

//BlogDetailsPage
const BlogDetailsPage = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const query = `{
    "blog": *[_type == "post" && slug.current == $slug][0]{ 
      ..., 
      author->
    },
    "allBlogs": *[_type == "post"] | order(publishedAt desc)[0...3]{
      _id,
      title,
      slug,
      mainImage,
      "tags": tags[]->{
        _id,
        title
      },
      publishedAt,
      author->
    }
  }`;

  const { blog, allBlogs } = await client.fetch(query, { slug });

  if (!blog) {
    return (
      <div className="text-center min-h-[25rem] flex justify-center items-center text-lg py-20">
        Blog not found.
      </div>
    );
  }

  return <BlogDetails blog={blog} blogs={allBlogs} />;
};

export default BlogDetailsPage;

