"use client"
import Image from 'next/image'
import React, { useState, useEffect, useCallback, useRef, Suspense } from 'react'
import { CiSearch } from "react-icons/ci";
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from "framer-motion";
import useCart from '@/hooks/useCart';
import { Product } from '@/types/product';

// Define type for debounce function
type DebouncedFunction<T extends unknown[]> = (...args: T) => void;

const Navbar = () => {
    const [show, setshow] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const router = useRouter();
    // const searchParams = useSearchParams();
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const { items } = useCart();
    // Add state for sticky navbar
    const [isSticky, setIsSticky] = useState(false);
    const blackDivRef = useRef<HTMLDivElement>(null);
    // Add ref for hamburger menu
    const hamburgerMenuRef = useRef<HTMLDivElement>(null);
    const hamburgerButtonRef = useRef<HTMLDivElement>(null);

    // Create a handler function for clicking the search container
    const handleSearchContainerClick = () => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    };

    // Handle scroll event to make the aside sticky
    useEffect(() => {
        const handleScroll = () => {
            if (blackDivRef.current) {
                const blackDivBottom = blackDivRef.current.getBoundingClientRect().bottom;
                setIsSticky(blackDivBottom <= 0);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Handle outside click for hamburger menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Check if hamburger menu is open and clicked outside of menu and button
            if (
                show &&
                hamburgerMenuRef.current &&
                hamburgerButtonRef.current &&
                !hamburgerMenuRef.current.contains(event.target as Node) &&
                !hamburgerButtonRef.current.contains(event.target as Node)
            ) {
                setshow(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [show]);

    // Debounce function with proper typing
    const debounce = <T extends unknown[]>(func: (...args: T) => void, delay: number): DebouncedFunction<T> => {
        let timeoutId: NodeJS.Timeout;
        return (...args: T) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    };

    // Search products via API
    const searchProducts = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        setIsLoading(true);
        setShowResults(true);

        try {
            const response = await fetch(`/api/products?search=${encodeURIComponent(query)}&archived=false`);
            const data = await response.json();
            console.log('Search results:', data.products);
            setSearchResults(data.products || []);
        } catch (error) {
            console.error('Search failed:', error);
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Debounced search handler
    const debouncedSearch = useCallback(
        debounce((query: string) => {
            searchProducts(query);
        }, 500),
        []
    );

    // Update search query when URL changes
    useEffect(() => {
        // This only runs in the browser (after hydration)
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const search = params.get('search');
            if (search) {
                setSearchQuery(decodeURIComponent(search));
            }
        }
    }, []);

    // Trigger search when query changes
    useEffect(() => {
        debouncedSearch(searchQuery);
    }, [searchQuery, debouncedSearch]);

    // Handle clicking outside the search results to close them
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.search-container')) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const navItems = [
        { title: "Main", href: "/" },
        { title: "Vapes", href: "/" },
        { title: "Hookah", href: "/" },
        { title: "Supplements", href: "/" },
        { title: "Adults goods", href: "/" },
        { title: "Accessories", href: "/" },
        { title: "Blog", href: "/" },
        { title: "Contact us", href: "/" },
    ];

    const handleProductClick = (productId: string) => {
        router.push(`/product/${productId}`);
        setShowResults(false);
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <section className='font-unbounded'>
                <div ref={blackDivRef} className='bg-black p-3 text-white text-center text-sm md:text-base'>WARNING: These products contain nicotine. Nicotine is an addictive chemical.</div>
                <aside
                    className={`bg-white py-4 ${isSticky ? 'fixed top-0 left-0 right-0 z-40 shadow-md' : ''}`}
                    style={{ transition: 'all 0.3s ease' }}
                >
                    <div className='w-11/12 mx-auto flex items-center justify-between'>
                        <div className="relative flex items-center md:gap-4">
                            <div
                                ref={hamburgerButtonRef}
                                onClick={() => setshow(!show)}
                                className="relative w-10 z-30"
                            >
                                <Image
                                    src={show ? "/images/hamburger2.png" : "/images/hamburger.png"}
                                    alt="hamburger"
                                    width={21}
                                    height={21}
                                    className={`z-30 ${show ? "rotate-90 w-[18px]" : "rotate-0 w-5"} transition-all duration-300 ease-linear cursor-pointer`}
                                />
                            </div>
                            <div
                                ref={hamburgerMenuRef}
                                className={`absolute -top-2.5 -left-3.5 border border-white shadow-2xl bg-gradient-to-r from-[#3E2FE1] to-[#8C14AC] z-10 rounded-b-xl rounded-tr-xl ${show ? "w-[230px] h-[430px]" : "w-0 h-0"
                                    } transition-all duration-300 ease-linear overflow-hidden`}
                            >
                                <ul className="text-white text-[1.1rem] py-16 px-3 space-y-4 flex flex-col">
                                    {navItems.map(({ title, href }) => (
                                        <Link
                                            key={title}
                                            href={href}
                                            onClick={() => setshow(!show)}
                                            className="px-4 cursor-pointer"
                                        >
                                            {title}
                                        </Link>
                                    ))}
                                </ul>
                            </div>

                            {/* Search Bar with Dropdown */}
                            <div className="relative text-black search-container flex gap-2 items-center" onClick={handleSearchContainerClick}>
                                {/* Search input remains the same */}
                                <motion.input
                                    type="text"
                                    placeholder="search..."
                                    value={searchQuery}
                                    ref={searchInputRef}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => {
                                        if (searchQuery.trim()) setShowResults(true);
                                        setIsSearchFocused(true);
                                    }}
                                    onBlur={() => setIsSearchFocused(false)}
                                    className="hidden md:block border-white md:border-black border focus:border rounded-full py-1 px-3 pl-8 focus:outline-none focus:ring-2 focus:ring-[#8C14AC] focus:border-transparent"
                                    initial={{ width: "10rem" }}
                                    animate={{
                                        width: isSearchFocused ? "10rem" : "10rem",
                                        transition: { duration: 0.3, ease: "easeInOut" }
                                    }}
                                />
                                <motion.input
                                    type="text"
                                    placeholder="search..."
                                    value={searchQuery}
                                    ref={searchInputRef}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => {
                                        if (searchQuery.trim()) setShowResults(true);
                                        setIsSearchFocused(true);
                                    }}
                                    onBlur={() => setIsSearchFocused(false)}
                                    className="block md:hidden border-white md:border-black border focus:border rounded-full py-1 px-3 pl-8 focus:outline-none focus:ring-2 focus:ring-[#8C14AC] focus:border-transparent"
                                    initial={{ width: "2rem" }}
                                    animate={{
                                        width: isSearchFocused ? "10rem" : "2rem",
                                        transition: { duration: 0.3, ease: "easeInOut" }
                                    }}
                                />

                                {/* Search icon with click handler */}
                                <div
                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                    onClick={() => {
                                        setIsSearchFocused(true);
                                        searchInputRef.current?.focus();
                                    }}
                                >
                                    <CiSearch size={20} />
                                </div>

                                {/* Animated logo - wrapped in Link so it will redirect */}
                                <AnimatePresence>
                                    {!isSearchFocused && (
                                        <motion.div
                                            initial={{ opacity: 1 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0, transition: { duration: 0.2 } }}
                                            className="md:hidden"
                                        >
                                            <Link
                                                href="/"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Image
                                                    src={"/images/logo.png"}
                                                    width={150}
                                                    height={150}
                                                    alt='getsmoke_logo'
                                                />
                                            </Link>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Search Results Dropdown */}
                                {showResults && (
                                    <div className="absolute z-50 top-full -left-10 lg:left-0 w-[92vw] lg:w-[60vw] xl:w-[40vw] mt-2 bg-white border border-gray-300 rounded-md shadow-lg max-h-96 overflow-y-auto">
                                        {isLoading ? (
                                            <div className="flex justify-center items-center p-4">
                                                <div className="w-5 h-5 border-t-2 border-b-2 border-[#8C14AC] rounded-full animate-spin"></div>
                                                <span className="ml-2">Loading...</span>
                                            </div>
                                        ) : searchResults.length > 0 ? (
                                            <div>
                                                {searchResults.map((product) => (
                                                    <div
                                                        key={product.id}
                                                        className="p-2 hover:bg-gray-100 cursor-pointer flex items-center border-b border-gray-200"
                                                        onClick={() => handleProductClick(product.id)}
                                                    >
                                                        <div className="w-12 h-12 relative mr-3 flex-shrink-0">
                                                            {product.images && product.images.length > 0 ? (
                                                                <Image
                                                                    src={product.images[0].url}
                                                                    alt={product.name}
                                                                    fill
                                                                    sizes="48px"
                                                                    className="object-cover rounded-md"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                                                                    <span className="text-xs text-gray-400">No image</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                                                            <p className="text-xs text-gray-500">${product.currentPrice.toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : searchQuery.trim() ? (
                                            <div className="p-3 text-center text-gray-500">No products found</div>
                                        ) : null}
                                    </div>
                                )}
                            </div>

                        </div>
                        <div className="md:mr-28">
                            <Link href={"/"}>
                                <Image src={"/images/logo.png"} width={180} height={180} alt='getsmoke_logo' className='hidden md:block' />
                            </Link>
                        </div>
                        <div className="flex gap-3 md:gap-5">
                            <div>
                                <Link href={"/my-account"}>
                                    <Image src={"/images/user.png"} width={25} height={25} alt='getsmoke_logo' className="cursor-pointer" />
                                </Link>
                            </div>
                            <div className="relative">
                                <Link href="/cart">
                                    <Image
                                        src="/images/cart.png"
                                        width={25}
                                        height={25}
                                        alt="cart"
                                    />
                                    {items.length > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
                                            {items.length}
                                        </span>
                                    )}
                                </Link>
                            </div>
                        </div>
                    </div>
                </aside>
                {/* Add a placeholder div when navbar is sticky to prevent content jump */}
                {isSticky && <div style={{ height: '76px' }}></div>}
            </section>
        </Suspense>
    )
}

export default Navbar