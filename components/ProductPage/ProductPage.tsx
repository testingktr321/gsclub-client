"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { format } from "date-fns";
// import { FaChevronDown } from 'react-icons/fa';
// import { useSession } from 'next-auth/react';
// import useCart from '@/hooks/useCart';
import { useRouter } from "next/navigation";
import Link from "next/link";
import RelatedPRoduct from "./RelatedPRoduct";
import { useProduct } from "./useProduct";
import Loading from "./loading";
import Faq from "./Faq";
import { useDeleteReview } from "./useReview";
import { Edit, X } from "lucide-react";
import StarRating from "../ui/StarRating";
import ReviewForm from "./ReviewForm";
import { useSession } from "next-auth/react";
import Modal from "../ui/modal";

// import { toast } from 'react-hot-toast';

interface SingleProductProps {
    productId: string;
}

const ProductPage = ({ productId }: SingleProductProps) => {
    const { data: product, isLoading, error } = useProduct(productId);

    // Smart default states based on content availability
    const hasDescription = product?.detailDescription;
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(true); // Description should always be open by default when it exists
    const [isDetailsOpen, setIsDetailsOpen] = useState(!hasDescription); // Device details open only when description doesn't exist

    const { data: session } = useSession();
    const [showAllReviews, setShowAllReviews] = useState(false);
    const { mutate: deleteReview } = useDeleteReview();
    const [isOpen, setIsOpen] = useState(false);

    // State for ProductContentSection
    const [isContentSectionExpanded, setIsContentSectionExpanded] = useState(false);

    // const { data: session } = useSession();
    // const email = session?.user.email || "";
    // const cart = useCart();
    // const [quantity, setQuantity] = useState(1);
    // const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    // const [selectedFlavors, setSelectedFlavors] = useState<{ [key: number]: string }>({});
    // const [availableFlavors, setAvailableFlavors] = useState<{ id: string, name: string }[]>([]);

    // Loading state
    if (isLoading) {
        return <Loading />;
    }

    // Error state
    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-500 bg-red-100 p-4 rounded-md">
                    <p className="font-semibold">Error loading product</p>
                    <p className="text-sm mt-1">{error.message}</p>
                </div>
            </div>
        );
    }

    const hasMultipleFlavors =
        product?.productFlavors && product.productFlavors.length > 0;
    const hasSingleFlavor = product?.flavorId && !hasMultipleFlavors;

    if (!product) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-500 bg-red-100 p-4 rounded-md">
                    <p className="font-semibold">Product not found</p>
                </div>
            </div>
        );
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
        <main className="bg-white min-h-screen">
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
                                    (each pack $
                                    {(product.currentPrice / product.packCount).toFixed(2)})
                                </span>
                            )}
                        </div>

                        {/* Product Description */}
                        {product.detailDescription && (
                            <div className="space-y-3">
                                <button
                                    className="flex items-center gap-2 font-bold text-xl text-[#0C0B0B]"
                                    onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                                >
                                    Description
                                    <svg
                                        className={`w-5 h-5 transition-transform ${isDescriptionOpen ? "rotate-180" : ""
                                            }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>
                                {isDescriptionOpen && (
                                    <div
                                        className="prose max-w-none"
                                        dangerouslySetInnerHTML={{
                                            __html: product.detailDescription,
                                        }}
                                    />
                                )}
                            </div>
                        )}

                        {/* Product Specifications */}
                        <div className="space-y-3">
                            <button
                                className="flex items-center gap-2 font-bold text-xl text-[#0C0B0B]"
                                onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                            >
                                Device Details
                                <svg
                                    className={`w-5 h-5 transition-transform ${isDetailsOpen ? "rotate-180" : ""
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>
                            {isDetailsOpen && (
                                <div className="space-y-1.5">
                                    {product.Nicotine &&
                                        renderField("Nicotine Strength", product.Nicotine.name)}
                                    {product.productPuffs && product.productPuffs.length > 0 && (
                                        <div className="flex">
                                            <p className="font-medium">Puffs:</p>
                                            <p className="ml-2">
                                                {product.productPuffs.map((pp, index) => (
                                                    <span key={index}>
                                                        {index > 0 && " / "}
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
                                        <div className="flex">
                                            <p className="font-medium">Extra Features:</p>
                                            <div
                                                className="prose max-w-none ml-2"
                                                dangerouslySetInnerHTML={{ __html: product.extra }}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Stock Action Section */}
                        <div className="mt-8 flex flex-col lg:flex-row w-full items-center gap-4">
                            {product.isArchived ? (
                                <div className="w-full text-center bg-gray-100 border border-gray-300 text-gray-600 py-3 rounded-full font-medium">
                                    Not in Stock
                                </div>
                            ) : (
                                <>
                                    {product?.redirectLink && (
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            className="px-8 w-full leading-4 whitespace-nowrap"
                                        >
                                            <Link href={product?.redirectLink || ""}>Shop Now</Link>
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

            {/*------------------- Review section --------------------- */}

            <section className="w-11/12 mx-auto mt-10 font-unbounded">
                <div className="bg-black h-[2.5px] mb-7 md:mb-10 rounded-full"></div>
                <h2 className="text-center text-xl md:text-2xl font-semibold mb-7 md:mb-10">
                    Product Reviews
                </h2>

                <div className="mb-6 flex w-full justify-center items-center">
                    <Button onClick={() => setIsOpen(true)} variant="secondary">
                        <Edit className="mr-2" size={16} />
                        Write a Review
                    </Button>
                </div>

                <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="xl">
                    <div className="p-4">
                        <ReviewForm
                            productId={productId}
                            onSuccess={() => setIsOpen(false)}
                        />
                    </div>
                </Modal>

                <div className="space-y-6">
                    {product?.Review.length > 0 ? (
                        <>
                            {(showAllReviews
                                ? product.Review
                                : product.Review.slice(0, 3)
                            ).map((review) => (
                                <div key={review.id} className="border-b pb-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold">{review.userName}</h3>
                                            <div className="flex items-center gap-2 my-1">
                                                <StarRating
                                                    rating={review.rating}
                                                    setRating={() => { }}
                                                    readOnly
                                                />
                                                <span className="text-sm text-gray-500">
                                                    {format(new Date(review.createdAt), "MMMM d, yyyy")}
                                                </span>
                                            </div>
                                            <h4 className="font-medium mt-1">{review.title}</h4>
                                            <p className="text-gray-700 mt-1">{review.comment}</p>
                                        </div>

                                        {session?.user?.email === review.userEmail && (
                                            <button
                                                onClick={() =>
                                                    deleteReview({
                                                        reviewId: review.id,
                                                        userEmail: review.userEmail,
                                                        productId: product.id,
                                                    })
                                                }
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {product.Review.length > 3 && !showAllReviews && (
                                <div className="text-center mt-4">
                                    <Button
                                        variant="secondary"
                                        onClick={() => setShowAllReviews(true)}
                                    >
                                        See All Reviews ({product.Review.length})
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">
                                No reviews yet. Be the first to review!
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/*------------------- Product Content Section --------------------- */}
            {product.ProductContentSection && (
                <section className="w-11/12 mx-auto mt-10 font-unbounded text-center">
                    <div className="bg-black h-[2.5px] mb-7 md:mb-10 rounded-full"></div>

                    <div className="space-y-4">
                        <h2 className="text-xl md:text-2xl font-semibold text-[#0C0B0B]">
                            {product.ProductContentSection.title}
                        </h2>

                        <p className="text-gray-700 leading-relaxed">
                            {product.ProductContentSection.description}
                        </p>

                        {product.ProductContentSection.detailDescription && (
                            <div className="bg-gray-100 rounded-lg p-4 space-y-4">
                                {isContentSectionExpanded && (
                                    <div
                                        className="prose max-w-none text-gray-700 text-center"
                                        dangerouslySetInnerHTML={{
                                            __html: product.ProductContentSection.detailDescription,
                                        }}
                                    />
                                )}

                                <div className="flex justify-center">
                                    <Button
                                        variant="secondary"
                                        onClick={() =>
                                            setIsContentSectionExpanded(!isContentSectionExpanded)
                                        }
                                        className="flex items-center gap-2"
                                    >
                                        {isContentSectionExpanded ? "Read Less" : "Read More"}
                                        <svg
                                            className={`w-4 h-4 transition-transform ${isContentSectionExpanded ? "rotate-180" : ""
                                                }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}

            <section className="">
                {product.flavorId ? (
                    <RelatedPRoduct
                        brandId={product.brandId}
                        flavorId={product.flavorId}
                        productId={product.id}
                    />
                ) : (
                    <RelatedPRoduct brandId={product.brandId} productId={product.id} />
                )}
            </section>

            <section className="-mt-4 mb-28">
                <Faq />
            </section>

            <section className="w-full -mt-7 md:-mt-10">
                <Image
                    src="/images/rp_banner.png"
                    width={1000}
                    height={1000}
                    alt="banner"
                    className="w-full h-auto object-cover md:block hidden"
                />
                <Image
                    src="/images/rp_banner2.png"
                    width={1000}
                    height={1000}
                    alt="banner"
                    className="w-full h-auto object-cover md:hidden block"
                />
            </section>
        </main>
    );
};

export default ProductPage;