import Blog from '@/components/Blog/Blog';
import { prisma } from '@/lib/prisma';
import React from 'react';
import type { Metadata } from 'next';
import { getSEOData } from '@/lib/seo';

// Force dynamic rendering for fresh data
export const dynamic = 'force-dynamic';

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch SEO data for the blog page route
    const seoData = await getSEOData('/blog');

    if (!seoData) {
      return {
        title: 'Our Blog',
        description: 'Explore our latest blog articles and insights.',
      };
    }

    const metadata: Metadata = {};

    // Basic SEO
    if (seoData.title) metadata.title = seoData.title;
    if (seoData.description) metadata.description = seoData.description;
    if (seoData.keywords && Array.isArray(seoData.keywords) && seoData.keywords.length > 0) {
      metadata.keywords = seoData.keywords;
    }

    // OpenGraph
    const ogTitle = seoData.ogTitle || seoData.title;
    const ogDescription = seoData.ogDescription || seoData.description;
    const ogImage = seoData.ogImage;

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
      title: 'Our Blog',
      description: 'Explore our latest blog articles and insights.',
    };
  }
}

const page = async () => {
  try {
    const articles = await prisma.blogArticle.findMany({
      include: {
        images: true,
      },
    });

    return (
      <div>
        <Blog articles={articles} />
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch blog articles:', error);
    return (
      <div>
        <p>Failed to load blog articles. Please try again later.</p>
      </div>
    );
  }
};

export default page;