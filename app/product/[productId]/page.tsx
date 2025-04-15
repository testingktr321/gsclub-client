import ProductPage from '@/components/ProductPage/ProductPage';
import { prisma } from '@/lib/prisma';
import { Product } from '@/types/product';
import React from 'react'

type Props = {
    params: Promise<{ productId: string }>;
};

const page = async ({ params }: Props) => {
    const { productId } = await params;
    const product = await prisma.product.findUnique({
        where: {
            id: productId
        },
        include: {
            images: {
                orderBy: {
                    position: "asc",
                },
            },
            brand: true,
            flavor: true,
            Puffs: true,
            Nicotine: true,
        },
    })

    console.log(product)
    return (
        <ProductPage product={product as Product} />
    )
}

export default page