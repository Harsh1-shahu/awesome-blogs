
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <h1 className="text-3xl font-bold text-center">
        Welcome to Awesome blogs!
      </h1>
      <Link href={"/blogs"}>All Blogs</Link>
    </div>
  );
}
