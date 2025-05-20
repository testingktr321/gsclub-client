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

    const getItemKey = (item: CartItem) => {
        return `${item.id}-${item.attributeId || "default"}`;
    };

    const getFlavorName = (product: Product, attributeId?: string) => {
        if (!attributeId || !product.productFlavors || product.productFlavors.length === 0) {
            return null;
        }
        const flavorItem = product.productFlavors.find(pf => pf.flavorId === attributeId);
        if (flavorItem && flavorItem.flavor) {
            return flavorItem.flavor.name;
        }
        return null;
    };

    const getProductNameWithFlavor = (product: Product, attributeId?: string) => {
        const baseName = product.name.charAt(0).toUpperCase() + product.name.slice(1);
        const flavorName = getFlavorName(product, attributeId);
        if (flavorName) {
            return `${baseName} - ${flavorName}`;
        }
        return baseName;
    };

    const handleRemoveItem = async (email: string, itemId: string, attributeId?: string) => {
        const key = attributeId ? `${itemId}-${attributeId}` : itemId;
        setRemovingItems((prev) => ({ ...prev, [key]: true }));
        await removeItem(email, itemId, attributeId);
        if (attributeId) {
            setProducts(prevProducts => [...prevProducts]);
        } else {
            setProducts(prevProducts => prevProducts.filter(product => product.id !== itemId));
        }
        setRemovingItems((prev) => ({ ...prev, [key]: false }));
    };

    const [loadingIncrement, setLoadingIncrement] = useState<{ [key: string]: boolean }>({});
    const [loadingDecrement, setLoadingDecrement] = useState<{ [key: string]: boolean }>({});

    const handleIncrement = async (email: string, itemId: string, attributeId?: string) => {
        const key = attributeId ? `${itemId}-${attributeId}` : itemId;
        setLoadingIncrement((prev) => ({ ...prev, [key]: true }));
        await incrementQuantity(email, itemId, attributeId);
        setLoadingIncrement((prev) => ({ ...prev, [key]: false }));
    };

    const handleDecrement = async (email: string, itemId: string, attributeId?: string) => {
        const key = attributeId ? `${itemId}-${attributeId}` : itemId;
        setLoadingDecrement((prev) => ({ ...prev, [key]: true }));
        const itemToUpdate = items.find(item =>
            item.id === itemId &&
            (attributeId ? item.attributeId === attributeId : true)
        );

        if (itemToUpdate && itemToUpdate.quantity === 1) {
            await decrementQuantity(email, itemId, attributeId);
            if (!attributeId) {
                setProducts(prevProducts => prevProducts.filter(product => product.id !== itemId));
            }
        } else {
            await decrementQuantity(email, itemId, attributeId);
        }

        setLoadingDecrement((prev) => ({ ...prev, [key]: false }));
    };

    const getProductDetails = (itemId: string) => {
        return products.find(product => product.id === itemId);
    };

    const calculateTotal = () => {
        return items.reduce((total, item) => {
            const product = getProductDetails(item.id);
            if (product) {
                const packCount = product.packCount || 1; // Default to 1 if null
                return total + ((product.currentPrice / packCount) * item.quantity);
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
                const uniqueProductIds = [...new Set(items.map(item => item.id))];
                const productIds = uniqueProductIds.join("&id=");
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
        const outOfStockItems = items.filter(item => {
            const product = getProductDetails(item.id);
            return product && product.isArchived;
        });

        if (outOfStockItems.length > 0) {
            toast.error(
                "Please remove out-of-stock items from your cart before proceeding to checkout.",
                { duration: 4000 }
            );
            return;
        }
        router.push("/checkout");
    };

    // ... [rest of the component remains the same until the return statement] ...

    return (
        <main className="bg-white font-unbounded text-black min-h-screen py-7">
            <div className="w-11/12 mx-auto">
                {isLoading ? (
                    <>
                        {/* Skeleton loading remains the same */}
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
                                                <td colSpan={5} className="text-center text-gray-400 p-4 border-b border-gray-200">
                                                    Your cart is empty. Add some products to continue shopping.
                                                </td>
                                            </tr>
                                        ) : (
                                            items.map((item) => {
                                                const product = getProductDetails(item.id);
                                                const itemKey = getItemKey(item);
                                                return (
                                                    <tr key={itemKey} className="border-b border-gray-200">
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
                                                                            {getProductNameWithFlavor(product, item.attributeId)}
                                                                        </p>
                                                                    </div>
                                                                    {product.isArchived && (
                                                                        <div className="text-red-500 font-semibold text-sm">(Out of Stock)</div>
                                                                    )}
                                                                </Link>
                                                            )}
                                                        </td>
                                                        <td className="p-4 text-left">
                                                            {product ? `$${(product.currentPrice / (product.packCount || 1)).toFixed(2)}` : 'N/A'}
                                                        </td>
                                                        <td className="p-4 text-left">
                                                            <div className={`w-fit border border-gray-200 rounded-full items-center flex py-1 ${product?.isArchived ? "opacity-50 pointer-events-none" : ""}`}>
                                                                <button
                                                                    onClick={() => handleDecrement(email, item.id, item.attributeId)}
                                                                    className="px-2 py-1 text-xs"
                                                                    disabled={product?.isArchived || loadingDecrement[itemKey]}
                                                                >
                                                                    {loadingDecrement[itemKey] ? (
                                                                        <FaSpinner className="animate-spin mx-auto" />
                                                                    ) : (
                                                                        <FaMinus />
                                                                    )}
                                                                </button>

                                                                <span className="px-2 font-light">{item.quantity}</span>

                                                                <button
                                                                    onClick={() => handleIncrement(email, item.id, item.attributeId)}
                                                                    className="px-2 py-1 text-xs"
                                                                    disabled={product?.isArchived || loadingIncrement[itemKey]}
                                                                >
                                                                    {loadingIncrement[itemKey] ? (
                                                                        <FaSpinner className="animate-spin mx-auto" />
                                                                    ) : (
                                                                        <FaPlus />
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 font-medium text-left">
                                                            {product ? `$${((product.currentPrice / (product.packCount || 1)) * item.quantity).toFixed(2)}` : 'N/A'}
                                                        </td>
                                                        <td className="p-4 text-left">
                                                            <button
                                                                onClick={() => handleRemoveItem(email, item.id, item.attributeId)}
                                                                className="text-[1.3rem] disabled:text-gray-400 disabled:cursor-not-allowed"
                                                                disabled={removingItems[itemKey]}
                                                            >
                                                                {removingItems[itemKey] ? (
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
                                                    ${calculateTotal().toFixed(2)}
                                                </td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td colSpan={3} className="p-4">
                                                    <Button
                                                        variant="secondary"
                                                        onClick={() => router.push("/")}
                                                        className="flex items-center gap-2 whitespace-nowrap"
                                                    >
                                                        <IoIosArrowBack />
                                                        Return to shop
                                                    </Button>
                                                </td>
                                                <td colSpan={2} className="p-4 text-right">
                                                    <Button
                                                        variant="primary"
                                                        onClick={handleCheckout}
                                                        className="flex items-center gap-2 whitespace-nowrap"
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
                                        const itemKey = getItemKey(item);
                                        return (
                                            <div key={itemKey} className="flex gap-4 border-gray-200 border-b pb-6">
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

                                                <div className="flex flex-col gap-2 w-1/2 sm:w-2/3">
                                                    <div className="text-left">
                                                        <p className="text-[1rem]">
                                                            {product ? getProductNameWithFlavor(product, item.attributeId) : 'N/A'}
                                                        </p>
                                                        <p className="">${product ? (product.currentPrice / (product.packCount || 1)).toFixed(2) : 'N/A'}</p>
                                                    </div>

                                                    <div className="flex items-center gap-10">
                                                        <div className={`w-fit border border-gray-200 rounded-full items-center flex py-1 ${product?.isArchived ? "opacity-50 pointer-events-none" : ""}`}>
                                                            <button
                                                                onClick={() => handleDecrement(email, item.id, item.attributeId)}
                                                                className="px-2 py-1 text-xs"
                                                                disabled={product?.isArchived || loadingDecrement[itemKey]}
                                                            >
                                                                {loadingDecrement[itemKey] ? (
                                                                    <FaSpinner className="animate-spin mx-auto" />
                                                                ) : (
                                                                    <FaMinus />
                                                                )}
                                                            </button>
                                                            <span className="px-2">{item.quantity}</span>
                                                            <button
                                                                onClick={() => handleIncrement(email, item.id, item.attributeId)}
                                                                className="px-2 py-1 text-xs"
                                                                disabled={product?.isArchived || loadingIncrement[itemKey]}
                                                            >
                                                                {loadingIncrement[itemKey] ? (
                                                                    <FaSpinner className="animate-spin mx-auto" />
                                                                ) : (
                                                                    <FaPlus />
                                                                )}
                                                            </button>
                                                        </div>

                                                        <div>
                                                            <button
                                                                onClick={() => handleRemoveItem(email, item.id, item.attributeId)}
                                                                className="text-[1.3rem] disabled:text-gray-400 disabled:cursor-not-allowed"
                                                                disabled={removingItems[itemKey]}
                                                            >
                                                                {removingItems[itemKey] ? (
                                                                    <FaSpinner className="animate-spin mx-auto" />
                                                                ) : (
                                                                    <RiDeleteBin5Line />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="">
                                                        Subtotal: ${product ? ((product.currentPrice / (product.packCount || 1)) * item.quantity).toFixed(2) : 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {items.length > 0 && (
                                <>
                                    <div className="flex items-center justify-between mt-8">
                                        <span className="p-4">
                                            Total <span>{items.length} Items</span>
                                        </span>
                                        <span className="p-4">
                                            ${calculateTotal().toFixed(2)}
                                        </span>
                                    </div>

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