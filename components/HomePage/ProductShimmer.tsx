"use client"
import React from 'react';

const ProductShimmer = () => {
    return (
        <div className="bg-white text-black font-unbounded">
            <div className='w-11/12 mx-auto'>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-6 xl:gap-10 pb-14">
                    {[...Array(8)].map((_, index) => (
                        <div key={index} className="border-2 border-gray-200 rounded-4xl overflow-hidden shadow-sm flex flex-col h-full">
                            <div className="aspect-square relative bg-gray-100 lg:h-[50%] animate-pulse">
                                <div className="w-full h-full bg-gray-200"></div>
                            </div>
                            <div className="py-6 px-6 flex flex-col flex-grow justify-between">
                                <div className="mb-3 lg:mb-0">
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="h-5 lg:h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="h-4 lg:h-5 w-12 bg-gray-200 rounded animate-pulse"></div>
                                    </div>

                                    <div className="h-4 md:h-5 w-full bg-gray-200 rounded animate-pulse mx-auto mt-3"></div>
                                    <div className="h-4 lg:h-5 w-full bg-gray-200 rounded animate-pulse mx-auto mt-2 md:mt-3"></div>
                                    <div className="h-5 w-full bg-gray-200 rounded animate-pulse mx-auto mt-3 hidden lg:block"></div>

                                </div>
                                <div className='w-full space-y-2 mt-auto mb-2 px-5 flex flex-col items-center justify-center'>
                                    <div className="h-4 md:h-6 w-full md:w-4/6 bg-gray-200 animate-pulse rounded-full"></div>
                                    <div className="h-10 w-full bg-gray-200 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductShimmer;