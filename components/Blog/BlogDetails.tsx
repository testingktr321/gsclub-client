import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IoIosArrowBack } from 'react-icons/io';
import { format } from 'date-fns';
import { Article } from '@/types/article';

interface BlogDetailsProps {
  article: Article;
}

const BlogDetails = ({ article }: BlogDetailsProps) => {
  const formattedDate = format(new Date(article.createdAt), 'dd/MM/yyyy');

  // Dynamic styles for the blog content
  const contentStyles = `
    [&_p]:mb-4 
    [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-6 
    [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-4 
    [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mb-3
    [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4
    [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4
    [&_li]:mb-2
    [&_strong]:font-bold
    [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-800
  `;

  return (
    <main className="w-11/12 mx-auto pt-6 pb-14 font-unbounded text-black">
      <header className="flex flex-col md:flex-row gap-7">
        <Image
          src={article.images[0]?.url || '/placeholder.jpg'}
          alt={`Image for ${article.title}`}
          width={600}
          height={400}
          className="object-fill rounded-lg w-[423px] h-[228px]"
        />
        <div className="space-y-5">
          <aside>
            <Link href="/blog">
              <span className="font-semibold flex items-center gap-1 hover:underline">
                <IoIosArrowBack />
                Go back
              </span>
            </Link>
          </aside>
          <div className="space-y-2">
            <h1 className="font-semibold text-[1.2rem]">{article.title}</h1>
            <p className="font-normal">{article.subtitle}</p>
          </div>
          <div>
            <time dateTime={new Date(article.createdAt).toISOString()} className="text-gray-600 font-sem">
              Published: {formattedDate}
            </time>
          </div>
        </div>
      </header>

      {/* Blog Content */}
      <article className="mt-7">
        <div
          dangerouslySetInnerHTML={{ __html: article.description }}
          className={contentStyles}
        />
      </article>
    </main>
  );
};

export default BlogDetails;
