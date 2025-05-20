import ProductPage from '@/components/ProductPage/ProductPage';
import { prisma } from '@/lib/prisma';
import { Product } from '@/types/product';
import { notFound } from 'next/navigation';
import React from 'react'

type Props = {
    params: Promise<{ productId: string }>;
};

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
                        position: "asc",
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
                        flavor: true
                    }
                }
            },
        });

        if (!product) {
            return notFound();
        }

        const transformedProduct: Product = {
            ...product,
            packCount: product.packCount ?? 1,
            puffs: product.productPuffs.map(pp => ({
                ...pp.puffs,
                description: pp.puffDesc,
            })),
        };

        return <ProductPage product={transformedProduct} />;
    } catch (error) {
        console.error('Failed to fetch product:', error);
        return notFound();
    }
}

export default page;