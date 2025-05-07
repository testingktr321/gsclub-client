"use client";
import Image from 'next/image';
import React from 'react';
import { Button } from '../ui/button';
// import { FaMinus, FaPlus, FaSpinner } from 'react-icons/fa';
// import { useSession } from 'next-auth/react';
// import useCart from '@/hooks/useCart';
import { Product } from '@/types/product';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SingleProductProps {
    product: Product | null;
}

const ProductPage = ({ product }: SingleProductProps) => {
    // const { data: session } = useSession();
    // const email = session?.user.email || "";
    // const cart = useCart();
    // const [quantity, setQuantity] = useState(1);
    // const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // const handleIncrement = () => {
    //     setQuantity((prev) => prev + 1);
    // };

    // const handleDecrement = () => {
    //     if (quantity > 1) {
    //         setQuantity((prev) => prev - 1);
    //     }
    // };

    if (!product) {
        return <div className="flex justify-center items-center min-h-screen">
            <div className="text-red-500 bg-red-100 p-4 rounded-md">
                <p className="font-semibold">Product not found</p>
            </div>
        </div>;
    }

    // Helper function to render field if it exists
    const renderField = (label: string, value: string | null | undefined) => {
        if (!value) return null;
        return (
            <div className="flex">
                <p className="font-medium">{label}: </p>
                <p className="ml-2">{value}</p>
            </div>
        );
    };

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
                    <div className="space-y-5">
                        {/* Product Name */}
                        <h1 className="text-3xl font-semibold text-[#0C0B0B] leading-10">
                            {product.brand.name} <br />
                            {product.name} <br />
                            {product.flavor.name}
                        </h1>

                        {/* Price */}
                        <div className="flex items-center gap-4">
                            <span className="text-2xl font-medium">
                                ${product.currentPrice.toFixed(2)}
                            </span>
                            {product.originalPrice && (
                                <span className="text-lg text-gray-500 line-through">
                                    ${product.originalPrice.toFixed(2)}
                                </span>
                            )}
                        </div>

                        {/* Product Specifications */}
                        <div className="space-y-3">
                            <h2 className="font-bold text-xl text-[#0C0B0B]">Device Details:</h2>
                            <div className="space-y-1.5">
                                {product.Nicotine && renderField("Nicotine Strength", product.Nicotine.name)}
                                {/* Render all Puffs with descriptions */}
                                {product.productPuffs && product.productPuffs.length > 0 && (
                                    <div className="flex">
                                        <p className="font-medium">Puffs:</p>
                                        <p className="ml-2">
                                            {product.productPuffs.map((pp, index) => (
                                                <span key={index}>
                                                    {index > 0 && ' / '}
                                                    {pp.puffs.name} {pp.puffDesc}
                                                </span>
                                            ))}
                                        </p>
                                    </div>
                                )}

                                {/* Optional fields */}
                                {renderField("E-liquid Content", product.eLiquidContent)}
                                {renderField("Battery Capacity", product.batteryCapacity)}
                                {renderField("Coil", product.coil)}
                                {renderField("Firing Mechanism", product.firingMechanism)}
                                {renderField("Type", product.type)}
                                {renderField("Resistance", product.resistance)}
                                {renderField("Power Range", product.powerRange)}
                                {renderField("Charging", product.charging)}
                                {product.extra && (
                                    <div className='flex'>
                                        <p className="font-medium">Extra Features:</p>
                                        <div
                                            className="prose max-w-none ml-2"
                                            dangerouslySetInnerHTML={{ __html: product.extra }}
                                        />
                                    </div>
                                )}

                            </div>
                        </div>

                        {/* Stock Action Section */}
                        <div className="mt-8 flex flex-col lg:flex-row w-full items-center gap-4">
                            {product.isArchived ? (
                                <div className="w-full text-center bg-gray-100 border border-gray-300 text-gray-600 py-3 rounded-full font-medium">
                                    Not in Stock
                                </div>
                            ) : (
                                <>
                                    {/* Quantity Selector */}
                                    {/* <div className="border border-slate-300 px-4 py-2 rounded-full flex items-center justify-between gap-6 w-full lg:w-fit">
                                        <span className="cursor-pointer" onClick={handleDecrement}>
                                            <FaMinus />
                                        </span>
                                        {quantity}
                                        <span className="cursor-pointer" onClick={handleIncrement}>
                                            <FaPlus />
                                        </span>
                                    </div> */}

                                    {/* Add to Cart Button */}
                                    {/* <Button
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
                                    </Button> */}
                                    {product?.redirectLink && (
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            className="px-8 w-full"
                                            // disabled={isLoading}
                                        // onClick={async (event: React.MouseEvent<HTMLButtonElement>) => {
                                        //     event.stopPropagation();
                                        //     setIsLoading(true);

                                        //     const productData = {
                                        //         id: product.id,
                                        //         quantity,
                                        //     };

                                        //     await cart.addItem(email, productData);
                                        //     setIsLoading(false);
                                        // }}
                                        >
                                            {/* {isLoading ? (
                                            <FaSpinner className="animate-spin mx-auto" />
                                        ) : (
                                            "Add to Cart"
                                        )} */}
                                            <Link href={product?.redirectLink || ""}>
                                                Redirect to Gs CLub
                                            </Link>
                                        </Button>
                                    )}

                                </>
                            )}

                            {/* Return to Shop Button */}
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