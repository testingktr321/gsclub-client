"use client"
import React, { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import ProductShimmer from './ProductShimmer';
import { useSession } from 'next-auth/react';
import useCart from '@/hooks/useCart';
import { FaSpinner } from 'react-icons/fa';
import { useFilter } from '@/hooks/useFilter';

interface Image {
    id: string;
    url: string;
}

interface Brand {
    id: string;
    name: string;
}

interface Product {
    id: string;
    name: string;
    description: string;
    currentPrice: number;
    originalPrice: number;
    images: Image[];
    brandId: string;
    brand: Brand;
    flavorId: string;
    puffsId: string;
    nicotineId: string;
    createdAt: string;
}

interface ApiResponse {
    products: Product[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

const Products = () => {
    const { data: session } = useSession();
    const email = session?.user.email || "";
    const cart = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loadingProducts, setLoadingProducts] = useState<Record<string, boolean>>({});

    const { brandId, flavorId, puffsId, nicotineId } = useFilter();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                let url = '/api/products';

                // Add filter parameters if they exist
                const params = new URLSearchParams();
                if (brandId) params.append('brandId', brandId);
                if (flavorId) params.append('flavorId', flavorId);
                if (puffsId) params.append('puffsId', puffsId);
                if (nicotineId) params.append('nicotineId', nicotineId);

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
    }, [brandId, flavorId, puffsId, nicotineId]);

    const handleAddToCart = async (productId: string, event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        event.preventDefault();
        
        // Set loading state for this specific product
        setLoadingProducts(prev => ({ ...prev, [productId]: true }));

        const productData = {
            id: productId,
            quantity: 1,
        };

        try {
            await cart.addItem(email, productData);
        } catch (error) {
            console.error('Error adding to cart:', error);
        } finally {
            // Clear loading state for this specific product
            setLoadingProducts(prev => ({ ...prev, [productId]: false }));
        }
    };

    if (loading) {
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
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-6 xl:gap-10">
                    {products.map((product) => (
                        <Link href={`/product/${product.id}`} key={product.id}>
                            <div className="border-2 border-gray-200 rounded-3xl md:rounded-4xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                                <div className="aspect-square relative bg-gray-100 h-[50%]">
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
                                <div className="py-6 px-6 flex flex-col flex-grow justify-between">
                                    <div className="mb-2 md:mb-4">
                                        <div className="flex items-center justify-center text-sm md:text-xl">
                                            <span className="">${product.currentPrice.toFixed(2)}</span>
                                            <span className="ml-2 text-sm md:text-base text-gray-500 line-through">
                                                ${product.originalPrice.toFixed(2)}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-base md:text-2xl mt-1.5 md:mt-3 text-center line-clamp-3">
                                            {product.name}
                                        </h3>
                                    </div>
                                    <div className='w-full mt-auto mb-2 md:px-5 flex flex-col items-center justify-center gap-3 text-xs md:text-base text-center'>
                                        <div>
                                            <span className="w-full underline">
                                                View product
                                            </span>
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={loadingProducts[product.id]}
                                            onClick={(event) => handleAddToCart(product.id, event)}
                                        >
                                            {loadingProducts[product.id] ? (
                                                <FaSpinner className="animate-spin mx-auto" />
                                            ) : (
                                                "Add to Cart"
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
};

export default Products;