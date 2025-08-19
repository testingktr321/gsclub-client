"use client"
import React from 'react';

const HorizontalProductShimmer = () => {
    return (
        <div className="bg-white text-black font-unbounded">
            {/* Header Shimmer */}
            {/* <div className="flex gap-2 items-end mb-6">
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div> */}

            {/* Horizontal Scrolling Shimmer Container */}
            <div className="flex gap-2 md:gap-6 overflow-hidden pb-4">
                {[...Array(6)].map((_, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0 w-[160px] md:w-[280px]"
                    >
                        <div className="border-2 border-gray-200 rounded-3xl md:rounded-4xl overflow-hidden shadow-sm flex flex-col h-full">
                            {/* Image Shimmer */}
                            <div className="aspect-square relative bg-gray-100 h-[160px] md:h-[280px] animate-pulse">
                                <div className="w-full h-full bg-gray-200"></div>
                            </div>

                            {/* Content Shimmer */}
                            <div className="pt-3 pb-5 px-2 md:px-4 flex flex-col flex-grow justify-between">
                                <div>
                                    {/* Price Shimmer */}
                                    <div className="flex items-center justify-center space-x-2 mb-2">
                                        <div className="h-4 md:h-5 w-12 md:w-16 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="h-3 md:h-4 w-8 md:w-12 bg-gray-200 rounded animate-pulse"></div>
                                    </div>

                                    {/* Brand Name Shimmer */}
                                    <div className="h-4 md:h-5 w-3/4 bg-gray-200 rounded animate-pulse mx-auto mb-1"></div>

                                    {/* Product Name Shimmer */}
                                    <div className="h-3 md:h-4 w-full bg-gray-200 rounded animate-pulse mx-auto mb-1"></div>
                                    <div className="h-3 md:h-4 w-4/5 bg-gray-200 rounded animate-pulse mx-auto"></div>
                                </div>

                                {/* Bottom Section Shimmer */}
                                <div className="w-full mt-3 flex flex-col items-center justify-center gap-2 md:gap-3">
                                    {/* View Product Link Shimmer */}
                                    <div className="h-3 md:h-4 w-20 md:w-24 bg-gray-200 rounded animate-pulse"></div>

                                    {/* Shop Now Button Shimmer */}
                                    <div className="h-6 md:h-8 w-16 md:w-20 bg-gray-200 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HorizontalProductShimmer;