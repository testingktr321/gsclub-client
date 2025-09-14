import React from 'react';

const BlogDetailsSkeleton = () => {
    return (
        <main className="w-11/12 mx-auto pt-6 pb-14 font-unbounded text-black">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row gap-7">
                {/* Shimmer Image */}
                <div className="bg-gray-200 rounded-lg w-[423px] h-[228px] relative overflow-hidden animate-pulse">
                    <div className='absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer'></div>
                </div>

                {/* Shimmer Content */}
                <div className="space-y-5 flex-1">
                    {/* Go back button shimmer */}
                    <aside>
                        <div className="h-5 w-20 bg-gray-200 rounded relative overflow-hidden animate-pulse">
                            <div className='absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer'></div>
                        </div>
                    </aside>

                    {/* Title and subtitle shimmer */}
                    <div className="space-y-2">
                        <div className="h-6 bg-gray-200 rounded w-4/5 relative overflow-hidden animate-pulse">
                            <div className='absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer'></div>
                        </div>
                        <div className="space-y-1">
                            <div className="h-4 bg-gray-200 rounded w-full relative overflow-hidden animate-pulse">
                                <div className='absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer'></div>
                            </div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 relative overflow-hidden animate-pulse">
                                <div className='absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer'></div>
                            </div>
                        </div>
                    </div>

                    {/* Published date shimmer */}
                    <div>
                        <div className="h-4 w-32 bg-gray-200 rounded relative overflow-hidden animate-pulse">
                            <div className='absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer'></div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Blog Content Shimmer */}
            <article className="mt-7 space-y-6">
                {/* Simulating paragraph content */}
                <div className="space-y-4">
                    {/* First paragraph */}
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-full relative overflow-hidden animate-pulse">
                            <div className='absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer'></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-11/12 relative overflow-hidden animate-pulse">
                            <div className='absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer'></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-4/5 relative overflow-hidden animate-pulse">
                            <div className='absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer'></div>
                        </div>
                    </div>

                    {/* Heading shimmer */}
                    <div className="h-6 bg-gray-200 rounded w-2/3 relative overflow-hidden animate-pulse mt-6">
                        <div className='absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer'></div>
                    </div>

                    {/* Second paragraph */}
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-full relative overflow-hidden animate-pulse">
                            <div className='absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer'></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-5/6 relative overflow-hidden animate-pulse">
                            <div className='absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer'></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 relative overflow-hidden animate-pulse">
                            <div className='absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer'></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-full relative overflow-hidden animate-pulse">
                            <div className='absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer'></div>
                        </div>
                    </div>

                    {/* List shimmer */}
                    <div className="space-y-2 ml-6">
                        <div className="h-4 bg-gray-200 rounded w-4/5 relative overflow-hidden animate-pulse">
                            <div className='absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer'></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 relative overflow-hidden animate-pulse">
                            <div className='absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer'></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-5/6 relative overflow-hidden animate-pulse">
                            <div className='absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer'></div>
                        </div>
                    </div>

                    {/* Third paragraph */}
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-full relative overflow-hidden animate-pulse">
                            <div className='absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer'></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-4/5 relative overflow-hidden animate-pulse">
                            <div className='absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer'></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-11/12 relative overflow-hidden animate-pulse">
                            <div className='absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer'></div>
                        </div>
                    </div>

                    {/* Another heading */}
                    <div className="h-5 bg-gray-200 rounded w-1/2 relative overflow-hidden animate-pulse mt-6">
                        <div className='absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer'></div>
                    </div>

                    {/* Final paragraph */}
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-full relative overflow-hidden animate-pulse">
                            <div className='absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer'></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-3/5 relative overflow-hidden animate-pulse">
                            <div className='absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer'></div>
                        </div>
                    </div>
                </div>
            </article>

        </main>
    );
};

export default BlogDetailsSkeleton;