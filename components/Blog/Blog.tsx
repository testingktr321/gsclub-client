import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { Article } from '@/types/article';

interface BlogProps {
  articles: Article[];
}

const Blog = ({ articles }: BlogProps) => {
  return (
    <div className='w-11/12 mx-auto pt-4 pb-14 font-unbounded text-black min-h-[100vh]'>
      <h1 className='font-semibold text-[2rem] text-center mb-6'>BLOGS</h1>
      {/* All Blogs */}
      <div className='font-plusSans gap-6 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1'>
        {articles.map((article, i) => (
          <Link href={`/blog/${article.id}`} key={i}>
            <Image
              src={article.images[0]?.url}
              alt={article.title}
              width={600}
              height={400}
              className='object-fill rounded-lg w-[423px] h-[228px]'
            />
            <div>
              <h3 className='font-bold text-[1.2rem] mt-2'>{article.title}</h3>
              <p className='font-normal'>{article.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Blog;
