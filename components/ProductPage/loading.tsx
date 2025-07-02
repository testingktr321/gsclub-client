import React from 'react';

const Loading = () => {
    return (
        <main className='bg-white min-h-screen'>
            <section className="w-11/12 mx-auto py-7 flex flex-col lg:flex-row gap-3 md:gap-10 xl:gap-20 font-unbounded">
                {/* Image Shimmer */}
                <div className="w-full lg:w-[35%]">
                    <div className="w-full h-[400px] bg-gray-200 rounded-3xl animate-pulse"></div>
                </div>

                {/* Content Shimmer */}
                <div className="w-full lg:w-[65%] py-3 space-y-6">
                    {/* Title Shimmer */}
                    <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse"></div>

                    {/* Price Shimmer */}
                    <div className="flex gap-4">
                        <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                    </div>

                    {/* Details Shimmer */}
                    <div className="space-y-4">
                        <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse"></div>
                        <div className="space-y-3">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                            ))}
                        </div>
                    </div>

                    {/* Buttons Shimmer */}
                    <div className="mt-8 flex flex-col lg:flex-row w-full items-center gap-4">
                        <div className="border border-slate-300 px-4 py-2 rounded-full flex items-center justify-between gap-6 w-full lg:w-fit h-12 bg-gray-200 animate-pulse"></div>
                        <div className="w-full h-12 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="w-full h-12 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Loading;