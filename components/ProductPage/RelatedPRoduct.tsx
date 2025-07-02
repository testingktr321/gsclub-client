import { Product } from '@/types/product';
import React, { useEffect, useState, useCallback } from 'react';
import ProductShimmer from '../HomePage/ProductShimmer';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ShoppingBag } from 'lucide-react';
import Image from 'next/image';

interface RelatedProductProps {
    brandId: string;
    flavorId?: string;
    productId: string;
}

const RelatedPRoduct = ({ brandId, flavorId, productId }: RelatedProductProps) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const url = '/api/products/related-products?';

            // Add filter parameters
            const params = new URLSearchParams();
            if (brandId) params.append('brandId', brandId);
            if (flavorId) params.append('flavorId', flavorId);

            // Fixed limit of 8 products
            params.append('page', '1');
            params.append('limit', '8');

            const response = await fetch(url + params.toString());

            if (!response.ok) throw new Error('Failed to fetch products');

            const data = await response.json();
            setProducts(data.products);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [brandId, flavorId]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const filteredProducts = products.filter(
        (product: Product) => product.id !== productId
    );

    if (loading) {
        return (
            <div className='mt-2 md:pt-8 mx-auto w-11/12'>
                <ProductShimmer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-500 bg-red-100 p-4 rounded-md">
                    <p className="font-semibold">Error loading products</p>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className='w-11/12 mx-auto mt-2 md:pt-8 pb-12 md:pb-20 font-unbounded'>
            <div className='bg-black h-[2px] mb-7 md:mb-10 rounded-full'></div>
            <h2 className='text-center text-xl md:text-2xl font-semibold mb-7 md:mb-10'>Related products</h2>

            {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
                    <ShoppingBag className="h-12 w-12 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900">
                        No related products found
                    </h3>
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-6 xl:gap-10">
                    {filteredProducts.map((product) => (
                        <Link href={`/product/${product.id}`} key={product.id}>
                            <div className="border-2 border-gray-200 rounded-3xl md:rounded-4xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                                <div className="aspect-square relative bg-gray-100 h-[16rem] md:h-[32rem] lg:h-[22rem]">
                                    {product.images.length > 0 ? (
                                        <Image
                                            src={product.images[0].url}
                                            alt={product.name}
                                            width={400}
                                            height={400}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <ShoppingBag className="h-10 w-10 text-gray-300" />
                                        </div>
                                    )}
                                </div>
                                <div className="pt-3 pb-5 md:pb-5 px-2 md:px-4 flex flex-col flex-grow justify-between">
                                    <div>
                                        <div className="flex items-center justify-center text-sm md:text-xl">
                                            <span className="">${product.currentPrice.toFixed(2)}</span>
                                            <span className="ml-2 text-sm md:text-base text-gray-500 line-through">
                                                ${product.originalPrice.toFixed(2)}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-base md:text-xl mt-1.5 md:mt-2.5 text-center line-clamp-2">
                                            {product.brand.name}
                                        </h3>
                                        <h3 className="font-semibold text-base md:text-xl text-center line-clamp-3 mt-0.5 md:mt-1 leading-5 md:leading-7">
                                            {product.name}
                                        </h3>
                                    </div>

                                    <div className='w-full mb-1.5 mt-2 md:px-5 flex flex-col items-center justify-center gap-3 text-xs md:text-base text-center'>
                                        <div>
                                            <span className="w-full underline">
                                                View product
                                            </span>
                                        </div>
                                        {product?.redirectLink && (
                                            <Button type="submit" className='leading-4 lg:whitespace-nowrap'>
                                                <Link href={product?.redirectLink || ""}>
                                                    Shop Now
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RelatedPRoduct;