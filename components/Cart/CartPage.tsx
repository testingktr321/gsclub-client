"use client";
import React, { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useCart from "@/hooks/useCart";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FaPlus, FaSpinner } from "react-icons/fa";
import { FaMinus } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Product } from "@/types/product";
import { CartItem } from "@/types/cart";
import { Button } from "../ui/button";
import toast from "react-hot-toast";

const CartPage = () => {
    const { data: session } = useSession();
    const email = session?.user.email || "";
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const { items, incrementQuantity, decrementQuantity, removeItem } = useCart();

    const [removingItems, setRemovingItems] = useState<{ [key: string]: boolean }>({});

    const handleRemoveItem = async (email: string, itemId: string) => {
        setRemovingItems((prev) => ({ ...prev, [itemId]: true }));
        await removeItem(email, itemId);
        setProducts(prevProducts => prevProducts.filter(product => product.id !== itemId));
        setRemovingItems((prev) => ({ ...prev, [itemId]: false }));
    };

    const [loadingIncrement, setLoadingIncrement] = useState<{ [key: string]: boolean }>({});
    const [loadingDecrement, setLoadingDecrement] = useState<{ [key: string]: boolean }>({});

    const handleIncrement = async (email: string, itemId: string) => {
        setLoadingIncrement((prev) => ({ ...prev, [itemId]: true }));
        await incrementQuantity(email, itemId);
        setLoadingIncrement((prev) => ({ ...prev, [itemId]: false }));
    };

    const handleDecrement = async (email: string, itemId: string) => {
        setLoadingDecrement((prev) => ({ ...prev, [itemId]: true }));
        const itemToUpdate = items.find(item => item.id === itemId);

        if (itemToUpdate && itemToUpdate.quantity === 1) {
            await decrementQuantity(email, itemId);
            setProducts(prevProducts => prevProducts.filter(product => product.id !== itemId));
        } else {
            await decrementQuantity(email, itemId);
        }

        setLoadingDecrement((prev) => ({ ...prev, [itemId]: false }));
    };

    const getProductDetails = (itemId: string) => {
        return products.find(product => product.id === itemId);
    };

    const calculateTotal = () => {
        return items.reduce((total, item) => {
            const product = getProductDetails(item.id);
            if (product) {
                return total + (product.currentPrice * item.quantity);
            }
            return total;
        }, 0);
    };

    const isInitialMount = React.useRef(true);

    useEffect(() => {
        const fetchProducts = async () => {
            if (items.length === 0) {
                setProducts([]);
                return;
            }

            setIsLoading(true);
            try {
                const productIds = items.map((item) => item.id).join("&id=");
                const res = await fetch(`/api/products?id=${productIds}`);
                const data = await res.json();
                setProducts(data.products);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (isInitialMount.current || hasNewItemIds(items, products)) {
            isInitialMount.current = false;
            fetchProducts();
        }
    }, [items]);

    const hasNewItemIds = (items: CartItem[], products: Product[]) => {
        if (items.length === 0) return false;
        if (products.length === 0) return true;
        const productIds = products.map((p: Product) => p.id);
        return items.some((item: CartItem) => !productIds.includes(item.id));
    };

    const handleCheckout = () => {
        // Check for out-of-stock products
        const outOfStockItems = items.filter(item => {
            const product = getProductDetails(item.id);
            return product && product.isArchived;
        });

        if (outOfStockItems.length > 0) {
            // Show toast message
            toast.error(
                "Please remove out-of-stock items from your cart before proceeding to checkout.",
                { duration: 4000 }
            );

            return;
        }

        // If no out-of-stock items, proceed to checkout
        router.push("/checkout");
    };

    // Skeleton Loading Components
    const DesktopSkeletonRow = () => (
        <tr className="border-b border-gray-200">
            <td className="p-4">
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded animate-pulse"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                    </div>
                </div>
            </td>
            <td className="p-4">
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            </td>
            <td className="p-4">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-4 animate-pulse"></div>
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
            </td>
            <td className="p-4">
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            </td>
            <td className="p-4">
                <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
            </td>
        </tr>
    );

    const MobileSkeletonItem = () => (
        <div className="flex gap-4 border-gray-200 border-b pb-6">
            <div className="bg-gray-200 h-[150px] w-1/2 sm:w-1/3 animate-pulse rounded"></div>
            <div className="flex flex-col gap-4 w-1/2 sm:w-2/3">
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-4 animate-pulse"></div>
                        <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                    <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            </div>
        </div>
    );

    return (
        <main className="bg-white font-unbounded text-black min-h-screen py-7">
            <div className="w-11/12 mx-auto">
                {isLoading ? (
                    <>
                        {/* Desktop Skeleton */}
                        <div className="hidden lg:block">
                            <div className="border border-gray-200 rounded-lg overflow-hidden xl:w-[70vw]">
                                <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr className="text-sm text-gray-400">
                                            <th className="p-4 font-light text-left">PRODUCT</th>
                                            <th className="p-4 font-light text-left">PRICE</th>
                                            <th className="p-4 font-light text-left">QUANTITY</th>
                                            <th className="p-4 font-light text-left">SUBTOTAL</th>
                                            <th className="p-4"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[...Array(3)].map((_, index) => (
                                            <DesktopSkeletonRow key={index} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Skeleton */}
                        <div className="lg:hidden block">
                            <div className="flex flex-col gap-6">
                                {[...Array(3)].map((_, index) => (
                                    <MobileSkeletonItem key={index} />
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Desktop View */}
                        <div className="hidden lg:block">
                            <div className="border border-gray-200 rounded-lg overflow-hidden xl:w-[70vw]">
                                <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr className="text-sm text-gray-400">
                                            <th className="p-4 font-light text-left">PRODUCT</th>
                                            <th className="p-4 font-light text-left">PRICE</th>
                                            <th className="p-4 font-light text-left">QUANTITY</th>
                                            <th className="p-4 font-light text-left">SUBTOTAL</th>
                                            <th className="p-4"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="text-center text-gray-400 p-4 border-b border-gray-200"
                                                >
                                                    Your cart is empty. Add some products to continue shopping.
                                                </td>
                                            </tr>
                                        ) : (
                                            items.map((item) => {
                                                const product = getProductDetails(item.id);
                                                return (
                                                    <tr key={item.id} className="border-b border-gray-200">
                                                        <td className="p-4">
                                                            {product && (
                                                                <Link href={`/product/${item.id}`} className="flex items-center space-x-4">
                                                                    {product.images[0]?.url && (
                                                                        <Image
                                                                            src={product.images[0].url}
                                                                            alt={product.name}
                                                                            width={40}
                                                                            height={40}
                                                                            className="w-16 h-16 object-contain"
                                                                        />
                                                                    )}
                                                                    <div className="text-left">
                                                                        <p className="font-medium">
                                                                            {product.brand.name} <br />
                                                                            {product.name.charAt(0).toUpperCase() + product.name.slice(1)} <br />
                                                                        </p>
                                                                    </div>
                                                                    {product.isArchived && (
                                                                        <div className="text-red-500 font-semibold text-sm">(Out of Stock)</div>
                                                                    )}
                                                                </Link>
                                                            )}
                                                        </td>
                                                        <td className="p-4 text-left">
                                                            {product ? `$${product.currentPrice}` : 'N/A'}
                                                        </td>
                                                        <td className="p-4 text-left">
                                                            <div className={`w-fit border border-gray-200 rounded-full items-center flex py-1 ${product?.isArchived ? "opacity-50 pointer-events-none" : ""}`}>
                                                                <button
                                                                    onClick={() => handleDecrement(email, item.id)}
                                                                    className="px-2 py-1 text-xs"
                                                                    disabled={product?.isArchived || loadingDecrement[item.id]}
                                                                >
                                                                    {loadingDecrement[item.id] ? (
                                                                        <FaSpinner className="animate-spin mx-auto" />
                                                                    ) : (
                                                                        <FaMinus />
                                                                    )}
                                                                </button>

                                                                <span className="px-2 font-light">{item.quantity}</span>

                                                                <button
                                                                    onClick={() => handleIncrement(email, item.id)}
                                                                    className="px-2 py-1 text-xs"
                                                                    disabled={product?.isArchived || loadingIncrement[item.id]}
                                                                >
                                                                    {loadingIncrement[item.id] ? (
                                                                        <FaSpinner className="animate-spin mx-auto" />
                                                                    ) : (
                                                                        <FaPlus />
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 font-medium text-left">
                                                            {product ? `$${Math.ceil(product.currentPrice * item.quantity)}` : 'N/A'}
                                                        </td>
                                                        <td className="p-4 text-left">
                                                            <button
                                                                onClick={() => handleRemoveItem(email, item.id)}
                                                                className="text-[1.3rem] disabled:text-gray-400 disabled:cursor-not-allowed"
                                                                disabled={removingItems[item.id]}
                                                            >
                                                                {removingItems[item.id] ? (
                                                                    <FaSpinner className="animate-spin mx-auto" />
                                                                ) : (
                                                                    <RiDeleteBin5Line />
                                                                )}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                    {items.length > 0 && (
                                        <tfoot>
                                            <tr className="border-y border-gray-200">
                                                <td colSpan={3} className="p-4 text-left">
                                                    Total <span>{items.length} Items</span>
                                                </td>
                                                <td className="p-4 text-left font-medium">
                                                    ${calculateTotal()}
                                                </td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td colSpan={3} className="p-4">
                                                    <Button
                                                        variant="secondary"
                                                        onClick={() => router.push("/")}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <IoIosArrowBack />
                                                        Return to shop
                                                    </Button>
                                                </td>
                                                <td colSpan={2} className="p-4 text-right">
                                                    <Button
                                                        variant="primary"
                                                        onClick={handleCheckout}
                                                        className="flex items-center gap-2"
                                                    >
                                                        Proceed to Checkout
                                                        <IoIosArrowForward />
                                                    </Button>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    )}
                                </table>
                            </div>
                        </div>

                        {/* Mobile View */}
                        <div className="lg:hidden block">
                            <div className="flex flex-col gap-6">
                                {items.length === 0 ? (
                                    <div className="text-center text-gray-500 p-4">
                                        Your cart is empty. Add some products to continue shopping.
                                    </div>
                                ) : (
                                    items.map((item) => {
                                        const product = getProductDetails(item.id);
                                        return (
                                            <div key={item.id} className="flex gap-4 border-gray-200 border-b pb-6">
                                                {/* Image section */}
                                                <div className="bg-white h-[150px] w-1/2 sm:w-1/3 p-2">
                                                    {product?.images[0]?.url && (
                                                        <Image
                                                            src={product.images[0].url}
                                                            alt="item"
                                                            width={150}
                                                            height={150}
                                                            className="h-full w-full object-contain"
                                                        />
                                                    )}
                                                </div>

                                                {/* Details section */}
                                                <div className="flex flex-col gap-2 w-1/2 sm:w-2/3">
                                                    <div className="text-left">
                                                        <p className=" text-[1rem]">
                                                            {product?.name ? product.name.charAt(0).toUpperCase() + product.name.slice(1) : 'N/A'}
                                                        </p>
                                                        <p className="">${product?.currentPrice || 'N/A'}</p>
                                                    </div>

                                                    <div className="flex items-center gap-10">
                                                        {/* Quantity section */}
                                                        <div className={`w-fit border border-gray-200 rounded-full items-center flex py-1 ${product?.isArchived ? "opacity-50 pointer-events-none" : ""}`}>
                                                            <button
                                                                onClick={() => handleDecrement(email, item.id)}
                                                                className="px-2 py-1 text-xs"
                                                                disabled={product?.isArchived || loadingDecrement[item.id]}
                                                            >
                                                                {loadingDecrement[item.id] ? (
                                                                    <FaSpinner className="animate-spin mx-auto" />
                                                                ) : (
                                                                    <FaMinus />
                                                                )}
                                                            </button>
                                                            <span className="px-2">{item.quantity}</span>
                                                            <button
                                                                onClick={() => handleIncrement(email, item.id)}
                                                                className="px-2 py-1 text-xs"
                                                                disabled={product?.isArchived || loadingIncrement[item.id]}
                                                            >
                                                                {loadingIncrement[item.id] ? (
                                                                    <FaSpinner className="animate-spin mx-auto" />
                                                                ) : (
                                                                    <FaPlus />
                                                                )}
                                                            </button>
                                                        </div>

                                                        {/* Delete button */}
                                                        <div>
                                                            <button
                                                                onClick={() => handleRemoveItem(email, item.id)}
                                                                className="text-[1.3rem] disabled:text-gray-400 disabled:cursor-not-allowed"
                                                                disabled={removingItems[item.id]}
                                                            >
                                                                {removingItems[item.id] ? (
                                                                    <FaSpinner className="animate-spin mx-auto" />
                                                                ) : (
                                                                    <RiDeleteBin5Line />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="">
                                                        Subtotal: ${product ? Math.ceil(product.currentPrice * item.quantity) : 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Total of items and price */}
                            {items.length > 0 && (
                                <>
                                    <div className="flex items-center justify-between mt-8">
                                        <span className="p-4">
                                            Total <span>{items.length} Items</span>
                                        </span>
                                        <span className="p-4">
                                            ${calculateTotal()}
                                        </span>
                                    </div>

                                    {/* Checkout button */}
                                    <Button
                                        variant="primary"
                                        onClick={handleCheckout}
                                    >
                                        Proceed to Checkout
                                        <IoIosArrowForward />
                                    </Button>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </main>
    );
};

export default CartPage;