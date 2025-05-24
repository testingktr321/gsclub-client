"use client";
import Image from 'next/image';
import React from 'react';
import { Button } from '../ui/button';
// import { FaChevronDown } from 'react-icons/fa';
// import { useSession } from 'next-auth/react';
// import useCart from '@/hooks/useCart';
import { Product } from '@/types/product';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import RelatedPRoduct from './RelatedPRoduct';
// import { toast } from 'react-hot-toast';

interface SingleProductProps {
    product: Product | null;
}

// const CustomDropdown = ({
//     options,
//     selectedValue,
//     onSelect,
//     disabledOptions = [],
//     placeholder = "Select an option"
// }: {
//     options: { id: string, name: string }[],
//     selectedValue: string,
//     onSelect: (value: string) => void,
//     disabledOptions?: string[],
//     placeholder?: string
// }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const dropdownRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//                 setIsOpen(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);

//     // Find the currently selected option
//     const selectedOption = options.find(opt => opt.id === selectedValue);

//     return (
//         <div className="relative w-full text-sm" ref={dropdownRef}>
//             <button
//                 type="button"
//                 className={`flex items-center justify-between w-full px-4 py-2 border rounded-md ${isOpen ? 'border-blue-500' : 'border-gray-300'}`}
//                 onClick={() => setIsOpen(!isOpen)}
//             >
//                 <span className="truncate">
//                     {selectedOption?.name || placeholder}
//                 </span>
//                 <FaChevronDown className={`ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
//             </button>

//             {isOpen && (
//                 <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
//                     {options.map((option) => {
//                         const isDisabled = disabledOptions.includes(option.id);

//                         return (
//                             <button
//                                 key={option.id}
//                                 type="button"
//                                 className={`w-full text-left px-4 py-2 
//                                     ${selectedValue === option.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'} 
//                                     ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
//                                 onClick={(e) => {
//                                     e.stopPropagation();
//                                     if (!isDisabled) {
//                                         onSelect(option.id);
//                                         setIsOpen(false);
//                                     }
//                                 }}
//                                 disabled={isDisabled}
//                             >
//                                 {option.name}
//                             </button>
//                         );
//                     })}
//                 </div>
//             )}
//         </div>
//     );
// };

