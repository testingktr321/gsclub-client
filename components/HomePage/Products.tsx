"use client"
import React, { useCallback, useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import ProductShimmer from './ProductShimmer';
// import { useSession } from 'next-auth/react';
// import useCart from '@/hooks/useCart';
// import { FaSpinner } from 'react-icons/fa';
import { useFilter } from '@/hooks/useFilter';
import { Product } from '@/types/product';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';

// interface ApiResponse {
//     products: Product[];
//     totalCount: number;
//     page: number;
//     pageSize: number;
//     totalPages: number;
// }

const Products = () => {
    // const { data: session } = useSession();
    // const email = session?.user.email || "";
    // const cart = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    // const [loadingProducts, setLoadingProducts] = useState<Record<string, boolean>>({});

    const { brandId, flavorId, puffsId, nicotineId } = useFilter();

    // Intersection Observer hook
    const { ref, inView } = useInView({
        threshold: 0,
        triggerOnce: false
    });

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const url = '/api/products?';

            // Add filter parameters
            const params = new URLSearchParams();
            if (brandId) params.append('brandId', brandId);
            if (flavorId) params.append('flavorId', flavorId);
            if (puffsId) params.append('puffsId', puffsId);
            if (nicotineId) params.append('nicotineId', nicotineId);

            // Add pagination
            params.append('page', page.toString());
            params.append('limit', '24'); // Load 24 products at a time

            const response = await fetch(url + params.toString());

            if (!response.ok) throw new Error('Failed to fetch products');

            const data = await response.json();

            if (page === 1) {
                setProducts(data.products);
            } else {
                setProducts(prev => [...prev, ...data.products]);
            }

            setHasMore(data.products.length > 0);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [brandId, flavorId, puffsId, nicotineId, page]);

    useEffect(() => {
        // Reset to page 1 when filters change
        setPage(1);
        setHasMore(true);
    }, [brandId, flavorId, puffsId, nicotineId]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        if (inView && hasMore && !loading) {
            setPage(prev => prev + 1);
        }
    }, [inView, hasMore, loading]);

    // const handleAddToCart = async (productId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    //     event.stopPropagation();
    //     event.preventDefault();

    //     // Set loading state for this specific product
    //     setLoadingProducts(prev => ({ ...prev, [productId]: true }));

    //     const productData = {
    //         id: productId,
    //         quantity: 1,
    //     };

    //     try {
    //         await cart.addItem(email, productData);
    //     } catch (error) {
    //         console.error('Error adding to cart:', error);
    //     } finally {
    //         // Clear loading state for this specific product
    //         setLoadingProducts(prev => ({ ...prev, [productId]: false }));
    //     }
    // };

    if (loading && page === 1) {
        return <ProductShimmer />;
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
        <section className="bg-white text-black font-unbounded w-11/12 mx-auto pb-16">
            {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                    <ShoppingBag className="h-12 w-12 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900">
                        {brandId || flavorId || puffsId || nicotineId
                            ? "No products match your filters"
                            : "No products available at the moment"}
                    </h3>
                    <p className="text-sm text-gray-500">Try adjusting your filters or check back later</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-6 xl:gap-10">
                        {products.map((product) => (
                            <Link href={`/product/${product.id}`} key={product.id}>
                                <div className="border-2 border-gray-200 rounded-3xl md:rounded-4xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                                    {/* <div className="aspect-square relative h-[42%] md:h-[50%]">
                                        {product.images.length > 0 ? (
                                            <Image
                                                src={product.images[0].url}
                                                alt={product.name}
                                                width={400}
                                                height={400}
                                                className="object-contain w-full h-full" // ✅ Changed this
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <ShoppingBag className="h-10 w-10 text-gray-300" />
                                            </div>
                                        )}
                                    </div> */}
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
                                                {product.originalPrice && (
                                                    <span className="ml-2 text-sm md:text-base text-gray-500 line-through">
                                                        ${product.originalPrice.toFixed(2)}
                                                    </span>
                                                )}
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
                                            {/* {product.packCount > 1 ? (
                                                <Button
                                                    className="w-full"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Link href={`/product/${product.id}`}>
                                                        Select Options
                                                    </Link>
                                                </Button>
                                            ) : product?.redirectLink ? (
                                                <Button
                                                    type="submit"
                                                    className='leading-4 lg:whitespace-nowrap'
                                                    disabled={loadingProducts[product.id]}
                                                    onClick={(event) => handleAddToCart(product.id, event)}
                                                >
                                                    {loadingProducts[product.id] ? (
                                                        <FaSpinner className="animate-spin mx-auto" />
                                                    ) : (
                                                        "Add to Cart"
                                                    )}
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="submit"
                                                    className='leading-4 lg:whitespace-nowrap'
                                                    disabled={loadingProducts[product.id]}
                                                    onClick={(event) => handleAddToCart(product.id, event)}
                                                >
                                                    {loadingProducts[product.id] ? (
                                                        <FaSpinner className="animate-spin mx-auto" />
                                                    ) : (
                                                        "Add to Cart"
                                                    )}
                                                </Button>
                                            )} */}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    {/* Loading indicator at the bottom */}
                    <div ref={ref} className="mt-8">
                        {loading && page > 1 && (
                            <div className="flex justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                            </div>
                        )}
                        {!hasMore && products.length > 0 && (
                            <p className="text-center text-gray-500 py-4">
                                You&apos;ve reached the end of products
                            </p>
                        )}
                    </div>
                </>

            )}
        </section>
    );
};

export default Products;