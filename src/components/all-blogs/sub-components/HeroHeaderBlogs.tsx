import React from "react";

// react component
const HeroHeaderBlogs = () => {
  return (
    <main
      className="flex flex-col items-center gap-6 py-14 text-center  "
      data-aos="fade-up"
    >
      <h1 className=" text-[28px] md:text-[44px] font-bold  ">
      Blog & Updates
      </h1>

      <p className=" text-center text-[12px] md:text-[14px] xl:text-[17px] w-[85%] md:w-[65%] lg:w-[75%]  ">Stay informed with the latest trends in visual commerce, empowering your brand with cutting-edge strategies for product photography and AI-driven fashion solutions.</p>
    </main>
  );
};

export default HeroHeaderBlogs;
