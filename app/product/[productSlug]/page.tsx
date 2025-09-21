import ProductPage from '@/components/ProductPage/ProductPage';
import { prisma } from '@/lib/prisma';
import React from 'react';
import type { Metadata } from 'next';
import { getSEOData } from '@/lib/seo';

type Props = {
    params: Promise<{ productSlug: string }>;
};

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { productSlug } = await params;

    try {
        // Fetch product data
        const product = await prisma.product.findUnique({
            where: { slug: productSlug },
            select: { name: true, },
        });

        if (!product) {
            return {
                title: 'Product Not Found',
                description: 'The requested product could not be found.',
            };
        }

        // Fetch SEO data for the specific product ID
        const seoData = await getSEOData(`/product/${productSlug}`);

        const metadata: Metadata = {};

        // If SEO data exists for this specific product, use it exclusively
        if (seoData) {
            // Use SEO data only, don't mix with product data
            if (seoData.title) {
                metadata.title = seoData.title;
            }

            if (seoData.description) {
                metadata.description = seoData.description;
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
            // No SEO data exists, fallback to product data
            if (product.name) {
                metadata.title = product.name;
            }

            // No description fallback since product doesn't have description field
            metadata.description = 'View product details.';
        }

        return metadata;
    } catch (error) {
        console.error('Failed to generate metadata:', error);
        return {
            title: 'Product Not Found',
            description: 'An error occurred while loading the product.',
        };
    }
}

const page = async ({ params }: Props) => {
    const { productSlug } = await params;

    return <ProductPage productSlug={productSlug} />;
};

export default page;