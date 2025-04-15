"use client";
import Image from 'next/image';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { FaMinus, FaPlus, FaSpinner } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import useCart from '@/hooks/useCart';
import { Product } from '@/types/product';
import { useRouter } from 'next/navigation';

interface SingleProductProps {
    product: Product | null;
}

const ProductPage = ({ product }: SingleProductProps) => {
    const { data: session } = useSession();
    const email = session?.user.email || "";
    const cart = useCart();
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleIncrement = () => {
        setQuantity((prev) => prev + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    if (!product) {
        return <div className="flex justify-center items-center min-h-screen">
            <div className="text-red-500 bg-red-100 p-4 rounded-md">
                <p className="font-semibold">Product not found</p>
            </div>
        </div>;
    }

    return (
        <main className='bg-white min-h-screen'>
            <section className="w-11/12 mx-auto py-7 flex flex-col lg:flex-row gap-3 md:gap-10 xl:gap-20 font-unbounded text-black">
                {/* Product Images */}
                <div className="w-full lg:w-[35%] ">
                    {product.images && product.images.length > 0 ? (
                        <Image
                            src={product.images[0].url}
                            width={1000}
                            height={1000}
                            alt="product image"
                            className="w-full h-auto object-cover lg:mt-2 border-2 shadow-md border-gray-100 rounded-3xl"
                        />
                    ) : (
                        <div className="bg-gray-200 w-full h-80 flex items-center justify-center">
                            <p>No image available</p>
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="w-full lg:w-[65%] py-3">
                    <div className="space-y-4 md:space-y-6">
                        {/* Product Name */}
                        <h1 className="text-3xl font-semibold text-[#0C0B0B]">
                            {product.name}
                        </h1>

                        {/* Price */}
                        <div className="flex items-center gap-4">
                            <span className="text-2xl font-bold">
                                ${product.currentPrice.toFixed(2)}
                            </span>
                            <span className="text-lg text-gray-500 line-through">
                                ${product.originalPrice.toFixed(2)}
                            </span>
                        </div>

                        {/* Product Specifications */}
                        <div className="space-y-4">
                            <h2 className="font-bold text-xl text-[#0C0B0B]">Device Details:</h2>
                            <div className="space-y-2">
                                {product.brand && (
                                    <div className="flex">
                                        <p className="">Brand: </p>
                                        <p>{product.brand.name}</p>
                                    </div>
                                )}

                                {product.flavor && (
                                    <div className="flex">
                                        <p className="">Flavor: </p>
                                        <p>{product.flavor.name}</p>
                                    </div>
                                )}

                                {product.Puffs && (
                                    <div className="flex">
                                        <p className="">Puff Count: </p>
                                        <p>{product.Puffs.name}</p>
                                    </div>
                                )}

                                {product.Nicotine && (
                                    <div className="flex">
                                        <p className="">Nicotine Strength: </p>
                                        <p>{product.Nicotine.name}</p>
                                    </div>
                                )}

                                {product.eLiquidContent && (
                                    <div className="flex">
                                        <p className="">E-liquid Contents: </p>
                                        <p>{product.eLiquidContent}</p>
                                    </div>
                                )}

                                {product.batteryCapacity && (
                                    <div className="flex">
                                        <p className="">Battery Capacity: </p>
                                        <p>{product.batteryCapacity}</p>
                                    </div>
                                )}

                                {product.coil && (
                                    <div className="flex">
                                        <p className="">Coil: </p>
                                        <p>{product.coil}</p>
                                    </div>
                                )}

                                {product.firingMechanism && (
                                    <div className="flex">
                                        <p className="">Firing Mechanism: </p>
                                        <p>{product.firingMechanism}</p>
                                    </div>
                                )}

                                {product.type && (
                                    <div className="flex">
                                        <p className="">Type: </p>
                                        <p>{product.type}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <div className="mt-8 flex flex-col lg:flex-row w-full items-center gap-4">
                            <div className="border border-slate-300 px-4 py-2 rounded-full flex items-center justify-between gap-6 w-full lg:w-fit">
                                <span className="cursor-pointer" onClick={handleDecrement}>
                                    <FaMinus />
                                </span>
                                {quantity}
                                <span className="cursor-pointer" onClick={handleIncrement}>
                                    <FaPlus />
                                </span>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                className="px-8 w-full"
                                disabled={isLoading}
                                onClick={async (event: React.MouseEvent<HTMLButtonElement>) => {
                                    event.stopPropagation();
                                    setIsLoading(true);

                                    const productData = {
                                        id: product.id,
                                        quantity,
                                    };

                                    await cart.addItem(email, productData);
                                    setIsLoading(false);
                                }}
                            >
                                {isLoading ? (
                                    <FaSpinner className="animate-spin mx-auto" />
                                ) : (
                                    "Add to Cart"
                                )}
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => router.push("/")}
                                className="flex items-center gap-2 w-full"
                            >
                                Return to shop
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ProductPage;