import ProductPage from '@/components/ProductPage/ProductPage';
import { prisma } from '@/lib/prisma';
import { Product } from '@/types/product';
import { notFound } from 'next/navigation';
import React from 'react';
import type { Metadata } from 'next';
import { getSEOData } from '@/lib/seo';

type Props = {
    params: Promise<{ productId: string }>;
};

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { productId } = await params;

    try {
        // Fetch product data
        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { name: true }, 
        });

        // Fetch SEO data from the database for the product page route
        const seoData = await getSEOData('/product/*');

        if (!seoData) {
            return {
                title: product?.name || 'Product Not Found',
                description: 'View our product details.',
            };
        }

        const metadata: Metadata = {};

        // Construct title: Product Name - SEO Title
        if (product?.name && seoData.title) {
            metadata.title = `${product.name} - ${seoData.title}`;
        } else if (product?.name) {
            metadata.title = product.name;
        } else if (seoData.title) {
            metadata.title = seoData.title;
        }

        // Basic SEO
        if (seoData.description) metadata.description = seoData.description;
        if (seoData.keywords?.length > 0) metadata.keywords = seoData.keywords;

        // OpenGraph
        const ogTitle = seoData.ogTitle || metadata.title;
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
            title: 'Product Not Found',
            description: 'An error occurred while loading the product.',
        };
    }
}

const page = async ({ params }: Props) => {
    const { productId } = await params;

    try {
        const product = await prisma.product.findUnique({
            where: {
                id: productId,
            },
            include: {
                images: {
                    orderBy: {
                        position: 'asc',
                    },
                },
                brand: true,
                flavor: true,
                Nicotine: true,
                productPuffs: {
                    include: {
                        puffs: true,
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
                productFlavors: {
                    include: {
                        flavor: true,
                    },
                },
            },
        });

        if (!product) {
            return notFound();
        }

        const transformedProduct: Product = {
            ...product,
            packCount: product.packCount ?? 1,
            puffs: product.productPuffs.map((pp) => ({
                ...pp.puffs,
                description: pp.puffDesc,
            })),
        };

        return <ProductPage product={transformedProduct} />;
    } catch (error) {
        console.error('Failed to fetch product:', error);
        return notFound();
    }
};

export default page;