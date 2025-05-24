import BlogDetails from '@/components/Blog/BlogDetails';
import { prisma } from '@/lib/prisma';
import { Article } from '@/types/article';
import React from 'react';

type Props = {
    params: Promise<{ blogId: string }>
}

const page = async ({ params }: Props) => {
    const { blogId } = await params;

    const article = await prisma.blogArticle.findUnique({
        where: {
            id: blogId,
        },
        include: {
            images: true,
        },
    });

    return (
        <div>
            <BlogDetails article={article as Article} />
        </div>
    );
};

export default page;
