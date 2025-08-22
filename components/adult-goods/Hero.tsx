"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div className="w-11/12 mx-auto rounded-4xl pt-5 flex flex-col justify-center items-center text-white text-center px-4 h-[50vh] font-unbounded relative overflow-hidden">
      {/* Next.js optimized background image */}
      <Image
        src="/images/adult-page-hero.jpg"
        alt="Adult toys hero background"
        fill
        priority
        quality={85}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        sizes="100vw"
        className="object-cover rounded-4xl"
      />

      {/* Content positioned above the image */}
      <div className="relative z-10 px-8 py-12">
        <motion.div
          initial={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center text-center text-white text-4xl font-extrabold tracking-wide font-unbounded uppercase"
        >
          Adult Toys
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;