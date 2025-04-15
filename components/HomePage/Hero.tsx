import React from 'react';

const Hero = () => {
    return (
        <section
            className="w-11/12 mx-auto bg-cover bg-center rounded-4xl pt-5 flex flex-col justify-center items-center text-white text-center px-4 h-[75vh] font-unbounded relative"
            style={{ backgroundImage: "url('/images/home_banner.jpg')" }}
        >
            {/* Black overlay */}
            <div className="absolute inset-0 bg-black opacity-10 rounded-4xl"></div>
            
            {/* Content positioned above the overlay */}
            <div className="relative">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase mb-2 leading-10 md:leading-tight">
                    One-stop shop for Everything! <br /> Convenience is just a click away!
                </h1>
            </div>
        </section>
    );
};

export default Hero;