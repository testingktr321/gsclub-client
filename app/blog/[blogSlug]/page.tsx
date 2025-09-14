import BlogDetails from '@/components/Blog/BlogDetails';
import { prisma } from '@/lib/prisma';
import { Article } from '@/types/article';
import { notFound } from 'next/navigation';
import React from 'react';
import type { Metadata } from 'next';
import { getSEOData } from '@/lib/seo';

type Props = {
    params: Promise<{ blogSlug: string }>;
};

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { blogSlug } = await params;

    try {
        // Fetch blog article data
        const article = await prisma.blogArticle.findUnique({
            where: { slug: blogSlug },
            select: { title: true, description: true, subtitle: true },
        });

        if (!article) {
            return {
                title: 'Blog Article Not Found',
                description: 'The requested blog article could not be found.',
            };
        }

        // Fetch SEO data for the specific slug
        const seoData = await getSEOData(`/blog/${blogSlug}`);

        const metadata: Metadata = {};

        // If SEO data exists for this specific slug, use it exclusively
        if (seoData) {
            // Use SEO data only, don't mix with article data
            if (seoData.title) {
                metadata.title = seoData.title;
            }

            if (seoData.description) {
                metadata.description = truncateDescription(seoData.description, 160);
            }

            // Keywords
            if (seoData.keywords && Array.isArray(seoData.keywords) && seoData.keywords.length > 0) {
                metadata.keywords = seoData.keywords;
            }

            // OpenGraph
            if (seoData.ogTitle || seoData.ogDescription || seoData.ogImage) {
                metadata.openGraph = {};
                if (seoData.ogTitle) metadata.openGraph.title = seoData.ogTitle;
                if (seoData.ogDescription) metadata.openGraph.description = seoData.ogDescription;
                if (seoData.ogImage) metadata.openGraph.images = [seoData.ogImage];
            }

            // Twitter
            if (seoData.ogTitle || seoData.ogDescription || seoData.ogImage) {
                metadata.twitter = {
                    card: 'summary_large_image',
                };
                if (seoData.ogTitle) metadata.twitter.title = seoData.ogTitle;
                if (seoData.ogDescription) metadata.twitter.description = seoData.ogDescription;
                if (seoData.ogImage) metadata.twitter.images = [seoData.ogImage];
            }
        } else {
            // No SEO data exists, fallback to article data
            if (article.title) {
                metadata.title = article.title;
            }

            // Use article description or subtitle as fallback
            if (article.description && article.description.length > 0) {
                const plainDescription = stripHtmlTags(article.description);
                metadata.description = plainDescription ? truncateDescription(plainDescription, 160) : undefined;
            } else if (article.subtitle && article.subtitle.length > 0) {
                const plainSubtitle = stripHtmlTags(article.subtitle);
                metadata.description = plainSubtitle ? truncateDescription(plainSubtitle, 160) : undefined;
            }
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
    const { blogSlug } = await params;

    try {
        const article = await prisma.blogArticle.findUnique({
            where: {
                slug: blogSlug,
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