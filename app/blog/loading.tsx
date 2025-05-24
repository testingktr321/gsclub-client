import React from 'react';

const BlogSkeleton = () => {
    // Create an array of 6 skeleton items to match typical blog layout
    const skeletonItems = Array.from({ length: 6 }, (_, i) => i);

    return (
        <div className='w-11/12 mx-auto pt-4 pb-14 font-unbounded text-black min-h-[100vh]'>
            {/* Shimmer Title */}
            <div className='flex justify-center'>
                <h1 className='font-semibold text-[2rem] text-center mb-6'>BLOGS</h1>
            </div>

            {/* Shimmer Blog Grid */}
            <div className='font-plusSans gap-6 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1'>
                {skeletonItems.map((_, i) => (
                    <div key={i} className='animate-pulse'>
                        {/* Shimmer Image */}
                        <div className='bg-gray-200 rounded-lg w-full h-[228px] mb-2 relative overflow-hidden'>
                            <div className='absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer'></div>
                        </div>

                        {/* Shimmer Content */}
                        <div className='space-y-2'>
                            {/* Title shimmer */}
                            <div className='h-6 bg-gray-200 rounded w-3/4 relative overflow-hidden'>
                                <div className='absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer'></div>
                            </div>

                            {/* Subtitle shimmer */}
                            <div className='space-y-1'>
                                <div className='h-4 bg-gray-200 rounded w-full relative overflow-hidden'>
                                    <div className='absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer'></div>
                                </div>
                                <div className='h-4 bg-gray-200 rounded w-2/3 relative overflow-hidden'>
                                    <div className='absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer'></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default BlogSkeleton;