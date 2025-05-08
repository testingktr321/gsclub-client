import { Product } from '@/types/product';
import React, { useEffect, useState } from 'react'
import ProductShimmer from '../HomePage/ProductShimmer';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ShoppingBag } from 'lucide-react';

interface ApiResponse {
    products: Product[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

interface RelatedProductProps {
    brandId: string;
    flavorId: string
}

const RelatedPRoduct = ({ brandId, flavorId }: RelatedProductProps) => {
    const [products, setProducts] = useState<Product[]>([]);
    console.log("object", products)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                let url = '/api/products';

                // Add filter parameters if they exist
                const params = new URLSearchParams();
                if (brandId) params.append('brandId', brandId);
                if (flavorId) params.append('flavorId', flavorId);

                if (params.toString()) {
                    url += `?${params.toString()}`;
                }

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const data: ApiResponse = await response.json();
                setProducts(data.products);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [brandId, flavorId]);

    if (loading) {
        return (
            <div className='mt-2 md:pt-8'>
                <ProductShimmer />;
            </div>
        )
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
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-6 xl:gap-10">
                {products.map((product) => (
                    <Link href={`/product/${product.id}`} key={product.id}>
                        <div className="border-2 border-gray-200 rounded-3xl md:rounded-4xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                            <div className="aspect-square relative bg-gray-100 h-[42%] md:h-[50%]">
                                {product.images.length > 0 ? (
                                    <img
                                        src={product.images[0].url}
                                        alt={product.name}
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
                                    {/* <h3 className="font-semibold text-base md:text-xl text-center line-clamp-2">
                                            {product.flavor.name}
                                        </h3> */}
                                </div>

                                <div className='w-full mb-1.5 -mt-2 md:px-5 flex flex-col items-center justify-center gap-3 text-xs md:text-base text-center'>
                                    <div>
                                        <span className="w-full underline">
                                            View product
                                        </span>
                                    </div>
                                    {product?.redirectLink && (
                                        <Button
                                            type="submit"
                                        // disabled={loadingProducts[product.id]}
                                        // onClick={(event) => handleAddToCart(product.id, event)}
                                        >
                                            {/* {loadingProducts[product.id] ? (
                                                <FaSpinner className="animate-spin mx-auto" />
                                            ) : (
                                                "Add to Cart"
                                            )} */}
                                            <Link href={product?.redirectLink || ""}>
                                                Redirect to Gs CLub
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default RelatedPRoduct
