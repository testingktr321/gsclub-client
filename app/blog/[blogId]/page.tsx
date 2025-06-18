import BlogDetails from '@/components/Blog/BlogDetails';
import { prisma } from '@/lib/prisma';
import { Article } from '@/types/article';
import { notFound } from 'next/navigation';
import React from 'react';
import type { Metadata } from 'next';
import { getSEOData } from '@/lib/seo';

type Props = {
    params: Promise<{ blogId: string }>;
};

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { blogId } = await params;

    try {
        // Fetch blog article data
        const article = await prisma.blogArticle.findUnique({
            where: { id: blogId },
            select: { title: true, description: true, subtitle: true },
        });

        // Fetch SEO data
        const seoData = await getSEOData('/blog/*');

        if (!seoData && !article) {
            return {
                title: 'Blog Article',
                description: 'Read our latest blog article.',
            };
        }

        const metadata: Metadata = {};

        // Construct title: Article Title - SEO Title
        if (article?.title && seoData?.title) {
            metadata.title = `${article.title} - ${seoData.title}`;
        } else if (article?.title) {
            metadata.title = article.title;
        } else if (seoData?.title) {
            metadata.title = seoData.title;
        }

        // Construct description: Use article description, subtitle, or SEO description
        if (article?.description && article.description.length > 0) {
            const plainDescription = stripHtmlTags(article.description);
            metadata.description = plainDescription ? truncateDescription(plainDescription, 160) : undefined;
        } else if (article?.subtitle && article.subtitle.length > 0) {
            const plainSubtitle = stripHtmlTags(article.subtitle); // Handle subtitle in case it also contains HTML
            metadata.description = plainSubtitle ? truncateDescription(plainSubtitle, 160) : undefined;
        } else if (seoData?.description) {
            metadata.description = truncateDescription(seoData.description, 160);
        }

        // Basic SEO: Check if keywords is an array and not empty
        if (seoData?.keywords && Array.isArray(seoData.keywords) && seoData.keywords.length > 0) {
            metadata.keywords = seoData.keywords;
        }

        // OpenGraph
        const ogTitle = seoData?.ogTitle || metadata.title;
        const ogDescription = seoData?.ogDescription || metadata.description;
        const ogImage = seoData?.ogImage;

        if (ogTitle || ogDescription || ogImage) {
            metadata.openGraph = {};
            if (ogTitle) metadata.openGraph.title = ogTitle;
            if (ogDescription) metadata.openGraph.description = ogDescription;
            if (ogImage) metadata.openGraph.images = [ogImage];
        }

        // Twitter
        if (ogTitle || ogDescription || ogImage) {
            metadata.twitter = {
                card: 'summary_large_image',
            };
            if (ogTitle) metadata.twitter.title = ogTitle;
            if (ogDescription) metadata.twitter.description = ogDescription;
            if (ogImage) metadata.twitter.images = [ogImage];
        }

        return metadata;
    } catch (error) {
        console.error('Failed to generate metadata:', error);
        return {
            title: 'Blog Article Not Found',
            description: 'An error occurred while loading the blog article.',
        };
    }
}

// Utility function to strip HTML tags
function stripHtmlTags(html: string): string {
    return html
        .replace(/<[^>]+>/g, '') // Remove HTML tags
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim(); // Remove leading/trailing spaces
}

// Utility function to truncate description to SEO-friendly length
function truncateDescription(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
}

const page = async ({ params }: Props) => {
    const { blogId } = await params;

    try {
        const article = await prisma.blogArticle.findUnique({
            where: {
                id: blogId,
            },
            include: {
                images: true,
            },
        });

        if (!article) {
            return notFound();
        }

        return (
            <div>
                <BlogDetails article={article as Article} />
            </div>
        );
    } catch (error) {
        console.error('Failed to fetch blog article:', error);
        return notFound();
    }
};

export default page;