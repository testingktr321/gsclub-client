import React from 'react';
import Image from 'next/image';

const Hero = () => {
    return (
        <section className="w-11/12 mx-auto rounded-4xl pt-5 flex flex-col justify-center items-center text-white text-center px-4 h-[75vh] font-unbounded relative overflow-hidden">
            {/* Next.js optimized background image */}
            <Image
                src="/images/home_banner.jpg"
                alt="Hero background"
                fill
                priority
                quality={85}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                sizes="100vw"
                className="object-cover rounded-4xl"
            />

            {/* Black overlay */}
            <div className="absolute inset-0 bg-black opacity-10 rounded-4xl z-10"></div>

            {/* Content positioned above the overlay */}
            <div className="relative z-20">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase mb-2 leading-10 md:leading-tight">
                    One-stop shop for Everything! <br /> Convenience is just a click away!
                </h1>
            </div>
        </section>
    );
};

export default Hero;