const ProductPage = ({ product }: SingleProductProps) => {
    // const { data: session } = useSession();
    // const email = session?.user.email || "";
    // const cart = useCart();
    // const [quantity, setQuantity] = useState(1);
    // const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    // const [selectedFlavors, setSelectedFlavors] = useState<{ [key: number]: string }>({});
    // const [availableFlavors, setAvailableFlavors] = useState<{ id: string, name: string }[]>([]);

    const hasMultipleFlavors = product?.productFlavors && product.productFlavors.length > 0;
    const hasSingleFlavor = product?.flavorId && !hasMultipleFlavors;

    // useEffect(() => {
    //     if (hasMultipleFlavors) {
    //         // Get all available flavors from the product
    //         const flavors = product.productFlavors!.map(pf => ({
    //             id: pf.flavorId,
    //             name: pf.flavor.name
    //         }));
    //         setAvailableFlavors(flavors);

    //         // Initialize selected flavors only if they haven't been selected yet
    //         if (flavors.length > 0) {
    //             setSelectedFlavors(prevSelected => {
    //                 // Only set default values for uninitialized selections
    //                 const newSelections = { ...prevSelected };
    //                 for (let i = 0; i < product.packCount; i++) {
    //                     if (!newSelections[i]) {
    //                         newSelections[i] = flavors[0].id;
    //                     }
    //                 }
    //                 return newSelections;
    //             });
    //         }
    //     } else if (hasSingleFlavor) {
    //         // For single flavor, set it as the only available option
    //         if (product.flavorId) {
    //             setAvailableFlavors([{
    //                 id: product.flavorId,
    //                 name: product.flavor?.name || "Default Flavor"
    //             }]);

    //             setSelectedFlavors({ 0: product.flavorId });
    //         }
    //     }
    // }, [product, hasMultipleFlavors, hasSingleFlavor]);

    // const getDisabledFlavors = (currentIndex: number) => {

    //     // Only disable flavors that are already selected in other positions
    //     // and only if we're enforcing unique flavor selection
    //     const enforceUniqueFlavors = availableFlavors.length === product?.packCount;

    //     if (enforceUniqueFlavors) {
    //         return Object.entries(selectedFlavors)
    //             .filter(([index]) => Number(index) !== currentIndex)
    //             .map(([, flavorId]) => flavorId);
    //     }

    //     return [];
    // };

    // const handleIncrement = () => {
    //     setQuantity((prev) => prev + 1);
    // };

    // const handleDecrement = () => {
    //     if (quantity > 1) {
    //         setQuantity((prev) => prev - 1);
    //     }
    // };

    // const handleFlavorChange = (packIndex: number, flavorId: string) => {
    //     setSelectedFlavors(prev => ({
    //         ...prev,
    //         [packIndex]: flavorId
    //     }));
    // };

    // const allFlavorsSelected = () => {
    //     if (!hasMultipleFlavors) return true;
    //     for (let i = 0; i < product.packCount; i++) {
    //         if (!selectedFlavors[i]) return false;
    //     }
    //     return true;
    // };

    // const addToCart = async (event: React.MouseEvent<HTMLButtonElement>) => {
    //     event.stopPropagation();
    //     setIsLoading(true);

    //     try {
    //         if (hasMultipleFlavors && !allFlavorsSelected()) {
    //             toast.error("Please select all flavors before adding to cart");
    //             setIsLoading(false);
    //             return;
    //         }

    //         if (hasSingleFlavor) {
    //             // Simple case - single flavor product
    //             const productData = {
    //                 id: product!.id,
    //                 quantity: quantity,
    //             };
    //             await cart.addItem(email, productData);
    //         } else if (hasMultipleFlavors) {
    //             // Pack of products - collect all items first
    //             const itemsToAdd = [];
    //             const flavorGroups: { [key: string]: number } = {};

    //             // Count how many of each flavor was selected
    //             for (let i = 0; i < product.packCount; i++) {
    //                 const flavorId = selectedFlavors[i];
    //                 if (flavorId) {
    //                     flavorGroups[flavorId] = (flavorGroups[flavorId] || 0) + 1;
    //                 }
    //             }

    //             // Create array of items to add in batch
    //             for (const [flavorId, count] of Object.entries(flavorGroups)) {
    //                 itemsToAdd.push({
    //                     id: product!.id,
    //                     quantity: count * quantity, // Multiply by the quantity of packs
    //                     attributeId: flavorId // Using attributeId to distinguish flavors
    //                 });
    //             }

    //             // Add all items at once
    //             await cart.addItems(email, itemsToAdd);
    //         }
    //     } catch (error) {
    //         console.error("Error adding to cart:", error);
    //         toast.error("Failed to add items to cart");
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    if (!product) {
        return <div className="flex justify-center items-center min-h-screen">
            <div className="text-red-500 bg-red-100 p-4 rounded-md">
                <p className="font-semibold">Product not found</p>
            </div>
        </div>;
    }

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
                            {hasSingleFlavor && product.flavor?.name}
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
                            {product.packCount > 1 && (
                                <span>
                                    (each pack ${(product.currentPrice / product.packCount).toFixed(2)})
                                </span>
                            )}
                        </div>

                        {/* Product Specifications */}
                        <div className="space-y-3">
                            <h2 className="font-bold text-xl text-[#0C0B0B]">Device Details:</h2>
                            <div className="space-y-1.5">
                                {product.Nicotine && renderField("Nicotine Strength", product.Nicotine.name)}
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

                        {/* Flavor Selection for Packs */}
                        {/* {hasMultipleFlavors && availableFlavors.length > 0 && (
                            <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                                <h3 className="font-semibold mb-4">Pack of {product.packCount} - Select Flavors</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Array.from({ length: product.packCount }).map((_, index) => (
                                        <div key={index} className="flex flex-col gap-1">
                                            <span className="font-medium text-sm">Flavor {index + 1}:</span>
                                            <CustomDropdown
                                                options={availableFlavors}
                                                selectedValue={selectedFlavors[index] || ""}
                                                onSelect={(value) => handleFlavorChange(index, value)}
                                                disabledOptions={getDisabledFlavors(index)}
                                                placeholder="Select flavor"
                                            />
                                        </div>
                                    ))}
                                </div>
                                {!allFlavorsSelected() && (
                                    <p className="text-sm text-red-500 mt-2">
                                        Please select all {product.packCount} flavors before adding to cart
                                    </p>
                                )}
                            </div>
                        )} */}

                        {/* Stock Action Section */}
                        <div className="mt-8 flex flex-col lg:flex-row w-full items-center gap-4">
                            {product.isArchived ? (
                                <div className="w-full text-center bg-gray-100 border border-gray-300 text-gray-600 py-3 rounded-full font-medium">
                                    Not in Stock
                                </div>
                            ) : (
                                <>
                                    {/* Quantity Selector - Only show for single flavor products */}
                                    {/* {!hasMultipleFlavors && (
                                        <div className="border border-slate-300 px-4 py-2 rounded-full flex items-center justify-between gap-6 w-full lg:w-fit">
                                            <span className="cursor-pointer" onClick={handleDecrement}>
                                                <FaMinus />
                                            </span>
                                            {quantity}
                                            <span className="cursor-pointer" onClick={handleIncrement}>
                                                <FaPlus />
                                            </span>
                                        </div>
                                    )} */}

                                    {/* Add to Cart Button */}
                                    {/* <Button
                                        type="submit"
                                        variant="primary"
                                        className="px-8 w-full"
                                        disabled={isLoading || (hasMultipleFlavors && !allFlavorsSelected())}
                                        onClick={addToCart}
                                    >
                                        {isLoading ? (
                                            <FaSpinner className="animate-spin mx-auto" />
                                        ) : (
                                            `Add to Cart${hasMultipleFlavors ? ` (${product.packCount} items)` : ''}`
                                        )}
                                    </Button> */}

                                    {product?.redirectLink && (
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            className="px-8 w-full leading-4 whitespace-nowrap"
                                        >
                                            <Link href={product?.redirectLink || ""}>
                                                Shop Now
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

            <section className=''>
                {product.flavorId ? (
                    <RelatedPRoduct brandId={product.brandId} flavorId={product.flavorId} />

                ) : (
                    <RelatedPRoduct brandId={product.brandId} />
                )}
            </section>
        </main>
    );
};

export default ProductPage;